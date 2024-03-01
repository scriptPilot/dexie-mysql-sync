// Import Dexie.js
import Dexie from 'dexie'

// Import Dexie React Hook
import { useLiveQuery } from 'dexie-react-hooks'

// Import the sync function
import { sync } from 'dexie-mysql-sync'

// Setup the local database
// Adding $deleted as index allows to query on that field
const db = new Dexie('databaseName')
db.version(1).stores({
  tasks: '++id, title, done, $deleted',
  files: '++id, name, type, size, $deleted'
})

// Start the synchronization
sync(db.tasks, 'tasks')
sync(db.files, 'files')

// Export the database object
export { db, useLiveQuery }