import debug from './debug'

async function emptyTable(table) {
  const ids = await table.toCollection().keys()
  for (const id of ids) {
    await table.update(id, { $deleted: 1, $synchronized: 1 })
    await table.delete(id)
  }
  debug(`Empty table "${table.name}" with ${ids.length} doc${ids.length !== 1 ? 's' : ''}.`)
  return
}

export default emptyTable