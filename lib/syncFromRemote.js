import debug from './debug'

export default async function syncFromRemote(table, path, api, remoteTable, localStorageKey, batchSize) {
  //debug('sync from remote > start', { table, path, api, remoteTable, localStorageKey })

  // Catch errors
  try {

    // Remember sync start time
    const syncStartTime = Date.now()

    // Get last sync time
    const lastSyncTime = parseInt(window.localStorage.getItem(localStorageKey) || 0)

    // Run in batches
    let syncCompleted = false
    let pageNumber = 0
    while (!syncCompleted) {

      // Get not synchronized remote docs
      pageNumber++
      const filter = `$synchronized,ge,${lastSyncTime}`
      const include = `id,$updated,$deleted`
      const order = `$synchronized`
      const page = `${pageNumber},${batchSize}`
      const remoteDocs = (await api.list(remoteTable, { filter, include, order, page })).records

      // Found not synchronized remote docs
      if (remoteDocs.length) {

        // Loop remote docs
        for (let remoteDoc of remoteDocs) {
          
          // Deletion flag set
          if (remoteDoc.$deleted) {

            // Get local doc
            const localDoc = await table.get(remoteDoc.id)
            
            // Local doc exists
            if (localDoc) {

              // Remote doc is newer
              if (remoteDoc.$updated > localDoc.$updated) {

                // Update local doc to avoid re-sync
                await table.update(remoteDoc.id, { $deleted: 1, $updated: 'keep', $synchronized: Date.now() })

                // Delete local doc
                await table.delete(remoteDoc.id)

              }

            }

          }

          // Deletion flag is not set
          if (!remoteDoc.$deleted) {
                      
            // Get local doc
            const localDoc = await table.get(remoteDoc.id)

            // Local doc exists
            if (localDoc) {

              // Remote doc is newer
              if (remoteDoc.$updated > localDoc.$updated) {

                // Get full remote doc
                remoteDoc = await api.read(remoteTable, remoteDoc.id)

                // Define updated local doc
                const updatedLocalDoc = { ...remoteDoc, $synchronized: Date.now() }

                // Update local doc
                await table.update(localDoc.id, updatedLocalDoc)
                debug('sync from remote > update doc', updatedLocalDoc)

              }
              
            }

            // Local doc does not exist
            if (!localDoc) {

              // Get full remote doc
              remoteDoc = await api.read(remoteTable, remoteDoc.id)

              // Define new local doc
              const newLocalDoc = { ...remoteDoc, $synchronized: Date.now() }

              // Create local doc
              await table.add(newLocalDoc)
              debug('sync from remote > create doc', newLocalDoc)


            }

          }

        }

      }

      // Not found not synchronized remote docs
      if (!remoteDocs.length) {

        // Mark sync as completed
        syncCompleted = true

      }

    }

     // Get last sync time now to check for a reset a in the meantime      
     const lastSyncTimeNow = parseInt(window.localStorage.getItem(localStorageKey) || 0)
     const resetInTheMeantime = lastSyncTimeNow !== lastSyncTime
     
    // Remember the sync start time
    if (!resetInTheMeantime) {
      window.localStorage.setItem(localStorageKey, syncStartTime)
    }

  } catch (error) {
    debug('sync from remote > failed', error)
  }

  return
}