import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TodoList from './TodoList.jsx'
import ImageList from './ImageList.jsx'
import FileList from './FileList.jsx'

import { resetSync } from 'dexie-mysql-sync'
import { db } from './store'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Dexie MySQL Sync</h1>
      <p><button onClick={() => resetSync(db)}>Reset Sync</button></p>
      <TodoList />
      <ImageList />
      <FileList />
    </>
  )
}

export default App
