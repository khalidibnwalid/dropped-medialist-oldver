import fs from "fs";
import path from "path";
import { CacheConfig, cachedImageName } from "../cacheConfigs";

export async function deleteFile(...paths: string[]) {
    if (!paths) return;
    try {
        const filePath = path.join(...paths);
        await fs.promises.unlink(filePath);
    } catch (e) {
        console.log(`[Error] Couldn't Delete File ${paths.join('/')} :`, e);
    }
}

/** Will Delete Thumbnails if they exist */
export async function deleteFileWithCache(cacheConfigs?: CacheConfig[], ...paths: string[]) {
    if (!paths) return;
    try {
        await deleteFile(...paths) // delete the original file
        const folderPath = path.join(...paths.slice(0, -1))
        const fileName = paths[paths.length - 1];

        if (cacheConfigs) { // delete thumbnails if they exist
            const cacheFolder = path.join(folderPath, 'thumbnails');
            cacheConfigs.forEach(async config => {
                const imageName = cachedImageName(fileName, config);
                await deleteFile(cacheFolder, imageName);
            })
        }

    } catch (e) {
        console.log(`[Error] Couldn't Delete File ${paths.join('/')} & its thumbnails :`, e);
    }
}
