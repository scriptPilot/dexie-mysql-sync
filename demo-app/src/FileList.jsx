import { useState } from 'react';
import { db } from './store'

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

  const retrieveAndDisplay = async () => {
    const file = await db.files.orderBy('id').reverse().first();
    if (file) {
      setImageUrl(file.data);
    } else {
      console.log('File not found');
    }
  };

  return (
    <div>
      <h2>Display File</h2>
      <button onClick={retrieveAndDisplay}>Retrieve and Display File</button>
      {imageUrl && <img src={imageUrl} alt="Uploaded file" style={{width:'100%'}} />}
      <textarea value={imageUrl} readOnly />
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
