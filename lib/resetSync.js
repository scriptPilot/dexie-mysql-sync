import debug from './debug'

export default async function resetSync(db) {

  // Reset synchronization status for all documents
  const tables = await db?.tables || []
  for (const table of tables) {
    const docs = await table.toArray()    
    debug('resetSync > table', { tableName: table.name, docCount: docs.length })
    for (const doc of docs) {
      await table.update(doc.id, { $updated: doc.$updated, $synchronized: 0 })
    }
  }

  // Reset all saved last sync times from the local storage
  const localStorageKeys = Object.keys(window.localStorage)
  for (const key of localStorageKeys) {
    if (key.startsWith('dexie-mysql-sync')) {
      debug('resetSync > localStorage', key)
      window.localStorage.removeItem(key)
    }
  }

  return

}