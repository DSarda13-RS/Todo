const express = require('express');
const router = express.Router();
const {
    authenticateToken
} = require("../middleware/authenticate");

const {
    authenticateTodo,
    authenticateTodoUpdate
} = require('../middleware/auth_body')

const {
    createTodo,
    completeTodo,
    updateTodo,
    deleteTodo,
    getTask,
    getParticularTask
} = require("../controllers/todo");
router.use(authenticateToken)
router.post('/create',authenticateTodo,createTodo)
router.put('/:task_id/complete',completeTodo)
router.put('/:task_id/update',authenticateTodoUpdate,updateTodo)
router.delete('/:task_id/delete',deleteTodo)
router.get('/query',getTask)
router.get('/:task_id',getParticularTask)

module.exports = router

