import debug from './debug'

export default async function reset() {

  const syncs = this.syncs

  // Loop syncs
  for (const sync of syncs) {

    // Reset the synchronization status for all documents
    const docs = await sync.table.filter(doc => doc.$synchronized).toArray()
    debug('resetSync > table', { tableName: sync.table.name, docCount: docs.length })
    for (const doc of docs) {
      await sync.table.update(doc.id, { $updated: doc.$updated, $synchronized: 0 })
    }

    // Reset the saved last sync time from the local storage
    window.localStorage.removeItem(sync.localStorageKey)

  }

  return

}