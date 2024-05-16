import fs from "fs";
import path from "path";

export default async function deleteFile(...paths: string[]) {
    if (!paths) return;
    try {
        const filePath = path.join(...paths);
        await fs.promises.unlink(filePath);
    } catch (e) {
        console.log(`[Error] Couldn't Delete File ${paths.join('/')} :`, e);
    }
}
