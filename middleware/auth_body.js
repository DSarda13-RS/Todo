const {authUsers} = require("../Validations/validation_user");
const {authLogin} = require("../Validations/validation_user_login");
const {authTodo} = require("../Validations/validation_todo");
const {authUpdate} = require("../Validations/validation_todo_update");
const pool = require("../db");

const authenticateUser = async(req,res,next)=>{
    const {name,email,username,password} = req.body;
    if(authUsers.validate({name,email,username,password}).error == null){
        next()
    } else{
        res.json(authUsers.validate({name,email,username,password}).error.message);
    }
}

const authenticateUserLogin = async(req,res,next)=>{
    const {username,password} = req.body;
    if(authLogin.validate({username,password}).error == null){
        next()
    } else{
        res.json(authUsers.validate({username,password}).error.message);
    }
}

const authenticateTodo = async(req,res,next)=>{
    const {description} = req.body;
    if(authTodo.validate({description}).error == null){
        next()
    } else{
        res.json(authTodo.validate({description}).error.message);
    }
}

const authenticateTodoUpdate = async(req,res,next)=>{
    const {descriptionNew} = req.body;
    if(authUpdate.validate({descriptionNew}).error == null){
        next()
    } else{
        res.json(authUpdate.validate({descriptionNew}).error.message);
    }
}

module.exports = {
    authenticateUser,
    authenticateUserLogin,
    authenticateTodo,
    authenticateTodoUpdate
}

