import Context from './context'
import { db, sync, useLiveQuery } from './store'

export default ({ children }) => {
  return (
    <Context.Provider value={{ db, sync, useLiveQuery }}>
      { children }
    </Context.Provider>
  )
}