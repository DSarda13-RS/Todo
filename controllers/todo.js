const pool = require("../db");
const {authTodo} = require("../Validations/validation_todo");
const {authUpdate} = require("../Validations/validation_todo_update");

const createTodo = async(req,res)=>{
    try{
        const user_id = res.locals.uid;
        const id = res.locals.sess_id;
        const {description} = req.body;
        if(authTodo.validate({description}).error == null){
            const Is_ended = await pool.query(
                'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
            if(Is_ended.rows[0].is_ended === true){
                res.send('Session Expired!!!');
            } else{
                const newTask = await pool.query(
                    'INSERT INTO todo (user_id,description) VALUES ($1,$2)',
                    [user_id,description]);
                res.json(newTask.rows);
            }
        } else{
            res.json(authTodo.validate({description}).error.message);
        }
    } catch(err){
        console.error(err.message);
    }
}

const completeTodo = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const {description} = req.body;
        if(authTodo.validate({description}).error == null){
            const Is_ended = await pool.query(
                'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
            if(Is_ended.rows[0].is_ended === true){
                res.send('Session Expired!!!');
            } else{
                const completedTask = await pool.query(
                    'UPDATE todo SET mark_completed = true WHERE user_id = $1 AND description = $2 AND deleted_at is null',[id,description]);
                res.json('Task was Completed');
            }
        } else{
            res.json(authTodo.validate({description}).error.message);
        }
    } catch(err){
        console.error(err.message);
    }
}

const updateTodo = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const {descriptionOld,descriptionNew} = req.body;
        if(authUpdate.validate({descriptionOld,descriptionNew}).error == null){
            const Is_ended = await pool.query(
                'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
            if(Is_ended.rows[0].is_ended === true){
                res.send('Session Expired!!!');
            } else{
                const updateTask = await pool.query(
                    'UPDATE todo SET description = $1, updated_at = NOW() WHERE user_id = $2 AND description = $3 AND deleted_at is null',
                    [descriptionNew,id,descriptionOld])
                res.json('Task was updated');
            }
        } else{
            res.json(authUpdate.validate({descriptionOld,descriptionNew}).error.message);
        }
    } catch(err){
        console.error(err.message);
    }
}

const deleteTodo = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const {description} = req.body;
        if(authTodo.validate({description}).error == null){
            const Is_ended = await pool.query(
                'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
            if(Is_ended.rows[0].is_ended === true){
                res.send('Session Expired!!!');
            } else{
                const deleteTask = await pool.query(
                    'UPDATE todo SET deleted_at = NOW() WHERE user_id = $1 AND description = $2 AND deleted_at is null', [id,description]);
                res.json('Todo was successfully deleted');
            }
        } else{
            res.json(authTodo.validate({description}).error.message);
        }
    } catch(err){
        console.error(err.message);
    }
}

const getTasks = async(req,res)=>{
    try{
        const Is_ended = await pool.query(
            'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
        if(Is_ended.rows[0].is_ended === true){
            res.send('Session Expired!!!');
        } else{
            const allTasks = await pool.query(
                'SELECT * FROM todo WHERE deleted_at is null');
            res.json(allTasks.rows);
        }
    } catch(err){
        console.error(err.message);
    }
}
//tasks of all users

const getTask = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const Is_ended = await pool.query(
            'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
        if(Is_ended.rows[0].is_ended === true){
            res.send('Session Expired!!!');
        } else{
            const singleUserTask = await pool.query('SELECT * FROM todo WHERE user_id = $1 AND deleted_at is null', [id])
            res.json(singleUserTask.rows);
        }
    } catch(err){
        console.error(err.message);
    }
}
//all tasks of particular user

const getParticularTask = async(req,res)=>{
    try{
        const id = res.locals.uid;
        const {description} = req.body;
        if(authTodo.validate({description}).error == null){
            const Is_ended = await pool.query(
                'SELECT is_ended FROM sessiontable WHERE session_id = $1',[id]);
            if(Is_ended.rows[0].is_ended === true){
                res.send('Session Expired!!!');
            } else{
                const singleTask = await pool.query('SELECT * FROM todo WHERE user_id = $1 AND description = $2 AND deleted_at is null', [id,description])
                res.json(singleTask.rows);
            }
        } else{
            res.json(authTodo.validate({description}).error.message);
        }
    } catch(err){
        console.error(err.message);
    }
}

module.exports = {
    createTodo,
    completeTodo,
    updateTodo,
    deleteTodo,
    getTasks,
    getTask,
    getParticularTask
}
