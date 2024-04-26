import sanitizeString from "../../helperFunctions/sanitizeString";
import postAPI from "../postAPI";
//devMode will prevent the image from being uploaded
export default async function handleImageUpload(image: any, imageFolder: string, filename: string, devMove?: boolean) {
    filename = sanitizeString(filename) //santized :D
    const path = `images/${imageFolder}/${filename}`;
    const formData = new FormData();
    formData.append('file', image[0].file);
    formData.append('filename', path);
    if (!devMove) {
        try {
            await postAPI('files', formData)
        } catch (e) {
            console.error('(image) Error Uploading Image:', e)
        }
    }
}