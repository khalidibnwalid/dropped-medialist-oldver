import { PrismaClient, items_tags } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient()
const tagsRouter = express.Router();

// # GET
//get all tags of a list
tagsRouter.get('/:list_id', async (req, res) => {
    const user_id = res.locals.user.id

    try {
        const { list_id } = req.params
        const tags = await prisma.items_tags.findMany({
            where: { list_id, user_id },
            orderBy: { name: 'asc' }
        })
        res.status(200).json(tags);
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'error' })
    }
})

// # POST
tagsRouter.post('/:list_id', async (req, res) => {
    const { list_id } = req.params;
    const { body }: { body: Pick<items_tags, 'id' | 'description' | 'group_name' | 'name'>[] } = req.body;
    const user_id = res.locals.user.id
    const toPostTags = body.map(tag => ({ list_id, user_id, ...tag }))


    try {
        await prisma.items_tags.createMany({
            data: toPostTags
        })
        console.log('[Tags] Inserted New Tags')
        res.status(200).json({ message: 'Tags Added' });
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'error' })
    }
})

// # DELETE
tagsRouter.delete('/', async (req, res) => {
    const { body }: { body: string[] } = req.body; //id[]
    const user_id = res.locals.user.id

    // should remove the deleted tags from tags column varchar[] in items table 

    try {
        await prisma.items_tags.deleteMany({
            where: {
                user_id,
                id: { in: body }
            }
        })
        console.log('[Tags] Deleted:', body)

        res.status(200).json({ message: 'Tags Deleted' });
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'error' })
    }
})


// # Patch
tagsRouter.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body; //the json only contain what changed therfore it represents 'changes'
    const user_id = res.locals.user.id

    try {
        await prisma.items_tags.update({
            where: { id, user_id },
            data: changes
        })
        console.log('[Tags] Edited:', id)
        res.status(200).json({ message: 'Tag Edited' });
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'error' })
    }
})

export default tagsRouter;
