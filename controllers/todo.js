const pool = require("../db");

const createTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {description} = req.body;
        const newTask = await pool.query(
            'INSERT INTO todo (user_id,description) VALUES ($1,$2)',
            [user_id,description]);
        res.json(newTask.rows);
    } catch(err){
        console.error(err.message);
    }
}

const completeTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        const completedTask = await pool.query(
            'UPDATE todo SET mark_completed = true WHERE user_id = $1 AND id = $2 AND deleted_at is null',[user_id,task_id]);
        res.json('Task was Completed');
    } catch(err){
        console.error(err.message);
    }
}

const updateTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        const {descriptionNew} = req.body;
        const updateTask = await pool.query(
            'UPDATE todo SET description = $1, updated_at = NOW() WHERE user_id = $2 AND id = $3 AND deleted_at is null',
            [descriptionNew,user_id,task_id])
        res.json('Task was updated');
    } catch(err){
        console.error(err.message);
    }
}

const deleteTodo = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        const deleteTask = await pool.query(
            'UPDATE todo SET deleted_at = NOW() WHERE user_id = $1 AND id = $2 AND deleted_at is null', [user_id,task_id]);
        res.json('Todo was successfully deleted');
    } catch(err){
        console.error(err.message);
    }
}

const getTask = async(req,res)=>{
    try{
        const user_id = req.uid;
        const is_completed = req.query;
        const page = req.query.page;
        const limit = req.query.limit;
        const startIndex = (page - 1)*limit;
        const endIndex = page*limit;
        const complete = is_completed.is_completed;
        if(complete){
            const UserTaskComplete = await pool.query('SELECT * FROM todo WHERE user_id = $1 AND mark_completed = $2 AND deleted_at is null',
                [user_id,complete]);
            res.json(UserTaskComplete.rows.slice(startIndex,endIndex));
        }
        const UserTask = await pool.query('SELECT * FROM todo WHERE user_id = $1 AND deleted_at is null',
            [user_id]);
        res.json(UserTask.rows.slice(startIndex,endIndex));
    } catch(err){
        console.error(err.message);
    }
}
//getTask: all tasks of particular user

const getParticularTask = async(req,res)=>{
    try{
        const user_id = req.uid;
        const {task_id} = req.params;
        const singleTask = await pool.query('SELECT * FROM todo WHERE user_id = $1 AND id = $2 AND deleted_at is null', [user_id,task_id])
        res.json(singleTask.rows);
    } catch(err){
        console.error(err.message);
    }
}
//getParticularTask: Particular task of a user

module.exports = {
    createTodo,
    completeTodo,
    updateTodo,
    deleteTodo,
    getTask,
    getParticularTask
}

