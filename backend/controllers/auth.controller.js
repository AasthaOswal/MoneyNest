import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from "../validators/authValidation.js";
import crypto from "crypto";
import {sendEmailBrevoNoAttachments} from '../utils/email/sendEmailBrevo.js';

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

//Later On, Implement this as well :-
/*
If someone tries to use an expired or already used refresh token, it’s a sign of a breach. In that case, you might want to clear the entire refreshToken array to force a logout on all devices. 
*/

const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000 // 24 hrs = 1 day
};

/*
OAuth redirect = cross-site navigation
"strict" → cookie NOT sent ❌
Your state validation will FAIL
*/
const googleOAuthCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 5 * 60 * 1000 // 5 min
}

// 🔐 Generate Token
const generateToken = (userId,familyId, tokenVersion) => {
  const token = jwt.sign(
    { userId, familyId, tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};

// 🍪 Send refresh token in cookie
const sendToken = (res, token) => {
  res.cookie("token", token, tokenCookieOptions);
};


// 🧹 Safe user response
const getSafeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
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
        });

        const token = generateToken(user._id, null, user.tokenVersion);

        await user.save();

        sendToken(res, token)

        return res.status(201).json({ success: true, user: getSafeUser(user),});

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
    console.log("insdie login")
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

    const token  = generateToken(user._id,  user.familyId?._id || null, user.tokenVersion);


    await user.save();

    sendToken(res, token);

    return res.status(200).json({
      success: true,
      user: getSafeUser(user),
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
// 🔴 LOGOUT (PER DEVICE)
// =======================
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { tokenVersion: 1 } }, // Atomic increment
      { new: true }                  // Returns the updated document
    );


    if(!updatedUser){
      return res.json({success: false,message: "Some issue happened. Please try again later"});
    }


    res.clearCookie("token", tokenCookieOptions);


    return res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    res.clearCookie("token", tokenCookieOptions);

    console.error("Error in logout controller : " , err);

    return res.json({
      success: false,
      message: "Some issue happened. Please try again later"
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

    if (!googleUser.email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google account email is not verified"
      });
    }
    

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
        });
      }
    }

    // =========================
    // 🔐 USE YOUR EXISTING JWT SYSTEM
    // =========================
    const token = generateToken(user._id,  user.familyId?._id || null, user.tokenVersion);

    console.log("Cookies before redirect:", req.cookies);


    sendToken(res, token);
    
    return res.redirect(`${process.env.CLIENT_URL}/auth/callback`);

  } catch (err) {
    console.error("Google OAuth Error:", err);
    res.clearCookie("google_oauth_state");
    return res.status(500).json({
      success: false,
      message: "Google login failed"
    });
  }
};



export const forgotPassword = async (req, res) => {
  try {

    const { value, error } = forgotPasswordValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = value;

    const user = await User.findOne({ email });

    // 🔐 Prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent"
      });
    }

    // ❌ If Google-only account
    if (!user.authProvider.includes("local")) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google login"
      });
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // 🔗 Reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 📩 Email content
    const htmlContent = `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click below link (valid for 15 minutes):</p>
      <a href="${resetURL}" target="_blank">${resetURL}</a>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmailBrevoNoAttachments({
      toEmail: user.email,
      subject: "Reset Your Password",
      htmlContent
    });

    return res.status(200).json({
      success: true,
      message: "Reset link sent to email"
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};



export const resetPassword = async (req, res) => {
  try {
        const { value, error } = resetPasswordValidation.validate({password : req.body.password, token : req.params.token});

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { password } = value;
    const { token } = value;
    // 🔐 Hash incoming token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });


    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // 🔒 Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // ❌ Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Invalidate every existing JWT
    user.tokenVersion += 1;


    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login again."
    });

  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};


export const getSocketToken = (req, res) => {
  try {
    const socketToken = jwt.sign(
    {
      userId: req.user.userId,
      familyId: req.user.familyId,
    },
    process.env.SOCKET_JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );

  res.json({
    success: true,
    socketToken,
  });
  } catch (error) {
    console.log("error in get socket token: ", error);
  }
};
