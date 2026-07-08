import Joi from "joi";

const strongPassword = Joi.string()
    .trim()
    .min(8)
    .max(14)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/)
    .required()
    .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot exceed 14 characters",
        "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    });
    
export const signupValidation = Joi.object({
    name: Joi.string().trim().min(3).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name should have a minimum length of 3",
        "string.max": "Name should have a maximum length of 50"
    }),
    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
    }),
    password: strongPassword
}).options({
    abortEarly : true,
    stripUnknown : true,
    convert : true
});

export const loginValidation = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
    }),
    password: strongPassword
}).options({
    abortEarly : true,
    stripUnknown : true,
    convert : true
});


// =======================
// 🔐 FORGOT PASSWORD
// =======================
export const forgotPasswordValidation = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
    })
}).options({
    abortEarly: true,
    stripUnknown: true,
    convert: true
});


// =======================
// 🔐 RESET PASSWORD
// =======================
export const resetPasswordValidation = Joi.object({
    password: strongPassword,

    token: Joi.string().length(64).hex().required().messages({
        "string.length": "Invalid reset token",
        "string.hex": "Invalid reset token format",
        "string.empty": "Token is required"
    })
    
}).options({
    abortEarly: true,
    stripUnknown: true,
    convert: true
});

