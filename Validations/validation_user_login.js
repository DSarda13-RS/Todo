const Joi = require('@hapi/joi')

const authLogin = Joi.object({
    username: Joi.string().alphanum().min(6).max(15).required(),
    password: Joi.string().min(8).required()
})

module.exports = {authLogin};

