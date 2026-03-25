// middlewares/family.middleware.js

// User MUST have a family
export const requireFamily = (req, res, next) => {
  try {
    if (!req.user.familyId) {
      return res.status(403).json({ success: false, message: "You must join or create a family first" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Family middleware error" });
  }
};

// User MUST NOT have a family
export const requireNoFamily = (req, res, next) => {
  try {
    if (req.user.familyId) {
      return res.status(400).json({ success: false, message: "You are already part of a family" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Family middleware error" });
  }
};