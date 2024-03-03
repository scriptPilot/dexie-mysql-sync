function logout() {
  return new Promise((resolve, reject) => {
    this.api.logout()
      .then(() => {
        resolve()
      })
      .catch(error => {
        reject(error)
      })
      .finally(async () => {
        window.localStorage.removeItem(this.localStorageUserKey)
        window.dispatchEvent( new Event('storage') )
        for (const sync of this.syncs) {
          await this.emptyTable(sync.table)
        }
        await this.reset()
      })
  })
}

export default logout