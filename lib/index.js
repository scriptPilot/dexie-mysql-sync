import { v4 as uuid } from 'uuid'
import useAPI from 'js-crud-api'

export function resetSync() {
  const localStorageKeys = Object.keys(window.localStorage)
  for (const key of localStorageKeys) {
    if (key.startsWith('dexie-mysql-sync')) {
      window.localStorage.removeItem(key)
    }
  }
}

export async function add(collection, doc) {
  return collection.add({
    id: uuid(),
    $deleted: false,
    $updated: Date.now(),
    $synchronized: 0,
    ...doc
  })
}

export async function update(collection, id, updates) {
  return collection.update(id, {
    $updated: Date.now(),
    $synchronized: 0,
    ...updates
  })
}

export async function remove(collection, id) {
  return collection.update(id, {
    $deleted: true,
    $updated: Date.now(),
    $synchronized: 0
  })
}

export async function sync(collection, path, options = {}) {   

  // Define API
  const api = useAPI(options.endpoint || '/api.php')

  // Define remote table
  const pathRegEx = /^(to:|from:)?(.*?)(\?.*)?$/
  const table = path.replace(pathRegEx, '$2')
  const filter = path.replace(pathRegEx, '$3').replace('include=', 'include=id,$deleted,$updated,')

  // Sync to remote
  if (!path.startsWith('from:')) {

    // Catch errors
    try {

      // Get not synchronized local docs
      const docs = (await collection.toArray()).filter(doc => !doc.$synchronized)

      // Found not synchronized local docs
      if (docs.length) {

        // Get relevant remote docs
        const localDocIdStr = docs.map(doc => doc.id).join(',')
        const remoteDocs = (await api.list(table, { filter: `id,in,${localDocIdStr}` })).records

        // Loop local docs
        for (const doc of docs) {

          // Find remote doc
          const remoteDoc = remoteDocs.filter(d => d.id === doc.id)[0]
            
          // Remote doc does not exist
          if (!remoteDoc) {

            // Create remote doc
            await api.create(table, doc)

            // Set synchronized date after creation to ensure recognation for other syncs
            await api.update(table, doc.id, { $synchronized: Date.now() })

          }

          // Remote doc does exist and is older
          if (remoteDoc && remoteDoc.$updated < doc.$updated) {

            // Update remote doc
            await api.update(table, doc.id, doc)

            // Set synchronized date after update to ensure recognation for other syncs
            await api.update(table, doc.id, { $synchronized: Date.now() })

          }

          // Update synchronization status of local doc
          await collection.update(doc.id, { $synchronized: Date.now() })

        }

      }

    } catch (error) {
      console.warn('Sync to remote failed', error)
    }

  }

  // Sync from remote
  if (!path.startsWith('to:')) {

    // Catch errors
    try {

      // Remember sync start time
      const syncStartTime = Date.now()

      // Define local storage key for last sync time
      const localStorageKey = `dexie-mysql-sync > ${collection.name} > ${path}`

      // Get last sync time      
      const lastSyncTime = parseInt(window.localStorage.getItem(localStorageKey) || 0)

      // Get not synchronized remote docs
      const lastSyncFilter = (filter.indexOf('?') === -1 ? '?' : '&') + `filter=$synchronized,ge,${lastSyncTime}`
      const remoteDocs = (await api.list(table + filter + lastSyncFilter)).records

      // Found not synchronized remote docs
      if (remoteDocs.length) {

        // Get local docs
        const docs = await collection.toArray()

        // Loop remote docs
        for (const remoteDoc of remoteDocs) {

          // Find local doc
          const doc = docs.filter(d => d.id === remoteDoc.id)[0]
            
          // Local doc does not exist and deletion flag is not set
          if (!doc && !remoteDoc.$deleted) {

            // Create local doc
            await collection.add({ ...remoteDoc, $synchronized: Date.now() })

          }

          // Local doc does exist and is older
          if (doc && doc.$updated < remoteDoc.$updated) {

            // Update local doc
            await collection.update(doc.id, { ...remoteDoc, $synchronized: Date.now() })

          }

        }

      }

      // Remember sync start time
      window.localStorage.setItem(localStorageKey, syncStartTime)

    } catch (error) {
      console.warn('Sync from remote failed', error)
    }

  }

  setTimeout(() => sync(collection, path, options), options.interval || 1000)
}