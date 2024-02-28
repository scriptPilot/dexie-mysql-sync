import debug from './debug'

export default async function syncLocalToRemote(table, api, remoteTable) {
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

        // Delete the local doc if the deletion flag was set
        if (localDoc.$deleted) {
          await table.delete(localDoc.id)

        // Update synchronization status of local doc
        } else {
          await table.update(localDoc.id, { $updated: localDoc.$updated, $synchronized: Date.now() })
        }

      }

    }

  } catch (error) {
    debug('local to remote > failed', error)
  }

  return
}