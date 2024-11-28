import { useState, useEffect } from 'react';
import Card from './components/Card';
import './App.css';
import Navbar from './components/Navbar';

function App() {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]); // Correct initialization

  useEffect(() => {
    // Use an async function inside the useEffect hook
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:5000/');
        const data = await response.json();
        setTodos(data); 
      } catch (error) {
        console.error('Error fetching todos:', error);
      } 
    };
    fetchTodos();
  }, [todos]); 

  return (
    <>
      <header>
        <Navbar></Navbar>
      </header>
      <div className='py-[80px]'>
        <div className="flex flex-row flex-wrap">
          {todos.map((e) => {
            return <Card key={e.id} userId={e.userId} title={e.title} />;
          })}
        </div>
      </div>
      
    </>
  );
}

export default App;
