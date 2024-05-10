export default async function fetchImageFromURL(imageURL: string) {
  try {
    const res = await fetch(imageURL)
    if (!res.ok) {
      throw new Error('Failed to fetch image')
    }

    const imageBlob = await res.blob()
    return imageBlob

  } catch (e) {
    console.error('(image) Error Uploading Image:', e)
  }
}