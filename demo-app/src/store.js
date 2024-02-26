// Import Dexie.js
import Dexie from 'dexie'

// Import the sync and wrapper functions
import { sync, add, update, remove } from 'dexie-mysql-sync'

// Setup the local database
const db = new Dexie('databaseName')
db.version(1).stores({ tasks: 'id, title' })

// Start the synchronization
sync(db.tasks, 'tasks')

// Export the store functions for the frontend
export function addTask(task) {
  task = typeof task === 'string'
    ? { title: task, done: false }
    : { done: false, ...task }
  return add(db.tasks, task)
}
export function updateTask(id, updates) {
  return update(db.tasks, id, updates)
}
export function removeTask(id) {
  return remove(db.tasks, id)
}
export function listTasks(onChangeCallback) {
  const observable = Dexie.liveQuery(() => db.tasks.toArray())
  observable.subscribe({ next: onChangeCallback })
}