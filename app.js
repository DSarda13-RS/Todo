const express = require("express");
const app = express();

const users = require('./routes/users');
const todo = require('./routes/todo');
const todo2 = require('./routes/todo2');

app.use(express.json())
app.use('/user',users)
app.use('/todo',todo)
app.use('/todo/:task_id',todo2)

app.listen(5000,()=>{
    console.log('server is listening on port 5000...')
})

