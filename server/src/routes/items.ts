import { PrismaClient, items } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../utils/helper-function/objectBoolFilter';

const prisma = new PrismaClient()
const itemsRouter = express.Router();

// # POST

itemsRouter.post('/:list_id', async (req, res) => {
    const { list_id } = req.params;
    const user_id = res.locals?.user?.id

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    try {
        if (!uuidValidate(list_id)) throw new Error("Bad ID")
        const data = req.body;

        await prisma.items.create({
            data: { ...data, user_id, list_id }
        })

        console.log("[Items] Inserted:", data.title)
        res.status(200).json({ message: 'Item Added' });
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'error' })
    }
})

// # GET
//get items of  a list
itemsRouter.get('/:list_id?', async (req, res) => {
    const rules = objectBoolFilter(req.query)
    const { list_id } = req.params
    const user_id = res.locals?.user?.id

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })
    const where = list_id ? { ...rules, user_id, list_id } : { ...rules, user_id }

    try {
        if (list_id && !uuidValidate(list_id)) throw new Error("Bad ID")
        const items = await prisma.items.findMany({
            where,
            orderBy: { title: 'asc' }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'error' })
    }
})

// ## get a single item's data
itemsRouter.get('/id/:id', async (req, res) => {
    const { id } = req.params
    const user_id = res.locals?.user?.id

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    try {
        if (!uuidValidate(id)) throw new Error("Bad ID")
        const item = await prisma.items.findUnique({
            where: { id, user_id }
        })
        res.status(200).json(item);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'error' })
    }
})

// # DELETE
itemsRouter.delete('/', async (req, res) => {
    const { body }: { body: string[] /* items.id[] */ } = req.body;
    const user_id = res.locals?.user?.id

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    // should remove the deleted items from other items' related column varchar[]
    try {
        await prisma.items.deleteMany({
            where: { id: { in: body }, user_id }
        })
        console.log('[Items] Deleted:', body)
        res.status(200).json({ message: 'Items Deleted' });
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'error' })
    }
})

// # Patch
itemsRouter.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    const user_id = res.locals?.user?.id

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    try {
        if (!uuidValidate(id)) throw new Error("Bad ID")
        await prisma.items.update({
            where: { id, user_id },
            data: changes
        })
        console.log('[Items] Edited:', id)
        res.status(200).json({ message: 'Item Edited' });
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'error' })
    }
})

// ## PATCH, change the values for group of items
itemsRouter.patch('/group', async (req, res) => {
    const data = req.body; //the json only contain what changed therfore it represents 'changes'
    const { id, ...restData }: { id: string[], changes: items } = data
    const itemsIDs: { id: string }[] = id.map(idvalue => ({ id: idvalue }))
    const user_id = res.locals?.user?.id

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    try {
        await prisma.items.updateMany({
            data: restData,
            where: { user_id, OR: itemsIDs }
        })
        console.log('[Items] Edited:', id)
        res.status(200).json({ message: 'Items Edited' });
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'error' })
    }
})

//get items with certain id
itemsRouter.get('/group/or?', async (req, res) => {
    const id = req.query.id as string | string[];
    const itemsIDs: string[] = Array.isArray(id) ? id : [id];
    const user_id = res.locals?.user?.id

    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    try {
        const items = await prisma.items.findMany({
            where: { user_id, id: { in: itemsIDs } }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'error' })
    }
})

export default itemsRouter;
