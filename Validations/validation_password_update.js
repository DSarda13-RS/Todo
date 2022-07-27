const Joi = require('@hapi/joi')

const authPasswordUpdate = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
})

module.exports = {authPasswordUpdate};

