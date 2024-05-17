import { prisma } from '@/src/index';
import deleteFolder from '@/src/utils/handlers/deleteFolderFn';
import userMediaRoot from '@/src/utils/userMediaRoot';
import { lists } from '@prisma/client';
import { Request, Response } from 'express';
import { validate as uuidValidate } from 'uuid';

/** Delete Multiple Lists by passing { body: lists['id'][] } */
export default async function deleteListsRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { body: IDs }: { body: lists['id'][] | lists['id'] } = req.body;

    if (typeof IDs === 'boolean' || (Array.isArray(IDs) && IDs.length === 0))
        return res.status(400).json({ message: "Bad Request" });

    const listIDs = typeof IDs === 'string' ? [IDs] : IDs;

    if (listIDs.some(id => !uuidValidate(id)))
        return res.status(404).json({ message: "Bad List ID, List Doesn't exist" });

    try {
        const listsToDelete = await prisma.lists.findMany({
            where: { id: { in: listIDs }, user_id },
        })

        // just delete the list's media folder to delete its media and items' media
        listsToDelete.forEach(async list => {
            const listMediaFolder = userMediaRoot(user_id, list.id)
            await deleteFolder(listMediaFolder)
        })

        await prisma.lists.deleteMany({
            where: { id: { in: listIDs }, user_id }
        })

        console.log('[lists] Deleted:', listIDs)
        res.status(200).json({ IDs: listIDs });
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}
