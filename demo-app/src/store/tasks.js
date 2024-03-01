import { db, useLiveQuery } from './'

async function addTask(titleOrDoc) {
  const doc = typeof titleOrDoc === 'string'
    ? { done: false, title: titleOrDoc }
    : { done: false, ...titleOrDoc }
  return await db.tasks.add(doc)
}
async function updateTask(id, updates) {
  return await db.tasks.update(id, updates)
}
async function deleteTask(id) {
  return await db.tasks.delete(id)
}
function useTasks() {
  const docs = useLiveQuery(() => db.tasks.toArray())
  return (docs || []).filter(doc => !doc.$deleted)
}

export { addTask, updateTask, deleteTask, useTasks }