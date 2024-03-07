import { useContext } from 'react'
import Context from '../context'
import TodoList from './TodoList.jsx'
import FileList from './FileList.jsx'
import UserManagement from './UserManagement.jsx'
import ResetSyncButton from './ResetSyncButton.jsx'
import { App, Layout, Flex, Typography } from 'antd'
import { FileSyncOutlined } from '@ant-design/icons'

const { Title } = Typography
const { Content } = Layout

function ReactApp() {
  const context = useContext(Context)
  console.log('context', context)
  return (    
    <App className="app"> 
      <Content className="content">
        <Flex vertical gap="middle">
          <Title><FileSyncOutlined /> Dexie MySQL Sync</Title>
          <TodoList />
          <FileList />
          <UserManagement />
          <ResetSyncButton />
      </Flex>
      </Content> 
    </App>
  )
}

export default ReactApp