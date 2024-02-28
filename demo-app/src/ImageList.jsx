import { useState } from 'react';
import { db } from './store'
import { useLiveQuery } from 'dexie-react-hooks'

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
      await db.images.add({ name: file.name, data: fileData });
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

const DisplayFile = () => {
  const files = useLiveQuery(() => db.images.toArray())
  const lastFile = (files || []).sort((a,b) => b.$updated - a.$updated)[0]  
  return (
    <div>
      Last file name: {lastFile?.name}
      {lastFile && <img src={lastFile.data} alt="Uploaded file" style={{width:'100%'}} />}
    </div>
  );
};

const FileList = () => {
  return (
    <div>
      <h2>Image List</h2>
      <UploadFile />
      <DisplayFile />
    </div>
  );
};

export default FileList;
