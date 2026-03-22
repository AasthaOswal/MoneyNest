import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  signupValidation,
  loginValidation
} from "../validators/authValidation.js";

// 🔐 Generate Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m"
  });

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d"
    }
  );

  return { accessToken, refreshToken };
};

// 🍪 Send refresh token in cookie
const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};


// 🍪 Send access token in cookie
const sendAccessToken = (res, token) => {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

// 🧹 Safe user response
const getSafeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

// =======================
// 🟢 LOCAL SIGNUP
// =======================
export const signup = async (req, res) => {
  try {
    const { value,error } = signupValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please login."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local"
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    // hash refresh token before storing
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    sendRefreshToken(res, refreshToken);

    res.status(201).json({
      user: getSafeUser(user),
      accessToken
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Some error occurred. Please try again later." });
  }
};

// =======================
// 🟢 LOCAL LOGIN
// =======================
export const login = async (req, res) => {
  try {
    const {value, error } = loginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        message: "This account uses Google login. Please continue with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    sendRefreshToken(res, refreshToken);

    // for easier postman testing.
    sendAccessToken(res, accessToken);

    res.status(200).json({
      user: getSafeUser(user),
      accessToken
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Some error occurred. Please try again later." });
  }
};

// =======================
// 🔁 REFRESH TOKEN
// =======================
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const isMatch = await bcrypt.compare(token, user.refreshToken);

    if (!isMatch) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // rotate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    sendRefreshToken(res, refreshToken);

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// =======================
// 🔴 LOGOUT
// =======================
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      const user = await User.findById(decoded.userId);

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  }
};


// =======================
// 🔵 GOOGLE AUTH
// =======================
// export const googleAuth = async (req, res) => {
//   try {
//     const { credential } = req.body; // ID token from frontend

//     // 1️⃣ Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();

//     const { sub, email, name } = payload;

//     // 2️⃣ Check if user exists by googleSub
//     let user = await User.findOne({ googleSub: sub });

//     // ==========================
//     // CASE B: First time Google signup
//     // ==========================
//     if (!user) {

//       // ==========================
//       // CASE D: Email already exists (local account)
//       // ==========================
//       const existingEmailUser = await User.findOne({ email });

//       if (existingEmailUser) {
//         return res.status(400).json({
//           message:
//             "Account already exists with this email. Please login and link Google."
//         });
//       }

//       // Create new Google user
//       user = await User.create({
//         name,
//         email,
//         googleSub: sub,
//         authProvider: "google"
//       });
//     }

//     // ==========================
//     // Existing Google user login
//     // ==========================

//     const token = generateToken(user._id);
//     sendToken(res, token);

//     res.status(200).json({ user });

//   } catch (err) {
//     res.status(500).json({ message: "Google authentication failed" });
//   }
// };


// =======================
// 🔗 OPTIONAL: LINK GOOGLE
// =======================
// export const linkGoogle = async (req, res) => {
//   try {
//     const { credential } = req.body;
//     const userId = req.user._id;

//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID
//     });

//     const payload = ticket.getPayload();
//     const { sub } = payload;

//     // Check if this Google account already linked
//     const existing = await User.findOne({ googleSub: sub });

//     if (existing) {
//       return res.status(400).json({
//         message: "Google account already linked with another user"
//       });
//     }

//     const user = await User.findById(userId);

//     user.googleSub = sub;
//     user.authProvider = "google"; // or "both" if you want

//     await user.save();

//     res.status(200).json({ message: "Google linked successfully" });

//   } catch (err) {
//     res.status(500).json({ message: "Some error occured. Please try again later." });
//   }
// };