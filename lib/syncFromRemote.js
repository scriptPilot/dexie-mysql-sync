import debug from './debug'

export default async function syncFromRemote(table, path, api, remoteTable, filter) {
  debug('sync from remote > start', { table, path, api, remoteTable, filter })

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

        // Local doc exists
        if (localDoc) {

          // Remote doc is newer
          if (remoteDoc.$updated > localDoc.$updated) {

            // Define updated local doc
            const updatedLocalDoc = { ...remoteDoc, $synchronized: Date.now() }

            // Update local doc
            await table.update(localDoc.id, updatedLocalDoc)
            debug('sync from remote > update doc', updatedLocalDoc)

            // Deletion flag set
            if (remoteDoc.$deleted) {

              // Delete local doc
              await table.delete(remoteDoc.id)

            }

          }

        // Local doc does not exist
        } else {
          
          // No deletion flag
          if (!remoteDoc.$deleted) {

            // Define new local doc
            const newLocalDoc = { ...remoteDoc, $synchronized: Date.now() }

            // Create local doc
            await table.add(newLocalDoc)
            debug('sync from remote > create doc', newLocalDoc)

          }

        }       

      }

    }

    // Remember sync start time
    // To respect syncReset(), use 0 if the item does not exist
    const itemExists = window.localStorage.getItem(localStorageKey) !== null
    window.localStorage.setItem(localStorageKey, itemExists ? syncStartTime : 0)

  } catch (error) {
    debug('sync from remote > failed', error)
  }

  return
}