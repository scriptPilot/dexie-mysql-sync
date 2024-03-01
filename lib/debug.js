export default function debug(...logs) {
  if (import.meta.env.DEV) {
    console.debug('[dexie-mysql-sync]', ...logs)
  }
}