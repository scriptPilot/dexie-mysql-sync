import useAPI from 'js-crud-api'
import { useState } from 'react'
import { Space, Button, Typography, Input, Alert, Flex } from 'antd'
import { db, useLiveQuery } from '../store'
import { resetSync } from 'dexie-mysql-sync'

const api = useAPI('/api.php')
const { Title } = Typography

async function resetLocalDB() {
  for (const table of [db.tasks, db.files]) {
    const ids = await table.toCollection().keys()
    for (const id of ids) {
      await table.update(id, { $deleted: 1, $synchronized: 1 })
      await table.delete(id)
    }
  }
  await resetSync(db)
}

function Register({ user }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  function handleRegister() {
    setAlertMessage('')
    setAlertType('')
    api.register(username, password)
      .then(user => {
        setAlertType('success')
        setAlertMessage(`User ${user.username} created with ID ${user.id}.`)
      })
      .catch(err => {
        setAlertType('error')
        setAlertMessage(err.message)
      })
  }
  const alert = alertMessage
    ?  <Alert message={alertMessage} type={alertType || 'info'} />
    : ''
  const form = (
    <Space>
      <Input
        name="username" placeholder="Username"
        value={username} onChange={e => setUsername(e.target.value)} />
      <Input
        name="password" placeholder="Password" type="password"
        value={password} onChange={e => setPassword(e.target.value)} />
      <Button type="primary" onClick={handleRegister} disabled={!username || !password}>Register</Button>
    </Space>
  )
  return (
    <Space direction="vertical">
      { alert } 
      { !user && form }
    </Space>
  )
}

function Login({ user }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  function handleLogin() {
    setAlertMessage('')
    setAlertType('')
    api.login(username, password)
      .then(async user => {
        setAlertType('success')
        setAlertMessage(`User ${user.username} logged in with ID ${user.id}.`)
        await db.settings.put({ id: 'user', value: { ...user } })
        await resetLocalDB()
      })
      .catch(async err => {
        setAlertType('error')
        setAlertMessage(err.message)
      })
  }
  const alert = alertMessage
    ?  <Alert message={alertMessage} type={alertType || 'info'} />
    : ''
  const form = (
    <Space>
      <Input
        name="username" placeholder="Username"
        value={username} onChange={e => setUsername(e.target.value)} />
      <Input
        name="password" placeholder="Password" type="password"
        value={password} onChange={e => setPassword(e.target.value)} />
      <Button type="primary" onClick={handleLogin} disabled={!username || !password}>Login</Button>
    </Space>
  )
  return (
    <Space direction="vertical">
      { alert } 
      { !user && form }
    </Space>
  )
}

function ChangePassword({ user }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  function handleRegister() {
    setAlertMessage('')
    setAlertType('')
    api.password(username, password, newPassword)
      .then(user => {
        setAlertType('success')
        setAlertMessage(`Updated password for user ${user.username} with ID ${user.id}.`)
      })
      .catch(err => {
        setAlertType('error')
        setAlertMessage(err.message)
      })
  }
  const alert = alertMessage
    ?  <Alert message={alertMessage} type={alertType || 'info'} />
    : ''
  const form = (
    <Space>
      <Input
        name="username" placeholder="Username"
        value={username} onChange={e => setUsername(e.target.value)} />
      <Input
        name="password" placeholder="Password" type="password"
        value={password} onChange={e => setPassword(e.target.value)} />
      <Input
        name="newPassword" placeholder="New password" type="password"
        value={newPassword} onChange={e => setNewPassword(e.target.value)} />
      <Button type="primary" onClick={handleRegister} disabled={!username || !password || !newPassword}>Change Password</Button>
    </Space>
  )
  return (
    <Flex vertical gap="middle">
      { user && form }
      { alert } 
    </Flex>
  )
}

function Logout({ user }) {
  async function handleLogout() {
    await api.logout()
    await db.settings.delete('user')
    await resetLocalDB()
  }
  return (
    <Button type="primary" onClick={handleLogout} disabled={!user}>Logout</Button>
  )
}

function LoggedOut({ user }) {
  return (
    <Space direction="vertical">
      <Register user={user} />
      <Login user={user} />
    </Space>
  )
}

function LoggedIn({ user }) {
  return (
    <Flex gap="large">
      <ChangePassword user={user} />
      <Logout user={user} />
    </Flex>
  )
}

function UserManagement() {
  const user = useLiveQuery(() => db.settings.get('user'))?.value || null
  return (
    <>
      <Title level={2}>User Management</Title>
      { user ? <LoggedIn user={user} /> : <LoggedOut user={user} /> }
    </>
  )
}

export default UserManagement