import postAPI from '../postAPI'
import sanitizeString from '@/utils/helper-functions/sanitizeString';

async function uploadImageFromURL(imageURL: string, imageFolder: string, filename: string) {
  filename = sanitizeString(filename)
  const path = `images/${imageFolder}/${filename}`;

  try {
    const res = await fetch(imageURL)
    if (!res.ok) {
      throw new Error('Failed to fetch image')
    }

    const imageBlob = await res.blob()
    const formData = new FormData()
    formData.append('file', imageBlob);
    formData.append('filename', path);

    await postAPI('files', formData)

  } catch (e) {
    console.error('(image) Error Uploading Image:', e)
  }
}

export default uploadImageFromURL
