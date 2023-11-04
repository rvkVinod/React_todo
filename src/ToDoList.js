import React, { useState, useEffect } from 'react';
import './App.css';

const HandleTodo = () => {
  // State for storing todo items
  const [data, setData] = useState([]);
  // State for storing the current task input
  const [task, setTask] = useState('');
  // State for tracking the index of the task being edited
  const [editIndex, setEditIndex] = useState(null);
  // State for filtering completed tasks
  const [showCompleted, setShowCompleted] = useState(false);

  // Fetch todos from the API endpoint when the component mounts
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1/todos')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  // Handle form submission (add new task or update existing task)
  const handleSubmit = (e) => {
    e.preventDefault();
    // If editing a task, update the task; otherwise, add a new task
    const updatedData = editIndex !== null
      ? data.map((item, index) => (index === editIndex ? { ...item, title: task } : item))
      : [...data, { id: data.length + 1, title: task, completed: false }];

    setData(updatedData);
    setTask(''); // Clear the task input
    setEditIndex(null); // Reset edit index
  };

  // Handle editing a task
  const handleEdit = (index) => {
    setTask(data[index].title); // Set the task input to the selected task
    setEditIndex(index); // Set the edit index to the selected task index
  };

  // Handle deleting a task
  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index)); // Remove the task at the specified index
    setEditIndex(null); // Reset edit index
  };

  // Handle toggling task completion status
  const handleToggleCompleted = (index) => {
    setData(data.map((item, i) => (i === index ? { ...item, completed: !item.completed } : item)));
  };

  // Calculate the no. of completed tasks
  const completedTasks = data.filter(task => task.completed).length;
  // Calculate the no. of remaining tasks
  const remainingTasks = data.length - completedTasks;

  return (
    <div className='card'>
      <h1>Todo List</h1>
      {/* Form for adding / updating tasks */}
      <form onSubmit={handleSubmit} className='mb-3'>
        <div className='input-group'>
          {/* Task input */}
          <input type='text' onChange={e => setTask(e.target.value)} value={task} className='form-control' />
          <div className='input-group-append'>
            {/* Submit button */}
            <button type='submit' className='btn btn-success'>{editIndex !== null ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </form>
      {/* List of tasks */}
      <ul className='list-group'>
        {data.map((item, index) => (
          // Show tasks based on completed status and filter preference
          (!showCompleted || item.completed) && (
            <li key={item.id} className={`list-group-item d-flex justify-content-between align-items-center ${item.completed ? 'completed-task' : ''}`}>
              <div>
                {/* Checkbox for toggling task completion */}
                <input
                  type='checkbox'
                  checked={item.completed}
                  onChange={() => handleToggleCompleted(index)}
                />
                {/* Task title */}
                {item.title}
              </div>
              <div>
                {/* Edit button */}
                <button className='btn btn-info btn-sm mr-2' onClick={() => handleEdit(index)}>Edit</button>
                {/* Delete button */}
                <button className='btn btn-danger btn-sm' onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </li>
          )
        ))}
      </ul>
      {/* Filter buttons */}
      <div className='filter-buttons mt-3 d-flex justify-content-end'>
        {/* Button to show completed tasks */}
        <button className='btn btn-primary ml-2' onClick={() => setShowCompleted(true)}>Tasks done</button>
        {/* Button to show all tasks */}
        <button className='btn btn-success' onClick={() => setShowCompleted(false)}>Show all</button>
      </div>
      {/* Task counters */}
      <div className='task-counters mt-3 text-right'>
        {/* Display the number of completed tasks */}
        <p>Tasks Completed: {completedTasks}</p>
        {/* Display the number of remaining tasks */}
        <p>Tasks Remaining: {remainingTasks}</p>
      </div>
    </div>
  );
};

export default HandleTodo;
