import { PrismaClient, items_tags } from '@prisma/client';
import express from 'express';

export const prisma = new PrismaClient()
const router = express.Router();


// # GET
//get all tags of a list
router.get('/:list_id', async (req, res) => {
    try {
        const { list_id } = req.params
        const tags = await prisma.items_tags.findMany({
            where: { list_id },
            orderBy: { name: 'asc' }
        })
        res.status(200).json(tags);
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).send('error')
    }
})

// # POST
router.post('/:list_id', async (req, res) => {
    const { list_id } = req.params;
    const { body }: { body: Pick<items_tags, 'id' | 'description' | 'group_name' | 'name'>[] } = req.body;
    const toPostTags = body.map(tag => ({ list_id: list_id, ...tag }))

    try {
        await prisma.items_tags.createMany({
            data: toPostTags
        })
        console.log('[Tags] Inserted New Tags')
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).send('error')
    }
})

// # DELETE
router.delete('/', async (req, res) => {
    const { body }: { body: string[] } = req.body; //id[]

    // should remove the deleted tags from tags column varchar[] in items table 

    try {
        await prisma.items_tags.deleteMany({
            where: {
                id: { in: body }
            }
        })
        console.log('[Tags] Deleted:', body)

        res.status(200).send('OK');
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).send('error')
    }
})


// # Patch
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body; //the json only contain what changed therfore it represents 'changes'

    try {
        await prisma.items_tags.update({
            where: { id },
            data: changes
        })
        console.log('[Tags] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).send('error')
    }
})

export default router;
