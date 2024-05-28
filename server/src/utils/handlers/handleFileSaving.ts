import { File } from 'formidable';
import fs from 'fs';
import { alphabet, generateRandomString } from "oslo/crypto";
import path from 'path';
import { webpTransformer } from '../webpTransformer';
import { CacheConfig } from '../cacheConfigs';
import { cachedImageName } from '../cacheConfigs';
import { isDummyBlob } from '../helperFunction/isDummyBlob';

export default async function handleFileSaving(
    file: File | undefined /**files.file[0]*/,
    distPath: string,
    /** prefix_filename.extension */
    cacheConfigs?: CacheConfig[],
    prefix?: string,
    isTesting?: boolean
) {
    if (!file) return null
    const isDeleteImageBlob = isDummyBlob(file, 4)
    if (isDeleteImageBlob) return null

    const fileExtension = path.extname(file.originalFilename);
    const generatedName = generateRandomString(15, alphabet("a-z", "A-Z", "0-9"));

    const fileName = prefix
        ? prefix + '_' + generatedName + fileExtension
        : generatedName + fileExtension
    const oldPath = file.filepath;
    const newPath = path.join(distPath, fileName)

    if (isTesting) return fileName

    try {
        // Copy the file to newPath's location (for docker)
        await fs.promises.copyFile(oldPath, newPath);

        // Delete the original temp file
        await fs.promises.unlink(oldPath);
    } catch (e) {
        console.log("Error handling the file", e);

        // Delete the new file, if it was created
        try {
            await fs.promises.unlink(newPath);
        } catch (unlinkErr) {
            console.log('Error deleting the new file:', unlinkErr.message);
        }

        throw e;
    }

    if (cacheConfigs) {
        try {
            const cacheFolder = path.join(distPath, 'thumbnails');
            if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

            cacheConfigs.forEach(async config => {
                const imageName = cachedImageName(fileName, config);
                const imagePath = path.join(cacheFolder, imageName);

                await webpTransformer(config?.w, config?.h, newPath).toFile(imagePath);
            })

        } catch (error) {
            console.error('Failed to create cache images', error);
        }
    }

    return fileName;
} 