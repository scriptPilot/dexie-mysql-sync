// Import Dexie
import Dexie from 'dexie'

// Import Dexie React Hook
import { useLiveQuery } from 'dexie-react-hooks'

// Import Dexie MySQL Sync
import { sync } from 'dexie-mysql-sync'

// Setup the local database
const db = new Dexie('databaseName')
db.version(1).stores({
  tasks: '++id, title',
  images: '++id, name'
})

// Start the synchronization
sync(db.tasks, 'tasks')
sync(db.images, 'images')

// Export database wrapper functions from the store
export async function addTask(titleOrDoc) {
  const doc = typeof titleOrDoc === 'string'
    ? { done: false, title: titleOrDoc }
    : { done: false, ...titleOrDoc }
  return await db.tasks.add(doc)
}
export async function updateTask(id, updates) {
  return await db.tasks.update(id, updates)
}
export async function deleteTask(id) {
  return await db.tasks.delete(id)
}
export function listTasks() {
  return (useLiveQuery(() => db.tasks.toArray()) || []).filter(doc => !doc.$deleted)
}

export { db }