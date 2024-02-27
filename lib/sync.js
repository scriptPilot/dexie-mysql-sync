import { v4 as createUUID } from 'uuid'
import useAPI from 'js-crud-api'

import debug from './debug'
import syncLocalToRemote from './syncLocalToRemote'
import syncRemoteToLocal from './syncRemoteToLocal'

export default async function sync(table, path, options = {}) {   
  debug('sync()', { table, path, options: { ...options }})

  // Set synchronization properties on any document creation
  table.hook('creating', (id, doc) => {
    doc.id = doc.id ? doc.id : createUUID()
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

    // User is online
    if (window.navigator.onLine) {

      // Sync to remote
      if (!path.startsWith('from:')) {
        syncLocalToRemote(table, api, remoteTable)
      }

      // Sync from remote
      if (!path.startsWith('to:')) {
        syncRemoteToLocal(table, path, api, remoteTable, filter)
      }

    // User is offline
    } else {
      debug('sync skipped > user offline')
    }

    // Schedule next run
    setTimeout(runSync, options.interval || 1000)

  }
  runSync()  
  
}