import { prisma } from '@/src/index';
import { items } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../../utils/helperFunction/objectBoolFilter';
import postItemRoute from './postItem';
import putItemRoute from './putItem';
import deleteItemsRoute from './deleteItem';

const itemsRouter = express.Router();

itemsRouter.post('/:list_id', postItemRoute)
itemsRouter.put('/:id', putItemRoute)
itemsRouter.delete('/', deleteItemsRoute)

// # GET
//get items of  a list
itemsRouter.get('/:list_id?', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { list_id } = req.params
    if (list_id && !uuidValidate(list_id)) return res.status(400).json({ message: `Bad Item ID, Item doesn't exist` })

    try {
        const rules = objectBoolFilter(req.query)
        const where = list_id ? { ...rules, user_id, list_id } : { ...rules, user_id } //not safe need more restrictions
        const items = await prisma.items.findMany({
            where,
            orderBy: { title: 'asc' }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// ## get a single item's data
itemsRouter.get('/id/:id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params
    if (!uuidValidate(id)) return res.status(400).json({ message: `Bad Item ID, Item doesn't exist` })

    try {
        const item = await prisma.items.findUnique({
            where: { id, user_id }
        })
        res.status(200).json(item);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// # Patch
itemsRouter.patch('/:id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params;
    if (!uuidValidate(id)) return res.status(400).json({ message: `Bad Item ID, Item doesn't exist` })

    try {
        const changes = req.body;
        const item = await prisma.items.update({
            where: { id, user_id },
            data: { ...changes, user_id, id }
        })
        console.log('[Items] Edited:', id)
        res.status(200).json(item);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// ## PATCH, change the values for group of items
itemsRouter.patch('/group/id', async (req, res) => {
    try {
        const user_id = res.locals?.user?.id
        if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

        const data = req.body; //not safe need more restrictions
        const { id, ...restData }: { id: items['id'][] | items['id'], changes: items } = data
        const itemsIDs = [].concat(id) as items['id'][];

        if (itemsIDs.some(id => !uuidValidate(id)) || itemsIDs.length === 0)
            return res.status(404).json({ message: "Bad Item ID, Item Doesn't exist" });

        await prisma.items.updateMany({
            data: { ...restData, user_id },
            where: { id: { in: itemsIDs }, user_id }
        })

        const items = await prisma.items.findMany({ where: { id: { in: itemsIDs }, user_id } })
        console.log('[Items] Edited:', itemsIDs)
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

//get items with certain id
itemsRouter.get('/group/or?', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    try {
        const id = req.query.id as items['id'] | items['id'][];
        const itemsIDs = [].concat(id);

        const items = await prisma.items.findMany({
            where: { id: { in: itemsIDs }, user_id }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default itemsRouter;
