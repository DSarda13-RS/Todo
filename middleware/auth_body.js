const {authUsers} = require("../Validations/validation_user");
const {authLogin} = require("../Validations/validation_user_login");
const {authTodo} = require("../Validations/validation_todo");
const {authPasswordUpdate} = require("../Validations/validation_password_update");
const {authUserUpdate} = require("../Validations/validation_user_update");

const authenticateUser = async(req,res,next)=>{
    const {name,email,username,password} = req.body;
    if(authUsers.validate({name,email,username,password}).error == null){
        next()
    } else{
        res.status(403).json(authUsers.validate({name,email,username,password}).error.message);
    }
}

const authenticateUserLogin = async(req,res,next)=>{
    const {username,password} = req.body;
    if(authLogin.validate({username,password}).error == null){
        next()
    } else{
        res.status(403).json(authUsers.validate({username,password}).error.message);
    }
}

const authenticateUserUpdate = async(req,res,next)=>{
    const {name,email,username,password} = req.body;
    if(authUserUpdate.validate({name,email,username,password}).error == null){
        next()
    } else{
        res.status(403).json(authUserUpdate.validate({name,email,username,password}).error.message);
    }
}

const authenticateTodo = async(req,res,next)=>{
    const {description} = req.body;
    if(authTodo.validate({description}).error == null){
        next()
    } else{
        res.status(403).json(authTodo.validate({description}).error.message);
    }
}

const authenticatePasswordUpdate = async(req,res,next)=>{
    const {oldPassword,newPassword} = req.body;
    if(authPasswordUpdate.validate({oldPassword,newPassword}).error == null){
        next()
    } else{
        res.status(403).json(authPasswordUpdate.validate({oldPassword,newPassword}).error.message);
    }
}

module.exports = {
    authenticateUser,
    authenticateUserLogin,
    authenticateUserUpdate,
    authenticateTodo,
    authenticatePasswordUpdate
}

