import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  signupValidation,
  loginValidation
} from "../validators/authValidation.js";
import crypto from "crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

//Later On, Implement this as well :-
/*
If someone tries to use an expired or already used refresh token, it’s a sign of a breach. In that case, you might want to clear the entire refreshToken array to force a logout on all devices. 
*/

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1 * 60 * 1000 //1 minute - just to test auth retry issue
};

/*
OAuth redirect = cross-site navigation
"strict" → cookie NOT sent ❌
Your state validation will FAIL
*/
const googleOAuthCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", 
    maxAge: 5 * 60 * 1000 // 5 min
}

// 🔐 Generate Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// 🍪 Send refresh token in cookie
const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, refreshTokenCookieOptions);
};

// 🍪 Send access token in cookie (Postman friendly)
const sendAccessToken = (res, token) => {
  res.cookie("accessToken", token, accessTokenCookieOptions);
};

// 🧹 Safe user response
const getSafeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    familyId: user.familyId ? user.familyId._id : null,
  };
};

// =======================
// 🟢 LOCAL SIGNUP
// =======================
export const signup = async (req, res) => {
    try {
        const { value, error } = signupValidation.validate(req.body);

        if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        }

        const { name, email, password } = value;

        const existingUser = await User.findOne({ email });


        if (existingUser) {
          // Case: Google-only account -> allow password setup
          if (!existingUser.authProvider || !existingUser.authProvider.includes("local")) {
            const hashedPassword = await bcrypt.hash(password, 10);

            existingUser.password = hashedPassword;
            existingUser.authProvider.push("local");

            await existingUser.save();

            return res.json({
              message: "Password set successfully. You can now login with email/password."
            });
          }

          // Already has local account
          return res.status(400).json({
            message: "User already exists. Please login."
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
        name,
        email,
        password: hashedPassword,
        authProvider: ["local"],
        refreshToken: []
        });

        const { accessToken, refreshToken } = generateTokens(user._id);

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshToken.push(hashedRefreshToken);

        await user.save();

        sendRefreshToken(res, refreshToken);
        sendAccessToken(res, accessToken);

        // return res.status(201).json({ success: true, user: getSafeUser(user), accessToken });

        return res.status(201).json({ success: true, user: getSafeUser(user), });

    } catch (err) {
      console.error("Error in signup controller : " , err);
        return res.status(500).json({ success: false, message: "Some error occurred. Please try again later" });
    }
};

// =======================
// 🟢 LOCAL LOGIN
// =======================
export const login = async (req, res) => {
  try {
    const { value, error } = loginValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = value;

    const user = await User.findOne({ email }).populate("familyId", "_id");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.authProvider.includes("local")){
      return res.status(400).json({
        success: false,
        message: "This account uses google login."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    if (!user.refreshToken) user.refreshToken = [];
    user.refreshToken.push(hashedRefreshToken);

    await user.save();

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);

    return res.status(200).json({
      success: true,
      user: getSafeUser(user),
      accessToken
    });

  } catch (err) {
    console.error("Error in login controller : " , err);
    return res.status(500).json({
      success: false,
      message: "Some error occurred. Please try again later."
    });
  }
};

// =======================
// 🔁 REFRESH TOKEN
// =======================
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    let isValid = false;

    for (let rt of user.refreshToken) {
      const match = await bcrypt.compare(token, rt);
      if (match) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
  return res.status(403).json({
    success: false,
    code: "INVALID_REFRESH_TOKEN",
    message: "Invalid refresh token"
  });
}

    // let newTokens = [];

    // for (let rt of user.refreshToken) {
    //   const match = await bcrypt.compare(token, rt);
    //   if (!match) newTokens.push(rt);
    // }

    // const { accessToken, refreshToken } = generateTokens(user._id);
    // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // newTokens.push(hashedRefreshToken);
    // user.refreshToken = newTokens;

    // await user.save();

    // sendRefreshToken(res, refreshToken);
    // sendAccessToken(res, accessToken);


    const updatedTokens = [];

for (let rt of user.refreshToken) {
  const match = await bcrypt.compare(token, rt);
  if (!match) updatedTokens.push(rt);
}

const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

updatedTokens.push(hashedRefreshToken);

// 🔥 ATOMIC UPDATE (NO VERSION ERROR)
await User.findByIdAndUpdate(user._id, {
  refreshToken: updatedTokens
});
sendRefreshToken(res, newRefreshToken);
sendAccessToken(res, accessToken);
    // return res.json({
    //   success: true,
    //   accessToken
    // });

    return res.json({
      success: true,
    });

  } catch (err) {
    console.error("Error in refresh token controller : " , err);
      // 🔴 Refresh token expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      code: "REFRESH_TOKEN_EXPIRED",
      message: "Session expired. Please login again."
    });
  }

  // 🔴 Invalid token (tampered / wrong secret)
  if (err.name === "JsonWebTokenError") {
    return res.status(403).json({
      success: false,
      code: "INVALID_REFRESH_TOKEN",
      message: "Invalid refresh token"
    });
  }

  return res.status(403).json({
    success: false,
    code: "REFRESH_FAILED",
    message: "Refresh failed"
  });

  }
};

