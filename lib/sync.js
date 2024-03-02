import { v4 as createUUID } from 'uuid'
import useAPI from 'js-crud-api'

import debug from './debug'
import syncToRemote from './syncToRemote'
import syncFromRemote from './syncFromRemote'

export default async function sync(table, path, options = {}) {   
  debug('sync()', { table, path, options: { ...options }})

  // Set synchronization properties on any document creation
  table.hook('creating', (id, doc) => {
    doc.id = doc.id || createUUID()
    doc.$created = doc.$created || Date.now()
    doc.$updated = doc.$updated || Date.now()
    doc.$deleted = doc.$deleted || 0
    doc.$synchronized = doc.$synchronized || 0
    debug('create hook', { tableName: table.name, doc: { ...doc }})
  })

  // Update sync properties on any document update
  table.hook('updating', (updates, id) => {
    const additionalUpdates = {
      $updated: updates.$updated || Date.now(),
      $synchronized: updates.$synchronized || 0
    }
    debug('update hook', { tableName: table.name, id, updates: { ...updates, ...additionalUpdates } })
    return additionalUpdates
  })

  // Keep deleted documents to ensure synchronization
  // Do not keep if the deletion flag is already set (= deletion after sync to remote)
  table.hook('deleting', (id, doc) => {
    debug('delete hook', { tableName: table.name, id, doc: { ... doc } })
    if (!doc.$deleted) {
      table.add({
        ...doc,
        $updated: Date.now(),
        $deleted: 1,
        $synchronized: 0
      })
    }
  })

  // Filter deleted documents from results
  table.hook('reading', doc => {
    return !doc.$deleted
  })

  // Define the API
  const api = useAPI(options.endpoint || '/api.php')

  // Split the path to table and filter options
  const pathRegEx = /^(to:|from:)?(.*?)(\?.*)?$/
  const remoteTable = path.replace(pathRegEx, '$2')
  const filter = path.replace(pathRegEx, '$3').replace('include=', 'include=id,$created,$updated,$deleted')

  // Run synchronization with interval
  function runSync() {

    // User is online
    if (window.navigator.onLine) {

      // Sync from remote
      if (!path.startsWith('to:')) {
        syncFromRemote(table, path, api, remoteTable, filter)
      }

      // Sync to remote
      if (!path.startsWith('from:')) {
        syncToRemote(table, api, remoteTable)
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