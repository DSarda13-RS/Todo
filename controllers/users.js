const pool = require("../db");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createUser = async(req,res)=>{
    try{
        const {name,email,username,password} = req.body;
        const email_exist = await pool.query(
            'SELECT email FROM users WHERE email = $1 AND deleted_at is null',[email]);
        if(email_exist.rowCount === 0){
            const username_exist = await pool.query(
                'SELECT username FROM users WHERE username = $1 AND deleted_at is null',[username]);
            if(username_exist.rowCount === 0){
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(password,salt)
                const newUsers = await pool.query(
                    'INSERT INTO users (name,email,username,password) VALUES ($1,$2,$3,$4)',
                    [name,email,username,hashedPassword]);
                res.json(newUsers.rows);
            } else{
                res.status(409);
                res.send('username already used');
            }
        } else{
            res.status(409);
            res.send('email already used');
        }
    } catch(err){
        console.error(err.message);
    }
}

const loginUser = async(req,res)=>{
    const {username,password} = req.body;
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
            res.status(401);
            res.send('Not Allowed');
        }
    } catch(err){
        console.error(err.message);
    }
}

const logoutUser = async(req,res)=>{
    try{
        const id = req.sess_id;
        const logoutUsers = await pool.query(
            'UPDATE sessiontable SET is_ended = true, end_time = NOW() WHERE session_id = $1',[id])
        res.json('User Logged Out');
    } catch(err){
        console.error(err.message);
    }
}

const updateUser = async(req,res)=>{
    try{
        const id = req.uid;
        const {name,email,username,password} = req.body;
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password,salt)
        const updateUsers = await pool.query(
            'UPDATE users SET name = $1, email = $2, username = $3, password = $4, updated_at = NOW() WHERE id = $5 AND deleted_at is null',
            [name,email,username,hashedPassword,id])
        res.json('Users was updated');
    } catch(err){
        console.error(err.message);
    }
}

const deleteUser = async(req,res)=>{
    try{
        const id = req.uid;
        const deleteUsers = await pool.query(
            'UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at is null', [id]);
        const deleteTask = await pool.query(
            'UPDATE todo SET deleted_at = NOW() WHERE user_id = $1 AND deleted_at is null', [id]);
        const deleteSession = await pool.query(
            'UPDATE sessiontable SET is_ended = true WHERE user_id = $1 AND is_ended = false', [id]);
        res.json('User was successfully deleted');
    } catch(err){
        console.error(err.message);
    }
}

const getUser = async(req,res)=>{
    try{
        const id = req.uid;
        const singleUser = await pool.query('SELECT * FROM users WHERE id = $1 AND deleted_at is null', [id])
        res.json(singleUser.rows);
    } catch(err){
        console.error(err.message);
    }
}
//getUser: User details

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getUser
}

