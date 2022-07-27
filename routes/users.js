const express = require("express");
const router = express.Router();
const {
    authenticateToken
} = require("../middleware/authenticate");

const {
    authenticateUser,
    authenticateUserLogin,
    authenticateUserUpdate,
    authenticatePasswordUpdate
} = require('../middleware/auth_body');

const {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    updatePassword,
    deleteUser,
    getUser,
} = require('../controllers/users');

router.post('/create',authenticateUser,createUser)
router.post('/login',authenticateUserLogin,loginUser)

router.use(authenticateToken)

router.put('/logout',logoutUser)
router.put('/update/user',authenticateUserUpdate,updateUser)
router.put('/update/password',authenticatePasswordUpdate,updatePassword)
router.delete('/delete',deleteUser)
router.get('/details',getUser)

module.exports = router

