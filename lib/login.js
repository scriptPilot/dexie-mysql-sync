function login(username, password) {
  return new Promise((resolve, reject) => {
    this.api.login(username, password)
      .then(async user => {
        window.localStorage.setItem(this.localStorageUserKey, JSON.stringify(user))
        window.dispatchEvent( new Event('storage') )
        for (const sync of this.syncs) {
          await this.emptyTable(sync.table)
        }
        await this.reset()
        resolve(user)
      })
      .catch(reject)
  })
}

export default login