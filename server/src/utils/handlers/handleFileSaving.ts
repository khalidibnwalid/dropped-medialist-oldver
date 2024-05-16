import { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { generateRandomString, alphabet } from "oslo/crypto";

export default async function handleFileSaving(
    file: File | undefined /**files.file[0]*/,
    distPath: string,
    /** prefix_filename.extension */
    prefix?: string,
    isTesting?: boolean
) {
    if (!file) return null
    const fileExtension = path.extname(file.originalFilename);
    const generatedName = generateRandomString(15, alphabet("a-z", "A-Z", "0-9"));

    const fileName = prefix
        ? prefix + '_' + generatedName + fileExtension
        : generatedName + fileExtension
    const oldPath = file.filepath;
    const newPath = path.join(distPath, fileName)

    if (isTesting) return fileName

    try {
        // Copy the file to newPath's location
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

    return fileName;
} 