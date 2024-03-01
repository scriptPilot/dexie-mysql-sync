import { useState, useRef, useEffect } from 'react';
import { db } from '../store'
import { Flex, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

export default function FileUploadForm() {
  const fileSizeLimitMB = 5
  const inputField = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  function onButtonClick() {
    inputField.current.click()
  }
  async function onFileChange() {    
    setIsLoading(true)
    const file = inputField.current.files[0]
    if (file.size > fileSizeLimitMB*1024*1024) {
      messageApi.open({
        type: 'warning',
        content: `${fileSizeLimitMB} MB maximum file size for performance reasons.`
      })
      setIsLoading(false)
      return
    }
    const fileReader = new FileReader()
    fileReader.onload = async e => {
      const name = file.name
      const type = file.type
      const size = file.size
      const dataUrl = e.target.result
      await db.files.add({ name, type, size, dataUrl })
      setIsLoading(false)
    }
    fileReader.readAsDataURL(file)
  }
  return (
    <Flex gap="middle">
      {contextHolder}
      <input
        type="file"
        onChange={onFileChange}
        ref={inputField}
        style={{display:'none'}} />
      <Button
        type="primary"
        style={{width:'200px'}}
        icon={<UploadOutlined />}
        loading={isLoading}
        onClick={onButtonClick}
      >
        Upload File
      </Button>
    </Flex>
  )
}