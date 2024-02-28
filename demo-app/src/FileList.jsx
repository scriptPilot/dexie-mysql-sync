import { useState } from 'react';
import { db } from './store'
import useAPI from 'js-crud-api'
import { useLiveQuery } from 'dexie-react-hooks'

const api = useAPI('/api.php')

function arrayBufferToDataURL(arrayBuffer) {
  const blob = new Blob([arrayBuffer]);
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
      reader.onload = () => {
          const dataUrl = reader.result;
          resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}

const UploadFile = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const res = event.target.result;
      const mime = res.replace(/^data:(.*?);base64,(.+)$/, '$1')
      const data = res.replace(/^data:(.*?);base64,(.+)$/, '$2')
      await db.files.add({ name: file.name, mime, data });
      setFile(null);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

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
      <UploadFile />
      <DownloadFileList />
    </div>
  );
};

export default App;
