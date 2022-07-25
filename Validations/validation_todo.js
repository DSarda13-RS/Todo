const Joi = require('@hapi/joi')

const authTodo = Joi.object({
    description: Joi.string().min(1).required()
})

module.exports = {authTodo};

