const express = require('express');
const router = express.Router();
const {
    authenticateToken
} = require("../controllers/users");

const {
    createTodo,
    completeTodo,
    updateTodo,
    deleteTodo,
    getTasks,
    getTask,
    getParticularTask
} = require("../controllers/todo");

router.post('/:id',authenticateToken,createTodo)
router.put('/:id',authenticateToken,updateTodo)
router.delete('/:id',authenticateToken,deleteTodo)
router.get('/',authenticateToken,getTasks)
router.get('/:id',authenticateToken,getTask)
router.get('/particular/:id',authenticateToken,getParticularTask)
router.put('/complete/:id',authenticateToken,completeTodo)

module.exports = router

