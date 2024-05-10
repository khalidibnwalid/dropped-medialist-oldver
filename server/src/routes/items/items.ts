import { prisma } from '@/src/index';
import { items } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../../utils/helper-function/objectBoolFilter';
import postItemRoute from './postItem';
import putItemRoute from './putItem';

const itemsRouter = express.Router();

itemsRouter.post('/:list_id', postItemRoute)
itemsRouter.put('/:id', putItemRoute)

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

// # DELETE
itemsRouter.delete('/', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { body }: { body: items['id'][] } = req.body;  //not safe need more restrictions
    // should remove the deleted items from other items' related column varchar[]
    try {
        await prisma.items.deleteMany({
            where: { id: { in: body }, user_id }
        })
        console.log('[Items] Deleted:', body)
        res.status(200).json({ message: 'Items Deleted' });
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
            data: changes
        })
        console.log('[Items] Edited:', id)
        res.status(200).json(item);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// ## PATCH, change the values for group of items
itemsRouter.patch('/group', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const data = req.body; //not safe need more restrictions
    const { id, ...restData }: { id: items['id'][], changes: items } = data
    const itemsIDs: { id: items['id'] }[] = id.map(idvalue => ({ id: idvalue }))

    try {
        await prisma.items.updateMany({
            data: restData,
            where: { OR: itemsIDs, user_id }
        })
        console.log('[Items] Edited:', id)
        res.status(200).json({ message: 'Items Edited' });
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
