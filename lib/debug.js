export default function debug(...logs) {
  if (import.meta.env.DEV && false) {
    console.debug('[dexie-mysql-sync]', ...logs)
  }
}