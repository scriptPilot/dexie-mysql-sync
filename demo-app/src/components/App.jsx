import TodoList from './TodoList.jsx'
import ImageList from './ImageList.jsx'
import FileList from './FileList.jsx'

import { db } from '../store'
import { resetSync } from 'dexie-mysql-sync'

export default function App() {
  return (
    <>
      <h1>Dexie MySQL Sync</h1>
      <p><button onClick={() => resetSync(db)}>Reset Sync</button></p>
      <TodoList />
      <ImageList />
      <FileList />
    </>
  )
}