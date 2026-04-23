import Joi from "joi";

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
    password: Joi.string().trim().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long"
    })
}).options({
    abortEarly : false,
    stripUnknown : true,
    convert : true
});

export const loginValidation = Joi.object({
    email: Joi.string().trim().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
    }),
    password: Joi.string().trim().required().messages({
        "string.empty": "Password is required"
    })
}).options({
    abortEarly : false,
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
    abortEarly: false,
    stripUnknown: true,
    convert: true
});


// =======================
// 🔐 RESET PASSWORD
// =======================
export const resetPasswordValidation = Joi.object({
    password: Joi.string().trim().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long"
    }),

    token: Joi.string().length(64).hex().required().messages({
        "string.length": "Invalid reset token",
        "string.hex": "Invalid reset token format",
        "string.empty": "Token is required"
    })
    
}).options({
    abortEarly: false,
    stripUnknown: true,
    convert: true
});

