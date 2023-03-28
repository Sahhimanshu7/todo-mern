import { useState,useEffect } from "react";
import axios, * as others from 'axios';

const API_BASE = "http://localhost:3000";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setpopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(()=>{
    GetTodos();
  },[]);

  const GetTodos = () =>{
    axios.get(API_BASE + '/todos')
      .then(res => setTodos(res.data))
      .catch(err => console.log("hurray found",err));
  }

  const completeTodo = async id => {
    if(!id) return;
    const data = await axios.put(API_BASE + "/todos/complete/" + id);
    setTodos(todos => 
      todos.map(todo => {
        if(todo._id===data.data._id ){
          todo.complete = data.data.complete;
        }
        return todo;
      })
    )
  }

const deleteTodo = async (id) => {
  const resPonse = await axios({
    method:'DELETE',
    url: API_BASE + "/todos/delete/" + id,
  });
  const data = resPonse.data;
  setTodos(todos => todos.filter(todo => todo._id !== data._id));
}  

const addTodo = async() => {
  const data = await axios.post(API_BASE + "/todos/new/",{
    headers : {
      "content-type":"text"
    },
    responseType:'text',
    text: newTodo
    
  });
  const res = data.data;
  setTodos([...todos,res]);
  setNewTodo('');
  setpopupActive(false);
}

  return (
    <div className="App">
      <h1>Todo App</h1>
      <h4>Your Tasks</h4>
      <div className="todos">
        {todos.map( todo => (
          <div className={ "todo " + (todo.complete ? "is-complete" : "")} 
          key = {todo._id} >
            <div className="checkbox" onClick={()=> completeTodo(todo._id)}></div>

            <div className="text" onClick={()=> completeTodo(todo._id)}>{ todo.text }</div>

            <div className="delete-todo" onClick={()=> deleteTodo(todo._id)}>x</div>
         </div>

         

        ))}
        
      </div>
      <div className="addPopup" onClick={() => setpopupActive(true)}>+</div>

      { popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={()=> setpopupActive(false)}>
            x</div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={e => setNewTodo(e.target.value)}
              value={newTodo} />
              <div className="button" onClick={addTodo}>Add</div>
          </div>
        </div>
      ) : ''}
    </div>
  );
}

export default App;
