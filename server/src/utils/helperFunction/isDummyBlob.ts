import { File } from "formidable";

export const isDummyBlob = (blob: File, size: number = 5) => {
    if (!blob) return false;
    return (blob.size === size && blob.mimetype === 'text/plain' && blob.originalFilename === 'blob');
}
