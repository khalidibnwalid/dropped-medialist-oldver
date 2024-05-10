import { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import handleFileSaving from './handleFileSaving';
import { isDummyBlob } from './isDummyBlob';

export default async function handleFileEditing(
    file: File /**files.file[0]*/,
    userMediaRoot: string,
    originalPath?: string,
    isTesting?: boolean
) {
    if (!file) return null

    const isPreserveImageBlob = isDummyBlob(file, 5)
    const isDeleteImageBlob = isDummyBlob(file, 4)

    if (isPreserveImageBlob) return originalPath
    if (isDeleteImageBlob) {
        // if it doesn't have a logo, it shouldn't delete an unexisting file
        if (originalPath && !isTesting) {
            try {
                const filePath = path.join(userMediaRoot, originalPath)
                await fs.promises.unlink(filePath)
            } catch (e) {
                console.log('[Error] deleting file: ', e)
            }
        }
        return null
    }

    return await handleFileSaving(file, userMediaRoot, isTesting)
} 