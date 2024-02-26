import { v4 as createUUID, validate as isValidUUID } from 'uuid'
import useAPI from 'js-crud-api'

function debug(...logs) {
  if (import.meta.env.DEV) {
    console.debug('[dexie-mysql-sync]', ...logs)
  }
}

export async function resetSync(db) {

  // Reset synchronization status for all documents
  const tables = await db.tables
  for (const table of tables) {
    const docs = await table.toArray()    
    debug('resetSync > table', { tableName: table.name, docCount: docs.length })
    for (const doc of docs) {
      await table.update(doc.id, { $updated: doc.$updated, $synchronized: false })
    }
  }

  // Reset all saved last sync times from the local storage
  const localStorageKeys = Object.keys(window.localStorage)
  for (const key of localStorageKeys) {
    if (key.startsWith('dexie-mysql-sync')) {
      debug('resetSync > localStorage', key)
      window.localStorage.removeItem(key)
    }
  }

}

async function syncLocalToRemote(table, api, remoteTable) {
  debug('local to remote > start', { table, api, remoteTable })

  // Catch errors
  try {

    // Get not synchronized local docs
    const localDocs = (await table.toArray()).filter(doc => !doc.$synchronized)

    // Found not synchronized local docs
    if (localDocs.length) {

      // Get relevant remote docs
      const localDocIdStr = localDocs.map(doc => doc.id).join(',')
      const remoteDocs = (await api.list(remoteTable, { filter: `id,in,${localDocIdStr}` })).records

      // Loop local docs
      for (const localDoc of localDocs) {

        // Find remote doc
        const remoteDoc = remoteDocs.filter(doc => doc.id === localDoc.id)[0]
          
        // Remote doc does not exist
        if (!remoteDoc) {

          // Create remote doc
          const newRemoteDoc = { ...localDoc, $synchronized: Date.now() }
          await api.create(remoteTable, newRemoteDoc)
          debug('local to remote > create doc', newRemoteDoc)

          // Update synchronized date after creation to ensure recognation for other syncs
          await api.update(remoteTable, localDoc.id, { $synchronized: Date.now() })

        }

        // Remote doc does exist and is older
        if (remoteDoc && remoteDoc.$updated < localDoc.$updated) {

          // Update remote doc
          const updatedRemoteDoc = { ...localDoc, $synchronized: Date.now() }
          await api.update(remoteTable, remoteDoc.id, updatedRemoteDoc)
          debug('local to remote > update doc', updatedRemoteDoc)

          // Update synchronized date after update to ensure recognation for other syncs
          await api.update(remoteTable, remoteDoc.id, { $synchronized: Date.now() })

        }

        // Update synchronization status of local doc
        await table.update(localDoc.id, { $updated: localDoc.$updated, $synchronized: Date.now() })

      }

    }

  } catch (error) {
    debug('local to remote > failed', error)
  }

  return
}

async function syncRemoteToLocal(table, path, api, remoteTable, filter) {
  debug('remote to local > start', { table, path, api, remoteTable, filter })

  // Catch errors
  try {

    // Remember sync start time
    const syncStartTime = Date.now()

    // Define local storage key for last sync time
    const localStorageKey = `dexie-mysql-sync > ${table.name} > ${path}`

    // Get last sync time      
    const lastSyncTime = parseInt(window.localStorage.getItem(localStorageKey) || 0)

    // Get not synchronized remote docs
    const lastSyncFilter = (filter.indexOf('?') === -1 ? '?' : '&') + `filter=$synchronized,ge,${lastSyncTime}`
    const remoteDocs = (await api.list(remoteTable + filter + lastSyncFilter)).records

    // Found not synchronized remote docs
    if (remoteDocs.length) {

      // Get local docs
      const localDocs = await table.toArray()

      // Loop remote docs
      for (const remoteDoc of remoteDocs) {

        // Find local doc
        const localDoc = localDocs.filter(doc => doc.id === remoteDoc.id)[0]
          
        // Local doc does not exist and remote deletion flag is not set
        if (!localDoc && !remoteDoc.$deleted) {

          // Create local doc
          const newLocalDoc = { ...remoteDoc, $synchronized: true }
          await table.add(newLocalDoc)
          debug('remote to local > create doc', newLocalDoc)

        }

        // Local doc does exist and is older
        if (localDoc && localDoc.$updated < remoteDoc.$updated) {

          // Update local doc
          const updatedLocalDoc = { ...remoteDoc, $synchronized: true }
          await table.update(localDoc.id, updatedLocalDoc)
          debug('remote to local > update doc', updatedLocalDoc)

        }

      }

    }

    // Remember sync start time
    // To respect syncReset(), use 0 if the item does not exist
    const itemExists = window.localStorage.getItem(localStorageKey) !== null
    window.localStorage.setItem(localStorageKey, itemExists ? syncStartTime : 0)

  } catch (error) {
    debug('remote to local > failed', error)
  }

  return
}

export default async function sync(table, path, options = {}) {   
  debug('sync()', { table, path, options: { ...options }})

  // Set synchronization properties on any document creation
  table.hook('creating', (id, doc) => {
    doc.id = isValidUUID(doc.id) ? doc.id : createUUID()
    doc.$updated = doc.$updated !== undefined ? doc.$updated : Date.now()
    doc.$deleted = doc.$deleted !== undefined ? doc.$deleted : false
    doc.$synchronized = doc.$synchronized !== undefined ? doc.$synchronized : false
    debug('create hook', { tableName: table.name, id, doc: { ...doc }})
  })

  // Update sync properties on any document update
  table.hook('updating', (updates, id) => {
    const additionalUpdates = {
      $updated: updates.$updated !== undefined ? updates.$updated : Date.now(),
      $synchronized: updates.$synchronized !== undefined ? updates.$synchronized : false
    }
    debug('update hook', { tableName: table.name, id, updates: { ...updates, ...additionalUpdates } })
    return additionalUpdates
  })

  // Keep deleted documents to ensure synchronization
  table.hook('deleting', (id, doc) => {
    debug('delete hook', { tableName: table.name, id, doc: { ... doc } })
    table.add({
      ...doc,
      $updated: Date.now(),
      $deleted: true,
      $synchronized: false
    })
  })

  // Define the API
  const api = useAPI(options.endpoint || '/api.php')

  // Split the path to table and filter options
  const pathRegEx = /^(to:|from:)?(.*?)(\?.*)?$/
  const remoteTable = path.replace(pathRegEx, '$2')
  const filter = path.replace(pathRegEx, '$3').replace('include=', 'include=id,$deleted,$updated,')

  // Run synchronization with interval
  function runSync() {

    // Sync to remote
    if (!path.startsWith('from:')) {
      syncLocalToRemote(table, api, remoteTable)
    }

    // Sync from remote
    if (!path.startsWith('to:')) {
      syncRemoteToLocal(table, path, api, remoteTable, filter)
    }

    // Schedule next run
    setTimeout(runSync, options.interval || 1000)

  }
  runSync()  
  
}