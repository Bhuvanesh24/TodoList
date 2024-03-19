import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import todoImage from "../image/todo.png"

const TodoList = () => {
  // State variables
  const [tasks, setTasks] = useState([]); // Holds the list of tasks
  const [inputValue, setInputValue] = useState(''); // Manages the input field value
  const [filter, setFilter] = useState('all'); // Tracks the current filter type
  const [isLoading, setIsLoading] = useState(true); // Indicates if data is being loaded
  const [editTaskId, setEditTaskId] = useState(null); // Manages the ID of the task being edited

  // Fetch initial data
  useEffect(() => {
    fetchInitialData(); // Fetch initial tasks
  }, []);

  // Fetch initial tasks from an API
  const fetchInitialData = async () => {
    try {
      const customTodos = [
        { id: 1, title: 'Welcome to', completed: false },
        { id: 2, title: 'TO-DO List', completed: false },
       
        { id: 3, title: 'Create Tasks', completed: false },
      ];
      setTasks(customTodos); // Set fetched tasks
      setIsLoading(false); // Loading finished
    } catch (error) {
      console.log('Error fetching tasks:', error); // Log error if fetch fails
      setIsLoading(false); // Loading finished even if there's an error
    }
  };

  // Handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Update input value as user types
  };

  // Add a new task
  const handleAddTask = async () => {
    if (inputValue.trim() === '') {
      return; // Do nothing if input is empty
    }

    const newTask = {
      title: inputValue,
      completed: false
    };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(newTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const addedTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, addedTask]); // Add new task to the list
      setInputValue(''); // Clear input field
      toast.success('Task added successfully'); // Display success message
    } catch (error) {
      console.log('Error adding task:', error); // Log error if adding task fails
      toast.error('Error adding task'); // Display error message
    }
  };

  // Handle checkbox change for a task
  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId)); // Remove task from the list
    toast.success('Task deleted successfully'); // Display success message
  };

  // Edit a task
  const handleEditTask = (taskId) => {
    setEditTaskId(taskId); // Set the ID of the task being edited
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setInputValue(taskToEdit.title); // Set input value to the title of the task being edited
  };

  // Update a task
  const handleUpdateTask = async () => {
    if (inputValue.trim() === '') {
      return; // Do nothing if input is empty
    }

    const updatedTask = {
      title: inputValue,
      completed: false
    };

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editTaskId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedTask),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editTaskId ? { ...task, title: updatedTaskData.title } : task
        )
      );
      setInputValue(''); // Clear input field
      setEditTaskId(null); // Reset editTaskId
      toast.success('Task updated successfully'); // Display success message
    } catch (error) {
      console.log('Error updating task:', error); // Log error if updating task fails
      toast.error('Error updating task'); // Display error message
    }
  };

  // Mark all tasks as completed
  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true })) // Update all tasks to completed
    );
  };

  // Clear completed tasks
  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed)); // Remove completed tasks from the list
  };

  // Handle filter change
  const handleFilterChange = (filterType) => {
    setFilter(filterType); // Set the filter type
  };

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true; // Return all tasks
    } else if (filter === 'completed') {
      return task.completed; // Return completed tasks
    } else if (filter === 'uncompleted') {
      return !task.completed; // Return uncompleted tasks
    }
    return true;
  });

  // Display loading message while data is being fetched
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the todo list
  return (
    <div className="container">
      <ToastContainer />
      <div className="todo-app">
        <h2>
          <img src={todoImage} alt="todo-image" /> Todo List
        </h2>
        {/* Input field for adding tasks */}
        <div className="row">
          <i className="fas fa-list-check"></i>
          <input
            type="text"
            className="add-task"
            id="add"
            placeholder="Add your todo"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
          />
          {/* Button for adding or updating tasks */}
          <button id="btn" onClick={editTaskId ? handleUpdateTask : handleAddTask}>
            {editTaskId ? 'Update' : 'Add'}
          </button>
        </div>
  
        {/* Section for completing all tasks and clearing completed tasks */}
        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete completed tasks
          </p>
        </div>
  
        {/* List of tasks */}
        <ul id="list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <input
                type="checkbox"
                id={`task-${task.id}`}
                data-id={task.id}
                className="custom-checkbox"
                checked={task.completed}
                onChange={() => handleTaskCheckboxChange(task.id)}
              />
              <label htmlFor={`task-${task.id}`}>{task.title}</label>
              {/* Icons for editing and deleting tasks */}
              <div>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png"
                  className="edit"
                  data-id={task.id}
                  onClick={() => handleEditTask(task.id)}
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"
                  className="delete"
                  data-id={task.id}
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            </li>
          ))}
        </ul>
  
        {/* Filter options and task counters */}
        <div className="filters">
          <div className="dropdown">
            <button className="dropbtn">Filter</button>
            <div className="dropdown-content">
              <a href="#" id="all" onClick={() => handleFilterChange('all')}>
                All
              </a>
              <a href="#" id="rem" onClick={() => handleFilterChange('uncompleted')}>
                Uncompleted
              </a>
              <a href="#" id="com" onClick={() => handleFilterChange('completed')}>
                Completed
              </a>
            </div>
          </div>
  
          {/* Display the number of completed tasks */}
          <div className="completed-task">
            <p>
              Completed: <span id="c-count">{tasks.filter((task) => task.completed).length}</span>
            </p>
          </div>
          {/* Display the total number of tasks */}
          <div className="remaining-task">
            <p>
              <span id="total-tasks">
                Total Tasks: <span id="tasks-counter">{tasks.length}</span>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
