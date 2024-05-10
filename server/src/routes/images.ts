import { prisma } from '@/src/index';
import { formidableAllowImages } from '@/src/utils/formidableOptions';
import { items_images } from '@prisma/client';
import express from 'express';
import formidable from 'formidable';
import { validate as uuidValidate } from 'uuid';
import handleFileSaving from '../utils/handlers/handleFileSaving';
import userMediaFoldersPath from '../utils/userMediaFoldersPath';
import path from 'path';
import fs from 'fs';

const imagesRouter = express.Router();

// # POST
imagesRouter.post('/:item_id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { item_id } = req.params
    if (!uuidValidate(item_id)) return res.status(404).json({ message: `Bad Item ID, Item doesn't exist` })

    try {
        const item = await prisma.items.findUnique({ where: { id: item_id, user_id } })
        if (!item) return res.status(404).json({ message: `Bad Item ID, Item doesn't exist` })

        const form = formidable({ filter: formidableAllowImages });
        const [fields, files] = await form.parse(req);
        console.log(files.image_path[0])

        if (!files?.image_path?.[0]) return res.status(400).json({ message: 'Bad Request: No Image Provided' })

        const userMediaRoot = userMediaFoldersPath(user_id);
        let data = {} as items_images;

        data.image_path = await handleFileSaving(files.image_path[0], userMediaRoot.items);
        data.user_id = user_id
        data.item_id = item.id
        data.title = fields?.title?.[0] ?? null
        data.description = fields?.description?.[0] ?? null

        const image = await prisma.items_images.create({ data })
        console.log('[Images] Inserted New Images')
        res.status(200).json(image);
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # GET
//get all images of an item
imagesRouter.get('/:item_id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { item_id } = req.params
    if (!uuidValidate(item_id)) return res.status(404).json({ message: `Bad Item ID, Item doesn't exist` })

    try {
        const item = await prisma.items.findUnique({ where: { id: item_id, user_id } })
        if (!item) return res.status(404).json({ message: `Bad Item ID, Item doesn't exist` })

        const images = await prisma.items_images.findMany({ where: { item_id: item.id, user_id } })
        res.status(200).json(images);
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # DELETE
imagesRouter.delete('/:id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params
    if (!uuidValidate(id)) return res.status(404).json({ message: `Bad Image ID, Image doesn't exist` })

    //need auth check
    try {
        const image = await prisma.items_images.findUnique({ where: { id, user_id } })
        if (!image) return res.status(404).json({ message: `Bad Image ID, Image doesn't exist` })

        const userMediaRoot = userMediaFoldersPath(user_id);
        
        const filePath = path.join(userMediaRoot.items, image.image_path)
        await fs.promises.unlink(filePath)

        await prisma.items_images.delete({
            where: { id, user_id }
        })
        console.log('[Images] Deleted:', id)
        res.status(200).json(image);
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # Patch
imagesRouter.patch('/:id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params;
    if (!uuidValidate(id)) return res.status(404).json({ message: `Bad Image ID, Image doesn't exist` })

    try {
        //the json only contain what changed therfore it represents 'changes'
        const changes = req.body;

        const image = await prisma.items_images.update({
            where: { id, user_id },
            data: { ...changes, user_id }
        })
        console.log('[Images] Edited:', id)
        res.status(200).json(image);
    } catch (e) {
        console.log("[Images]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default imagesRouter;
