const Joi = require('@hapi/joi')

const authUsers = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().lowercase().required(),
    username: Joi.string().alphanum().min(6).max(15).required(),
    password: Joi.string().min(8).required()
})

module.exports = {authUsers};

// num: Joi.array.required().allow(null).object(Joi.object({
//     num1: Joi.string()
// }))
