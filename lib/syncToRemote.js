import debug from './debug'

export default async function syncToRemote(table, api, remoteTable, batchSize) {
  //debug('sync to remote > start', { table, api, remoteTable })

  // Catch errors
  try {

    // Run in batches
    let syncCompleted = false
    while (!syncCompleted) {

      // Get not synchronized local docs
      const localDocs = (await table.filter(doc => !doc.$synchronized).limit(batchSize).toArray())

      // Found not synchronized local docs
      if (localDocs.length) {

        // Get relevant remote docs
        const localDocIdStr = localDocs.map(doc => doc.id).join(',')
        const filter = `id,in,${localDocIdStr}`
        const include = 'id,$updated'
        const remoteDocs = (await api.list(remoteTable, { filter, include })).records

        // Loop local docs
        for (const localDoc of localDocs) {

          // Find remote doc
          const remoteDoc = remoteDocs.filter(doc => doc.id === localDoc.id)[0]

          // Remote doc exists
          if (remoteDoc) {

            // Local doc is newer
            if (localDoc.$updated > remoteDoc.$updated) {

              // Define updated remote doc
              const updatedRemoteDoc = { ...localDoc, $synchronized: Date.now() }

              // Update remote doc
              await api.update(remoteTable, remoteDoc.id, updatedRemoteDoc)
              debug('sync to remote > update doc', updatedRemoteDoc)

              // Update synchronized date after update to ensure recognation for other syncs
              await api.update(remoteTable, remoteDoc.id, { $synchronized: Date.now() })            

            }

          // Remote doc does not exist
          } else {

            // Define new remote doc
            const newRemoteDoc = { ...localDoc, $synchronized: Date.now() }

            // Create remote doc
            await api.create(remoteTable, newRemoteDoc)
            debug('sync to remote > create doc', newRemoteDoc)

            // Update synchronized date after creation to ensure recognation for other syncs
            await api.update(remoteTable, localDoc.id, { $synchronized: Date.now() })

          }

          // Deletion flag is set
          if (localDoc.$deleted) {

            // Delete the local doc
            await table.delete(localDoc.id)

          // Deletion flag is not set
          } else {

            // Define the updated local doc (workaround to keep the current $updated value)
            const updatedLocalDoc = { $updated: 'keep', $synchronized: Date.now() }

            // Update the local doc
            await table.update(localDoc.id, updatedLocalDoc)
            
          }

        }

      
      // Not found not synchronized local docs
      } else {
        syncCompleted = true
      }

    }

  } catch (error) {
    debug('sync to remote > failed', error)
  }

  return
}