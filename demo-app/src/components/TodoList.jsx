import { useState } from 'react'
import { db, useLiveQuery } from '../store'

function TaskItem(task) {
  return (
    <li key={task.id}>
      <span style={{cursor: 'pointer'}} onClick={() => db.tasks.update(task.id, { done: !task.done })}>{task.done ? '✅' : '☑️'}</span>
      &nbsp;
      <input value={task.title} onChange={e => db.tasks.update(task.id, { title: e.target.value})} disabled={task.done} />
      &nbsp;
      <span style={{cursor: 'pointer'}} onClick={() => db.tasks.delete(task.id)}>❌</span>
      &nbsp;
      <small>(ID {task.id})</small>
    </li>
  )
}

function TodoList() {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const tasks = useLiveQuery(() => db.tasks.where('$deleted').notEqual(1).toArray())
  function onAddTask() {
    db.tasks.add({ title: newTaskTitle })
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
        {tasks?.map(TaskItem)}
      </ul>
    </>
  )
}

export default TodoList