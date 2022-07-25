const pool = require("../db");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const {authUsers} = require("../Validations/validation_user");
const {authLogin} = require("../Validations/validation_user_login");

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null){
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err){
            return res.sendStatus(403)
        }
        res.locals.user = user;
        res.locals.uid = user.id.rows[0].id;
        res.locals.sess_id = user.sessionId;
        next()
    })
}

const createUser = async(req,res)=>{
    try{
        const {name,email,username,password} = req.body;
        if(authUsers.validate({name,email,username,password}).error == null){
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password,salt)
            const newUsers = await pool.query(
                'INSERT INTO users (name,email,username,password) VALUES ($1,$2,$3,$4)',
                [name,email,username,hashedPassword]);
            res.json(newUsers.rows);
        } else{
            res.json(authUsers.validate({name,email,username,password}).error.message);
        }
    } catch(err){
        console.error(err.message);
    }
}

const loginUser = async(req,res)=>{
    const {username,password} = req.body;
    if(username === null){
        res.sendStatus(400);
    }
    try{
        const passwordHashed = await pool.query(
            'SELECT password FROM users WHERE username = $1 AND deleted_at is null',[username]);
        if(await bcrypt.compare(password, passwordHashed.rows[0].password)){
            // access token
            const user_id = await pool.query(
                'SELECT id FROM users WHERE username = $1 AND deleted_at is null',[username]);
            const newLogin = await pool.query(
                'INSERT INTO sessiontable (user_id) VALUES ($1) RETURNING session_id',[user_id.rows[0].id]);
            const user = { name: username, id: user_id, sessionId: newLogin.rows[0].session_id}
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '30m'})
            res.json({accessToken: accessToken})
            // res.send('Success!!!')
        }else{
            res.send('Not Allowed')
        }
    } catch(err){
        console.error(err.message);
    }
}

const logoutUser = async(req,res)=>{
    try{
        const id = res.locals.sess_id;
        const logoutUsers = await pool.query(
            'UPDATE sessiontable SET is_ended = true, end_time = NOW() WHERE session_id = $1',[id])
        res.json('User Logged Out');
    } catch(err){
        console.error(err.message);
    }
}

const updateUser = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const {name,email,username,password} = req.body;
        if(authUsers.validate({name,email,username,password}).error == null){
            const Is_ended = await pool.query(
                'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
            if(Is_ended.rows[0].is_ended === true){
                res.send('Session Expired!!!');
            } else{
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(password,salt)
                const updateUsers = await pool.query(
                    'UPDATE users SET name = $1, email = $2, username = $3, password = $4, updated_at = NOW() WHERE id = $5 AND deleted_at is null',
                    [name,email,username,hashedPassword,id])
                res.json('Users was updated');
            }
        } else{
            res.json(authUsers.validate({name,email,username,password}).error.message);
        }
    } catch(err){
        console.error(err.message);
    }
}

// case when condition in name,em,un,pswd

const deleteUser = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const Is_ended = await pool.query(
            'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
        if(Is_ended.rows[0].is_ended === true){
            res.send('Session Expired!!!');
        } else{
            const deleteUsers = await pool.query(
                'UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at is null', [id]);
            const deleteTask = await pool.query(
                'UPDATE todo SET deleted_at = NOW() WHERE user_id = $1 AND deleted_at is null', [id]);
            const deleteSession = await pool.query(
                'UPDATE sessiontable SET is_ended = true WHERE user_id = $1 AND is_ended = false', [id]);
            res.json('User was successfully deleted');
        }
    } catch(err){
        console.error(err.message);
    }
}

//todo change query, session & tasks delete update.

const getUsers = async(req,res)=>{
    try{
        const Is_ended = await pool.query(
            'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
        if(Is_ended.rows[0].is_ended === true){
            res.send('Session Expired!!!');
        } else{
            const allUsers = await pool.query(
                'SELECT * FROM users WHERE deleted_at is null');
            res.json(allUsers.rows);
        }
    } catch(err){
        console.error(err.message);
    }
}

const getUser = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const Is_ended = await pool.query(
            'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
        if(Is_ended.rows[0].is_ended === true){
            res.send('Session Expired!!!');
        } else{
            const singleUser = await pool.query('SELECT * FROM users WHERE id = $1 AND deleted_at is null', [id])
            res.json(singleUser.rows);
        }
    } catch(err){
        console.error(err.message);
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    authenticateToken
}

