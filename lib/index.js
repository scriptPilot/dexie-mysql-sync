import useAPI from 'js-crud-api'

import debug from './debug'
import add from './add'
import reset from './reset'
import emptyTable from './emptyTable'
import register from './register'
import login from './login'
import user from './user'
import password from './password'
import logout from './logout'

function useSync(endpoint = '/api.php') {
  const localStorageUserKey = `dexie-mysql-sync > user > ${endpoint}`
  return {
    endpoint,
    localStorageUserKey,
    api: useAPI(endpoint),
    debug,
    syncs: [],
    add,
    reset,
    emptyTable,
    register,
    login,
    user,
    password,
    logout
  }
}

export default useSync