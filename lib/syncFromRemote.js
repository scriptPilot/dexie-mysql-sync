import debug from './debug'

export default async function syncFromRemote(table, path, api, remoteTable, filter, localStorageKey) {
  //debug('sync from remote > start', { table, path, api, remoteTable, filter, localStorageKey })

  // Catch errors
  try {

    // Remember sync start time
    const syncStartTime = Date.now()

    // Get last sync time      
    const lastSyncTime = parseInt(window.localStorage.getItem(localStorageKey) || 0)

    // Get not synchronized remote docs
    const lastSyncFilter = (filter.indexOf('?') === -1 ? '?' : '&') + `filter=$synchronized,ge,${lastSyncTime}`
    const remoteDocs = (await api.list(remoteTable + filter + lastSyncFilter)).records

    // Found not synchronized remote docs
    if (remoteDocs.length) {

      // Loop remote docs
      for (const remoteDoc of remoteDocs) {

        // Find local doc
        const localDoc = await table.get(remoteDoc.id)

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