const express = require('express');
const router = express.Router();

const {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    authenticateToken
} = require('../controllers/users')

router.post('/',createUser)
router.post('/login',loginUser)
router.put('/logout/:id',authenticateToken,logoutUser)
router.put('/:id',authenticateToken,updateUser)
router.delete('/:id',authenticateToken,deleteUser)
router.get('/',authenticateToken,getUsers)
router.get('/:id',authenticateToken,getUser)

module.exports = router

