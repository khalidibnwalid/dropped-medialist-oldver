import { prisma } from '@/src/index';
import { items_tags } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';

const tagsRouter = express.Router();

// # GET
//get all tags of a list
tagsRouter.get('/:list_id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { list_id } = req.params
    if (!uuidValidate(list_id)) return res.status(400).json({ message: 'Bad List ID' })

    try {
        const tags = await prisma.items_tags.findMany({
            where: { list_id, user_id },
            orderBy: { name: 'asc' }
        })
        res.status(200).json(tags);
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # POST
tagsRouter.post('/:list_id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { list_id } = req.params;
    if (!uuidValidate(list_id)) return res.status(400).json({ message: 'Bad List ID' })

    try {
        const list = await prisma.lists.findUnique({ where: { id: list_id, user_id } })
        if (!list) return res.status(401).json({ message: `Bad List ID, List doesn't exist` })

        const { body }: { body: Omit<items_tags, 'user_id' | 'list_id'>[] } = req.body;

        const toPostTags = body.map(tag => ({ ...tag, list_id, user_id }))
        const tagNames = toPostTags.map(tag => tag.name)

        await prisma.items_tags.createMany({
            data: toPostTags,
        })

        const tags = await prisma.items_tags.findMany({ where: { name: { in: tagNames } } })
        res.status(200).json(tags);
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # DELETE
tagsRouter.delete('/', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    // should remove the deleted tags from tags column varchar[] in items table 
    try {
        const { body }: { body: items_tags['id'][] } = req.body;
        await prisma.items_tags.deleteMany({
            where: { id: { in: body }, user_id }
        })
        console.log('[Tags] Deleted:', body)
        res.status(200).json(body);
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


// # Patch
tagsRouter.patch('/:id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params;
    const changes = req.body; //the json only contain what changed therfore it represents 'changes'

    try {
        const tag = await prisma.items_tags.update({
            where: { id, user_id },
            data: changes
        })
        console.log('[Tags] Edited:', id)
        res.status(200).json(tag);
    } catch (e) {
        console.log("[Tags]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default tagsRouter;
