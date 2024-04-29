import { PrismaClient, items_images } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient()
const router = express.Router();

//need auth check

// # POST
router.post('/:item_id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { item_id } = req.params;
    const { body }: { body: Pick<items_images, 'date_created' | 'id' | 'title' | 'description' | 'image_path'>[] } = req.body
    const toPostImages = body.map(image => ({ item_id: item_id, ...image }))

    try {
        const image = await prisma.items_images.createMany({
            data: toPostImages
        })
        console.log('[Images] Inserted New Images')
        res.status(200).json(image);
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # GET
//get images of an item
router.get('/:item_id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { item_id } = req.params
    try {
        const images = await prisma.items_images.findMany({ where: { item_id } })
        res.status(200).json(images);
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # DELETE
router.delete('/', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { body }: { body: string[] } = req.body; //images.id[]

    try {
        await prisma.items_images.deleteMany({
            where: { id: { in: body } }
        })
        console.log('[Images] Deleted:', body)
        res.status(200).json({ message: 'Images Deleted' });
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


// # Patch
router.patch('/:id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params;
    const data = req.body; //the json only contain what changed therfore it represents 'changes'

    try {
        const image = await prisma.items_images.update({
            where: { id },
            data
        })
        console.log('[Images] Edited:', id)
        res.status(200).json(image);
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default router;
