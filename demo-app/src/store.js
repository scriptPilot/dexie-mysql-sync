// Import Dexie.js
import Dexie from 'dexie'

// Import Dexie React Hook
import { useLiveQuery } from 'dexie-react-hooks'

// Import the sync function
import { sync } from 'dexie-mysql-sync'

// Setup the local database
// Adding $created as index allows to query on this field
const db = new Dexie('databaseName')
db.version(1).stores({
  tasks: '++id, title, done, $created',
  files: '++id, name, type, size, $created'
})

// Start the synchronization
sync(db.tasks, 'tasks')
sync(db.files, 'files')

console.log(await db.tasks.toArray())

// Export the database object
export { db, useLiveQuery }