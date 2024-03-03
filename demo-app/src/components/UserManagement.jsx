/* eslint-disable-rule react/prop-types */

import { useState, useEffect } from 'react'
import { Button, Typography, Input, Alert, Space } from 'antd'
import { sync } from '../store'

const { Title } = Typography

function Register({ user }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('')
  function handleRegister() {
    setAlertMessage('')
    setAlertType('')
    sync.register(username, password)
      .then(user => {
        setUsername('')
        setPassword('')
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
      { !user && form }
      { alert } 
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
    sync.login(username, password)
      .then(async user => {
        setUsername('')
        setPassword('')
        setAlertType('success')
        setAlertMessage(`User ${user.username} logged in with ID ${user.id}.`)
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
      { !user && form }
      { alert } 
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
    sync.password(username, password, newPassword)
      .then(user => {
        setUsername('')
        setPassword('')
        setNewPassword('')
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
    <Space direction="vertical">
      { alert } 
      { user && form }
    </Space>
  )
}

function Logout({ user }) {
  const [isLoading, setIsLoading] = useState(false)
  async function handleLogout() {
    setIsLoading(true)
    sync.logout().finally(setIsLoading(false))
  }
  return (
    <Button type="primary" onClick={handleLogout} disabled={!user} loading={isLoading}>Logout</Button>
  )
}

function LoggedOut({ user }) {
  return (
    <Space direction="vertical">
      <Login user={user} />
      <Register user={user} />
    </Space>
  )
}

function LoggedIn({ user }) {
  return (
    <Space>
      <ChangePassword user={user} />
      <Logout user={user} />
    </Space>
  )
}

function UserManagement() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    sync.user(setUser)
  }, [])
  return (
    <>
      <Title level={2}>User Management</Title>
      { user ? <LoggedIn user={user} /> : <LoggedOut user={user} /> }
    </>
  )
}

export default UserManagement