// =======================
// 🔴 LOGOUT (PER DEVICE)
// =======================
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (user) {
        let newTokens = [];

        for (let rt of user.refreshToken) {
          const match = await bcrypt.compare(token, rt);
          if (!match) newTokens.push(rt);
        }

        user.refreshToken = newTokens;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    res.clearCookie("accessToken", accessTokenCookieOptions);

    return res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    res.clearCookie("refreshToken", refreshTokenCookieOptions);

    res.clearCookie("accessToken", accessTokenCookieOptions);

    console.error("Error in logout controller : " , err);

    return res.json({
      success: false,
      message: "Logged out"
    });
  }
};


export const googleAuth = (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  // req.session.googleState = state;


  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state
  });

  res.cookie("google_oauth_state", state, googleOAuthCookieOptions);

  res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
};

export const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    // 🔐 STATE VALIDATION (CRITICAL)
    const storedState = req.cookies.google_oauth_state;

    if (!state || state !== storedState) {
      res.clearCookie("google_oauth_state"); 
      return res.status(401).json({
        success: false,
        message: "Invalid state (CSRF detected)"
      });
    }

    if (!code) {
      res.clearCookie("google_oauth_state"); 
      return res.status(400).json({
        success: false,
        message: "Authorization code missing"
      });
    }

  // cleanup
  res.clearCookie("google_oauth_state");

    // 1️⃣ Exchange code for tokens
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.log(tokenData);
      res.clearCookie("google_oauth_state"); 
      return res.status(400).json({
        success: false,
        message: "Token exchange failed"
      });
    }

    // 2️⃣ Get user info
    const userRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    if (!userRes.ok) {
      res.clearCookie("google_oauth_state"); 
      return res.status(400).json({
        success: false,
        message: "Failed to fetch Google user"
      });
    }

    const googleUser = await userRes.json();
    

    // 3️⃣ Extract data
    const googleId = googleUser.sub;
    const email = googleUser.email;


    if (!googleUser.email) {
      res.clearCookie("google_oauth_state"); 
      return res.status(400).json({
        success: false,
        message: "Google account has no email"
      });
    }

    let user = await User.findOne({ googleId });

    // =========================
    // 🟢 USER CREATION / LOGIN
    // =========================

    if (!user) {
      // check email match
      const existingEmailUser = await User.findOne({ email });

      if (existingEmailUser) {
        // link account
        existingEmailUser.googleId = googleUser.sub;
        if (!existingEmailUser.authProvider.includes("google")) {
          existingEmailUser.authProvider.push("google");
        }
        user = await existingEmailUser.save();
      } else {
        user = await User.create({
          name: googleUser.name,
          email,
          googleId,
          authProvider: ["google"],
          refreshToken: []
        });
      }
    }

    // =========================
    // 🔐 USE YOUR EXISTING JWT SYSTEM
    // =========================
    const { accessToken, refreshToken } = generateTokens(user._id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken.push(hashedRefreshToken);
    await user.save();

    sendRefreshToken(res, refreshToken);
    sendAccessToken(res, accessToken);

    return res.redirect(`${process.env.CLIENT_URL}/dashboard/family`);

  } catch (err) {
    console.error("Google OAuth Error:", err);
    res.clearCookie("google_oauth_state");
    return res.status(500).json({
      success: false,
      message: "Google login failed"
    });
  }
};
