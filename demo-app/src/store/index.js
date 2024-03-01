// Import Dexie
import Dexie from 'dexie'

// Import Dexie React Hook
import { useLiveQuery } from 'dexie-react-hooks'

// Import Dexie MySQL Sync
import { sync } from 'dexie-mysql-sync'

// Setup the local database
const db = new Dexie('databaseName')
db.version(1).stores({
  tasks: '++id, title, done',
  files: '++id, name, type, size' // , dataUrl
})

// Start the synchronization
sync(db.tasks, 'tasks')
sync(db.files, 'files')

// Export database and live queries
export { db, useLiveQuery }