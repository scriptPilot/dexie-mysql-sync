import debug from './debug'

export default async function syncRemoteToLocal(table, path, api, remoteTable, filter) {
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
          const newLocalDoc = { ...remoteDoc, $synchronized: 1 }
          await table.add(newLocalDoc)
          debug('remote to local > create doc', newLocalDoc)

        }

        // Local doc does exist and is older
        if (localDoc && localDoc.$updated < remoteDoc.$updated) {

          // Update local doc
          const updatedLocalDoc = { ...remoteDoc, $synchronized: 1 }
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