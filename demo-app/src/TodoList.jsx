import { useState } from 'react'
import { addTask, updateTask, deleteTask, listTasks } from './store'

export default function TodoList() {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  function onAddTask() {
    addTask(newTaskTitle)
    setNewTaskTitle('')
  }
  return (
    <>
      <h2>Todo List</h2>
      <p>
        <input placeholder="New Task Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAddTask()} />
        &nbsp;
        <button onClick={onAddTask}>Add Todo</button>
      </p>
      <ul style={{textAlign: 'left', listStyleType: 'none'}}>
        {listTasks().map(TaskItem)}
      </ul>
    </>
  )
}

function TaskItem(task) {
  return (
    <li key={task.id}>
      <span style={{cursor: 'pointer'}} onClick={() => updateTask(task.id, { done: !task.done })}>{task.done ? '✅' : '☑️'}</span>
      &nbsp;
      <input value={task.title} onChange={e => updateTask(task.id, { title: e.target.value})} disabled={task.done} />
      &nbsp;
      <span style={{cursor: 'pointer'}} onClick={() => deleteTask(task.id)}>❌</span>
      &nbsp;
      <small>(ID {task.id})</small>
    </li>
  )
}