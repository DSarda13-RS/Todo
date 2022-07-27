const pool = require("../db");

const createTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {description} = req.body;
        const newTask = await pool.query(
            'INSERT INTO todo (user_id,description) VALUES ($1,$2)',
            [user_id,description]);
        res.status(200).json(newTask.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const completeTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        await pool.query(
            'UPDATE todo SET mark_completed = true WHERE user_id = $1 AND id = $2 AND deleted_at is null',[user_id,task_id]);
        res.status(200).json('Task was Completed');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const updateTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        const {description} = req.body;
        await pool.query(
            'UPDATE todo SET description = $1, updated_at = NOW() WHERE user_id = $2 AND id = $3 AND deleted_at is null',
            [description,user_id,task_id])
        res.status(200).json('Task was updated');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const deleteTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        await pool.query(
            'UPDATE todo SET deleted_at = NOW() WHERE user_id = $1 AND id = $2 AND deleted_at is null', [user_id,task_id]);
        res.status(200).json('Todo was successfully deleted');
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const getTasks = async(req,res)=>{
    try{
        const user_id = req.uid;
        const complete = req.query.is_completed;
        const page = req.query.page;
        const limit = req.query.limit;
        const offset = (page - 1)*limit;
        if(complete){
            const userTasksComplete = await pool.query(
                'SELECT description FROM todo WHERE user_id = $1 AND mark_completed = $2 AND deleted_at is null LIMIT $3 OFFSET $4',
                [user_id,complete,limit,offset]);
            res.status(200).json(userTasksComplete.rows);
        }
        const userTasks = await pool.query(
            'SELECT description FROM todo WHERE user_id = $1 AND deleted_at is null LIMIT $2 OFFSET $3',
            [user_id,limit,offset]);
        res.status(200).json(userTasks.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

const getParticularTask = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        const singleTask = await pool.query('SELECT description FROM todo WHERE user_id = $1 AND id = $2 AND deleted_at is null', [user_id,task_id])
        res.status(200).json(singleTask.rows);
    } catch(err){
        res.sendStatus(500);
        console.error(err.message);
    }
}

module.exports = {
    createTodo,
    completeTodo,
    updateTodo,
    deleteTodo,
    getTasks,
    getParticularTask
}

