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

export class Sync {
  constructor(endpoint = '/api.php') {
    this.endpoint = endpoint
    this.localStorageUserKey = `dexie-mysql-sync > user > ${endpoint}`
    this.syncs = []
    this.api = useAPI(this.endpoint)
    this.debug = debug
    this.add = add
    this.reset = reset
    this.emptyTable = emptyTable
    this.register = register
    this.login = login
    this.user = user
    this.password = password
    this.logout = logout
  }
}

export default Sync