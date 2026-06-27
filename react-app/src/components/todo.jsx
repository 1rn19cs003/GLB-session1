import {useState} from 'react'
export default function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React basics', done: false },
    { id: 2, text: 'Practice with hooks', done: true },
  ]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      const newTodo = {
        id: Date.now(),
        text: input,
        done: false,
      };
      setTodos([...todos, newTodo]);
      setInput('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  
  const completedCount = todos.filter((t) => t.done).length;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>My Todos</h1>
      
      {/* Input and Add button */}
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={addTodo} style={{ marginLeft: '10px' }}>
          Add
        </button>
      </div>
      
      {/* Stats */}
      <p>
        Total: {todos.length} | Completed: {completedCount} | Remaining:{' '}
        {todos.length - completedCount}
      </p>
      
      {/* Todo List */}
      {todos.length === 0 ? (
        <p>No todos yet. Add one!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                padding: '10px',
                backgroundColor: '#f5f5f5',
                marginBottom: '5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span
                  style={{
                    marginLeft: '10px',
                    textDecoration: todo.done ? 'line-through' : 'none',
                  }}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ backgroundColor: 'red', color: 'white' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
