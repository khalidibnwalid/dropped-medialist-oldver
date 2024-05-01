import { Part } from "formidable";

export const formidableAllowImages = ({ mimetype }: Part) => {
    return mimetype && mimetype.includes("image") //very basic, better than nothing
}
export const formidableAllowDummyBlobs = ({ mimetype, originalFilename }: Part) => {
    return mimetype === 'text/plain' && originalFilename === 'blob'
}

export const formidableAllowImagesAndDummyBlobs = (file: Part) =>
    formidableAllowDummyBlobs(file) || formidableAllowImages(file)

