import Joi from 'joi';

const registerValidation = (req, res, next) => {
    const schema = Joi.object({
        PlayerName: Joi.string().min(3).max(100).required()
            .messages({
                'string.empty': 'Username cannot be empty',
                'string.min': 'Username should be at least 3 characters',
                'any.required': 'Username is required'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.empty': 'Email cannot be empty',
                'string.email': 'Email must be a valid email address',
                'any.required': 'Email is required'
            }),
        password: Joi.string().min(4).max(100).required()
            .messages({
                'string.min': 'Password should be at least 4 characters',
                'any.required': 'Password is required'
            }),
        PhoneNO: Joi.string().pattern(/^[0-9]{10}$/).required()
            .messages({
                'string.pattern.base': 'Phone number must be 10 digits'
            })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(err => ({
            field: err.path[0],
            message: err.message
        }));
        
        return res.status(400).json({
            message: "Validation failed",
            success: false,
            errors
        });
    }
    
    next();
};

export default registerValidation;
