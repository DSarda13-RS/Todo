const express = require('express');
const router = express.Router();
const {
    authenticateToken
} = require("../middleware/authenticate");

const {
    authenticateUser,
    authenticateUserLogin
} = require('../middleware/auth_body')

const {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getUser,
} = require('../controllers/users')

router.post('/create',authenticateUser,createUser)
router.post('/login',authenticateUserLogin,loginUser)
router.use(authenticateToken)
router.put('/logout',logoutUser)
router.put('/:user_id/update',authenticateUser,updateUser)
router.delete('/delete',deleteUser)
router.get('/details',getUser)

module.exports = router

