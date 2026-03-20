import Joi from "joi";

export const signupValidation = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name should have a minimum length of 3",
        "string.max": "Name should have a maximum length of 50"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long"
    })
}).options({
    abortEarly : false,
    stripUnknown : true,
    convert : true
});

export const loginValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Please provide a valid email"
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required"
    })
}).options({
    abortEarly : false,
    stripUnknown : true,
    convert : true
});
