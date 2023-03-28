const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo.js');

const app = express();

app.use(express.json()); // to use content type of json
app.use(cors()); //to remove cross-origin errors

mongoose.connect("mongodb://127.0.0.1:27017/mern-todo",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=> console.log("CONNECTED TO DB"))
    .catch(()=> console.error);

app.get('/todos', async (req,res)=> {
    const todos = await Todo.find();
    if(todos){
        res.json(todos);
    }
    
});

app.post('/todos/new', async(req,res)=>{
    const todo = new Todo({
        text:req.body.text
    });
    await todo.save();
    res.json(todo);
});

app.delete('/todos/delete/:id', async(req,res)=>{
    const result = await Todo.findByIdAndDelete(req.params.id);
    if(result){
        res.json(result);
    }
    
});

app.put('/todos/complete/:id', async(req,res)=>{
    const todo = await Todo.findById(req.params.id);
    if(todo){
        todo.complete = !todo.complete;
        await todo.save();
        res.json(todo);
    }
    
})

app.listen(3000, () => {
    console.log("Server started on PORT 3000");
});