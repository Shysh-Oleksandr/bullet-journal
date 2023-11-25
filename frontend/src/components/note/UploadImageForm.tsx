import { useState } from "react";
import { notesApi } from "../../features/journal/journalApi";

const validFileTypes = ['image/jpg', 'image/jpeg', 'image/png'];

const UploadImageForm = () => {
  const [error, setError] = useState('')

  const [uploadImages] = notesApi.useLazyUploadImagesQuery();

  const [imageUrls, setImageUrls] = useState<string[]>([])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');

    const files = e.target.files;

    if (!files || !files.length) {
      setError("Files are not found");

      return;
    }

    const filteredFiles = Array.from(files).filter(file => validFileTypes.includes(file?.type ?? ''));

    if (!filteredFiles.length) {
      setError("Files must be in JPG/PNG format");

      return;
    }

    const form = new FormData();

    filteredFiles.forEach(file => {
      form.append('images', file);
    })


    const response = await uploadImages(form);

    if (response.data) {
      setImageUrls(prev => [...prev, ...response.data!.urls])
    }
  }



  return (
    <div className='w-full p-12 bg-cyan-200 my-8'>
      <input type="file" multiple name="imageInput" id="imageInput" hidden onChange={handleUpload} />

      <label htmlFor="imageInput">Upload</label>

      {!!error && <h4>{error}</h4>}

      <div>
        {imageUrls.map(imageUrl => (<div key={imageUrl}>
          <img src={imageUrl} alt="some imag" />
        </div>))}
      </div>
    </div>
  );
};

export default UploadImageForm;
