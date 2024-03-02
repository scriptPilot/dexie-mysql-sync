import FileUploadForm from './FileUploadForm'
import FileDownloadLink from './FileDownloadLink'
import { Flex, Button, Table, Space, Typography } from 'antd'
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store'

const { Title } = Typography

function FileTable() {
  const files = useLiveQuery(() => db.files.orderBy('$created').toArray())
  const columns = [
    {
      title: 'Preview',
      dataIndex: 'preview'
    },
    {
      title: 'File Name',
      dataIndex: 'name'
    },
    {
      title: 'File Type',
      dataIndex: 'type'
    },
    {
      title: 'File Size',
      dataIndex: 'size'
    },
    {
      title: 'Actions',
      dataIndex: 'buttons'
    }
  ]
  const dataSource = files?.map(file => {
    return {
      key: file.id,
      name: file.name,
      type: file.type,
      size: file.size > 1024*1024
        ? (file.size/1024/1024).toFixed(1) + ' MB'
        : (file.size/1024).toFixed(1) + ' KB',
      preview: file.type.startsWith('image/')
        ? <img src={file.dataUrl} style={{width:'200px'}} />
        : <div style={{margin:'20px'}}>No file preview</div>,
      buttons: (
        <Space>
          <FileDownloadLink file={file}>
            <Button type="link" icon={<DownloadOutlined />} />
          </FileDownloadLink>
          <Button danger type="link" icon={<DeleteOutlined />} onClick={() => db.files.delete(file.id)} />
        </Space>
      )
    }
  })
  return (    
   files?.length
     ? <Table columns={columns} dataSource={dataSource} pagination={{pageSize:3}} bordered />
     : ''
  )
}

function FileList() {
  return (
    <Flex vertical gap="large">
      <Title level={2}>File List</Title>
      <FileUploadForm />
      <FileTable />
    </Flex>
  )
}

export default FileList