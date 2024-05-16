import { prisma } from '@/src/index';
import deleteFile from '@/src/utils/handlers/deleteFileFn';
import userMediaRoot from '@/src/utils/userMediaRoot';
import { lists } from '@prisma/client';
import { Request, Response } from 'express';
import { validate as uuidValidate } from 'uuid';

/** Delete Multiple Lists by passing { body: lists['id'][] } */
export default async function deleteListsRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { body: listIDs }: { body: lists['id'][] } = req.body;
    if (listIDs?.length === 0 || !Array.isArray(listIDs)) return res.status(200).json({ IDs: [] })
    if (listIDs?.some(id => !uuidValidate(id))) res.status(404).json({ message: `Bad List ID, A List doesn't exist` })

    try {
        const listsToDelete = await prisma.lists.findMany({
            where: { id: { in: listIDs }, user_id },
        })

        // just delete the list's media folder to delete its media and items' media
        listsToDelete.forEach(async list => {  
            const listMediaFolder = userMediaRoot(user_id, list.id)
            await deleteFile(listMediaFolder)
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
