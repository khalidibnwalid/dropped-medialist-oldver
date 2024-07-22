import { File } from 'formidable';
import { CacheConfig } from '../cacheConfigs';
import { isDummyBlob } from '../helperFunction/isDummyBlob';
import { deleteFileWithCache } from './deleteFileFn';
import handleFileSaving from './handleFileSaving';

export default async function handleFileEditing(
    file: File | undefined /**files.file[0]*/,
    distPath: string,
    originalImagePath?: string,
    cacheConfigs?: CacheConfig[],
    prefix?: string,
    isTesting?: boolean
) {
    const isPreserveImageBlob = isDummyBlob(file, 5)
    if (isPreserveImageBlob) return originalImagePath

    // isDeleteImageBlob still exist but is only used to preserve index order sync of formFields and formFiles

    //if the image is not preserved, then it is a new image or image deletion, in both cases, it should delete the original image
    // if it doesn't have an originalImage, it shouldn't delete an unexisting file
    if (originalImagePath && !isTesting)
        await deleteFileWithCache(cacheConfigs, distPath, originalImagePath)

    // handleFileSaving will return null if no file is provided
    return await handleFileSaving(file, distPath, cacheConfigs, prefix, isTesting)
} 