function user(callback = () => {}) {
  const localStorageUserKey = this.localStorageUserKey
  function getUserValue() {
    try {
      const user = window.localStorage.getItem(localStorageUserKey)
      const userJson = JSON.parse(user)
      return userJson
    } catch (error) {   
      return null
    }
  }
  window.addEventListener('storage', () => {
    const user = getUserValue()
    callback(user)
  })
  return getUserValue()
}

export default user