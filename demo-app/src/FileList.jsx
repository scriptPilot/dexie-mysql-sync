import { useState } from 'react';
import { db } from './store'
import useAPI from 'js-crud-api'
import { useLiveQuery } from 'dexie-react-hooks'

const api = useAPI('/api.php')

const UploadFile = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const fileData = event.target.result;
      await db.files.add({ name: file.name, data: fileData });
      //await api.create('files', { data: new Blob([fileData]) })
      setFile(null);
    };
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

const downloadFile = async (fileName) => {
  const file = await db.files.get({ name: fileName });
  if (file) {
    const blob = new Blob([file.data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
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
            {file.name} - <button onClick={() => downloadFile(file.name)}>Download</button>
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
