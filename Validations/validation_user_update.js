const Joi = require('@hapi/joi')

const authUserUpdate = Joi.object({
    name: Joi.string().trim().min(1),
    email: Joi.string().email().lowercase(),
    username: Joi.string().alphanum().min(6).max(15),
    password: Joi.string().min(8).required()
})

module.exports = {authUserUpdate};

