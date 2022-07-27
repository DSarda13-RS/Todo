const express = require("express");
const router = express.Router();

const {authenticateToken} = require('../middleware/authenticate');

const {
    authenticateTodo
} = require('../middleware/auth_body');

const {
    createTodo,
    getTasks
} = require("../controllers/todo");

router.use(authenticateToken)

router.post('/create',authenticateTodo,createTodo)
router.get('/',getTasks)

module.exports = router

