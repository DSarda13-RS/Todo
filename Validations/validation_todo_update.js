const Joi = require('@hapi/joi')

const authUpdate = Joi.object({
    descriptionNew: Joi.string().min(1).required()
})

module.exports = {authUpdate};

