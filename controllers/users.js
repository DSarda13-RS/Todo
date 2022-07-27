const pool = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
                res.status(200).json(newUsers.rows);
            } else{
                res.status(409).send('username already used');
            }
        } else{
            res.status(409).send('email already used');
        }
    } catch(err){
        res.sendStatus(500);
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
            res.status(200).json({accessToken: accessToken})
        }else{
            res.status(401).send('Incorrect Password');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const logoutUser = async(req,res)=>{
    try{
        const session_id = req.session_id;
        await pool.query(
            'UPDATE sessiontable SET is_ended = true, end_time = NOW() WHERE session_id = $1',[session_id])
        res.status(200).json('User Logged Out');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const updateUser = async(req,res)=>{
    try{
        const user_id = req.uid;
        let {name,email,username,password} = req.body;
        const passwordHashed = await pool.query(
            'SELECT password FROM users WHERE id = $1 AND deleted_at is null',[user_id]);
        if(await bcrypt.compare(password, passwordHashed.rows[0].password)){
            const details = await pool.query(
                'SELECT name,email,username FROM users WHERE id = $1 AND deleted_at is null',[user_id]);
            if(!name){
                name = '';
            }
            if(!email){
                email = '';
            }
            if(!username){
                username = '';
            }
            await pool.query(
                'UPDATE users SET name = CASE WHEN length($1) = 0 Then $2 ELSE $1 END, email = CASE WHEN length($3) = 0 THEN $4 ELSE $3 END, username = CASE WHEN length($5) = 0 THEN $6 ELSE $5 END, updated_at = NOW() WHERE id = $7 AND deleted_at is null',
                [name,details.rows[0].name,email,details.rows[0].email,username,details.rows[0].username,user_id]);
            res.status(200).json('Users was updated');
        } else{
            res.status(401).send('Incorrect Password');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const updatePassword = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {oldPassword,newPassword} = req.body;
        const passwordHashed = await pool.query(
            'SELECT password FROM users WHERE id = $1 AND deleted_at is null',[user_id]);
        if(await bcrypt.compare(oldPassword, passwordHashed.rows[0].password)){
            if(oldPassword === newPassword){
                res.status(400).send('New password cannot be same to Old Password');
            } else{
                const salt = await bcrypt.genSalt()
                const hashedPassword = await bcrypt.hash(newPassword,salt)
                await pool.query('UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 AND deleted_at is null',
                    [hashedPassword,user_id]);
                res.status(200).json('Password was updated');
            }
        } else{
            res.status(401).send('Incorrect Password');
        }
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const deleteUser = async(req,res)=>{
    try{
        const user_id = req.uid;
        await pool.query(
            'UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at is null', [user_id]);
        await pool.query(
            'UPDATE todo SET deleted_at = NOW() WHERE user_id = $1 AND deleted_at is null', [user_id]);
        await pool.query(
            'UPDATE sessiontable SET is_ended = true WHERE user_id = $1 AND is_ended = false', [user_id]);
        res.status(200).json('User was successfully deleted');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const getUser = async(req,res)=>{
    try{
        const user_id = req.uid;
        const user = await pool.query('SELECT name,email,username FROM users WHERE id = $1 AND deleted_at is null', [user_id]);
        res.status(200).json(user.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    updatePassword,
    deleteUser,
    getUser
}

