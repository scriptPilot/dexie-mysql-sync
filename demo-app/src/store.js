// Import Dexie.js
import Dexie from 'dexie'

// Import Dexie React Hook
import { useLiveQuery } from 'dexie-react-hooks'

// Import the sync function
import { sync } from 'dexie-mysql-sync'

// Setup the local database
// Adding $created and $deleted as index allows to query on these fields
const db = new Dexie('databaseName')
db.version(1).stores({
  tasks: '++id, title, done, $created, $deleted',
  files: '++id, name, type, size, $created, $deleted'
})

// Start the synchronization
sync(db.tasks, 'tasks')
sync(db.files, 'files')

// Export the database object
export { db, useLiveQuery }