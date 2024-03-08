import { v4 as createUUID } from 'uuid'

import syncToRemote from './syncToRemote'
import syncFromRemote from './syncFromRemote'

export default async function add(table, path, options = {}) {   

  const api = this.api
  const debug = this.debug
  const batchSize = options.batchSize || 10
  const localStorageKey = `dexie-mysql-sync > ${table.name} > ${path}`

  debug('sync()', { table, path, options: { ...options }})

  // Avoid that filters are passed with the path
  if (path.indexOf('?') !== -1) throw new Error('The path must not contain "?".')
  
  // Avoid that the same table is synchronized twice
  if (this.syncs.filter(s => s.table.name === table.name).length) throw new Error('The same Dexie.js table cannot be synchronized twice.')
  this.syncs.push({ table, path, options, localStorageKey })

  // Set synchronization properties on any document creation
  table.hook('creating', (id, doc) => {
    doc.id = doc.id || createUUID()
    doc.$created = doc.$created || Date.now()
    doc.$updated = doc.$updated || Date.now()
    doc.$deleted = doc.$deleted || 0
    doc.$synchronized = doc.$synchronized || 0
    debug('create hook', { tableName: table.name, doc: { ...doc }})
  })

  // Update sync properties on any document update (workaound to keep the current $updated value)
  table.hook('updating', (updates, id, doc) => {
    const additionalUpdates = {
      $updated: updates.$updated === 'keep' ? doc.$updated : (updates.$updated || Date.now()),
      $synchronized: updates.$synchronized || 0,
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

  // Extract the remote table from the path
  const pathRegEx = /^(to:|from:)?(.+)$/
  const remoteTable = path.replace(pathRegEx, '$2')

  // Run synchronization with interval
  async function runSync() {

    // User is online
    if (window.navigator.onLine) {

      // Sync from remote
      if (!path.startsWith('to:')) {
        await syncFromRemote(table, path, api, remoteTable, localStorageKey, batchSize)
      }

      // Sync to remote
      if (!path.startsWith('from:')) {
        await syncToRemote(table, api, remoteTable, batchSize)
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