import FileUploadForm from './FileUploadForm'
import FileDownloadLink from './FileDownloadLink'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store'

function FileRow(file) {
  return (
    <tr key={file.id}>
      <td>
        <FileDownloadLink file={file}>
          {
            file.type.startsWith('image/')
              ? <img src={file.dataUrl} style={{width:'200px'}} />
              : <p style={{margin:'20px'}}>No file preview</p>
          }
        </FileDownloadLink>
      </td>        
      <td>{file.name}</td>
      <td>{file.type}</td>
      <td>{(file.size > 1024*1024 ? file.size/1024/1024 : file.size/1024).toFixed(1)} {file.size > 1024*1024 ? 'MB' : 'KB'}</td>
      <td><button onClick={() => db.files.delete(file.id)}>Delete</button></td>
    </tr>
  )
}

function FileTable() {
  const files = useLiveQuery(() => db.files.where('$deleted').notEqual(1).toArray())
  if (!files?.length) return ''
  return (    
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        { files?.map(FileRow) }
      </tbody>
    </table>
  )
}

function FileList() {
  return (
    <div>
      <h2>File List</h2>
      <FileUploadForm />
      <FileTable />
    </div>
  )
}

export default FileList