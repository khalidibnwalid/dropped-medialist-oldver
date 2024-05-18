import { File } from 'formidable';
import deleteFile from './deleteFileFn';
import handleFileSaving from './handleFileSaving';
import { isDummyBlob } from '../helperFunction/isDummyBlob';

export default async function handleFileEditing(
    file: File | undefined /**files.file[0]*/,
    distPath: string,
    originalImagePath?: string,
    prefix?: string,
    isTesting?: boolean
) {
    const isPreserveImageBlob = isDummyBlob(file, 5)
    if (isPreserveImageBlob) return originalImagePath

    // isDeleteImageBlob still exist but is only used to preserve index order sync of formFields and formFiles

    //if the image is not preserved, then it is a new image or image deletion, in both cases, it should delete the original image
    // if it doesn't have an originalImage, it shouldn't delete an unexisting file
    if (originalImagePath && !isTesting) await deleteFile(distPath, originalImagePath)

    return await handleFileSaving(file, distPath, prefix, isTesting) // will return null if no file is provided
} 