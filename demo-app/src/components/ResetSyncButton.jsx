import { useState } from 'react'
import { Button, Flex, Typography } from 'antd'
import { SyncOutlined } from '@ant-design/icons'

const { Title } = Typography

import { db } from '../store'
import { resetSync } from 'dexie-mysql-sync'

export default function App() {
  const [ isLoading, setIsLoading ] = useState(false)
  async function onReset() {
    setIsLoading(true)
    resetSync(db).then(() => {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    })
  }
  return (    
    <Flex gap="middle" vertical>
      <Title level={2}>Reset Sync</Title>
      <Button type="primary" loading={isLoading} style={{width: '200px'}} icon={<SyncOutlined />} onClick={onReset}>Reset Sync</Button>
    </Flex>
  )
}