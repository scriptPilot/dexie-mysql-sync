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
      await db.files.add({ name: file.name, data: fileData });
      setFile(null);
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

const DisplayFile = () => {
  const [imageUrl, setImageUrl] = useState('');
  const files = useLiveQuery(() => db.files.toArray())
  const lastFile = (files || []).sort((a,b) => b.$updated - a.$updated)[0]
  
  return (
    <div>
      Last file name: {lastFile?.name}
      <h2>Display File</h2>
      {lastFile && <img src={lastFile.data} alt="Uploaded file" style={{width:'100%'}} />}
    </div>
  );
};

const FileList = () => {
  return (
    <div>
      <UploadFile />
      <DisplayFile />
    </div>
  );
};

export default FileList;
