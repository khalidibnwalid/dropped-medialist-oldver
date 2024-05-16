import { prisma } from '@/src/index';
import deleteFile from '@/src/utils/handlers/deleteFileFn';
import userMediaRoot from '@/src/utils/userMediaRoot';
import { items } from '@prisma/client';
import { Request, Response } from 'express';
import { validate as uuidValidate } from 'uuid';

/** Delete Multiple Items by passing { body: items['id'][] } */
export default async function deleteItemsRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { body: itemsIDs }: { body: items['id'][] } = req.body;
    if (itemsIDs?.length === 0 || !Array.isArray(itemsIDs)) return res.status(200).json({ IDs: [] })
    if (itemsIDs?.some(id => !uuidValidate(id))) res.status(404).json({ message: `Bad Item ID, Item doesn't exist` })

    try {
        const itemsToDelete = await prisma.items.findMany({
            where: { id: { in: itemsIDs }, user_id },
        })

        // just delete the item's media folder to delete its media
        itemsToDelete.forEach(async item => {
            const itemMediaFolder = userMediaRoot(user_id, item.list_id, item.id)
            await deleteFile(itemMediaFolder)
        })

        await prisma.items.deleteMany({
            where: { id: { in: itemsIDs }, user_id }
        })
        
        console.log('[Items] Deleted:', itemsIDs)
        res.status(200).json({ IDs: itemsIDs });
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}