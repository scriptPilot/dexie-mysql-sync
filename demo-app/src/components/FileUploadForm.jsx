import { useState } from 'react';
import { db } from '../store'

export default function FileUploadForm() {
  const [ file, setFile ] = useState(null)
  function onFileChange(e) {
    setFile(e.target.files[0])
  }
  async function onFileUpload() {
    if (!file) return
    const fileReader = new FileReader()
    fileReader.onload = async e => {
      const name = file.name
      const type = file.type
      const size = file.size
      const dataUrl = e.target.result
      await db.files.add({ name, type, size, dataUrl })
      setFile(null)
    }
    fileReader.readAsDataURL(file)
  }
  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button disabled={!file} onClick={onFileUpload}>Upload</button>
    </div>
  )
}