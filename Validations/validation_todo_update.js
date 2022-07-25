const Joi = require('@hapi/joi')

const authUpdate = Joi.object({
    descriptionOld: Joi.string().min(1).required(),
    descriptionNew: Joi.string().min(1).required()
})

module.exports = {authUpdate};

