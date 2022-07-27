const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate');

const {
    authenticateTodo
} = require('../middleware/auth_body');

const {
    completeTodo,
    updateTodo,
    deleteTodo,
    getParticularTask
} = require("../controllers/todo");

router.use(authenticateToken)

router.put('/complete',completeTodo)
router.put('/update',authenticateTodo,updateTodo)
router.delete('/delete',deleteTodo)
router.get('/',getParticularTask)

module.exports = router

