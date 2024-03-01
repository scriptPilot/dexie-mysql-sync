import FileUploadForm from './FileUploadForm'
import { db } from '../store'
import { useLiveQuery } from 'dexie-react-hooks'

const downloadFile = async (fileId) => {
  const file = await db.files.get(fileId);
  if (file) {
    //const blob = new Blob([file.data], { type: 'application/octet-stream' });
    //const url = URL.createObjectURL(blob);
    const url = `data:${file.mime};base64,${file.data}`
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const DownloadFileList = () => { 

  const files = useLiveQuery(() => db.files.toArray())  

  return (
    <div>
      <ul>
        {files?.map(file => (
          <li key={file.id}>
            {file.name} - <button onClick={() => downloadFile(file.id)}>Download</button>
            <button onClick={() => db.files.delete(file.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  return (
    <div>
    <h2>File List</h2>
      <FileUploadForm />
      <DownloadFileList />
    </div>
  );
};

export default App;
