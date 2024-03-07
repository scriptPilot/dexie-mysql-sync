import { createContext } from 'react'

export default createContext({
  value: 0,
  set(value) {
    this.value = value
  },
  get() {
    return this.value
  },
})