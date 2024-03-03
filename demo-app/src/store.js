// Import Dexie.js
import Dexie from 'dexie'

// Import Dexie React Hook
import { useLiveQuery } from 'dexie-react-hooks'

// Import the sync hook
import Sync from 'dexie-mysql-sync'

// Setup the local database
// Adding $created and $deleted as index allows to query on these fields
const db = new Dexie('databaseName')
db.version(1).stores({
  tasks: '++id, title, done, $created, $deleted',
  files: '++id, name, type, size, $created, $deleted',
})

// Start the synchronization
const sync = new Sync()
sync.add(db.tasks, 'tasks')
sync.add(db.files, 'files')

// Export the database and sync objects
export { db, sync, useLiveQuery }