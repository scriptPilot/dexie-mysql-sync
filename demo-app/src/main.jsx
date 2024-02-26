import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { addTask, updateTask, removeTask, listTasks }  from './store'

(async () => {

  listTasks(console.log)
  const id = await addTask('First Task')
  await updateTask(id, { done: true })
  await removeTask(id)

})()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
