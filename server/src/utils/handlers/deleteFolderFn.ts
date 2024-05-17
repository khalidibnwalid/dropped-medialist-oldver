import fs from "fs";
import path from "path";

export default async function deleteFolder(...paths: string[]) {
    if (!paths) return;
    try {
        const filePath = path.join(...paths);
        await fs.promises.rm(filePath, { recursive: true, force: true });
    } catch (e) {
        console.log(`[Error] Couldn't Delete Folder ${paths.join('/')} :`, e);
    }
}
