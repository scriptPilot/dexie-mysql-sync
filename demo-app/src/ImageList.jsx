import FileUploadForm from './FileUploadForm'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './store'

function ImageRow(image) {
  return (
    <tr key={image.id}>
      <td><img src={image.dataUrl} style={{width:'200px'}} /></td>
      <td>{image.name}</td>
      <td>{image.type}</td>
      <td>{(image.size > 1024*1024 ? image.size/1024/1024 : image.size/1024).toFixed(1)} {image.size > 1024*1024 ? 'MB' : 'KB'}</td>
    </tr>
  )
}

function ImageTable() {
  const images = useLiveQuery(() => db.files.where('type').startsWith('image/').toArray())
  if (!images?.length) return ''
  return (    
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        { images?.map(ImageRow) }
      </tbody>
    </table>
  )
}

export default function ImageList() {
  return (
    <div>
      <h2>Image List</h2>
      <FileUploadForm />
      <ImageTable />
    </div>
  )
}