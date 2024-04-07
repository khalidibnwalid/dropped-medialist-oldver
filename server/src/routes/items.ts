import { PrismaClient, items } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../utils/helper-function/objectBoolFilter';

const prisma = new PrismaClient()
const router = express.Router();

// # POST

router.post('/:list_id', async (req, res) => {
    const { list_id } = req.params;
    try {
        if (!uuidValidate(list_id)) throw new Error("Bad ID")
        const data = req.body;

        await prisma.items.create({
            data: { list_id, ...data }
        })

        console.log("[Items] Inserted:", data.title)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error item')
    }
})

// # GET
//get items of  a list
router.get('/:list_id?', async (req, res) => {
    const rules = objectBoolFilter(req.query)
    const { list_id } = req.params
    const where = list_id ? { list_id, ...rules } : rules

    try {
        if (list_id && !uuidValidate(list_id)) throw new Error("Bad ID")
        const items = await prisma.items.findMany({
            where,
            orderBy: { title: 'asc' }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

// ## get a single item's data
router.get('/id/:id', async (req, res) => {
    const { id } = req.params
    try {
        if (!uuidValidate(id)) throw new Error("Bad ID")
        const item = await prisma.items.findUnique({
            where: { id }
        })
        res.status(200).json(item);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

// # DELETE
router.delete('/', async (req, res) => {
    const { body }: { body: string[] /* items.id[] */ } = req.body;

    // should remove the deleted items from other items' related column varchar[]
    try {
        await prisma.items.deleteMany({
            where: { id: { in: body } }
        })
        console.log('[Items] Deleted:', body)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

// # Patch
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    try {
        if (!uuidValidate(id)) throw new Error("Bad ID")
        await prisma.items.update({
            where: { id },
            data: changes
        })
        console.log('[Items] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

// ## PATCH, change the values for group of items
router.patch('/group', async (req, res) => {
    const data = req.body; //the json only contain what changed therfore it represents 'changes'
    const { id, ...restData }: { id: string[], changes: items } = data
    const itemsIDs: { id: string }[] = id.map(idvalue => ({ id: idvalue }))

    try {
        await prisma.items.updateMany({
            data: restData,
            where: { OR: itemsIDs }
        })
        console.log('[Items] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

//get items with certain id
router.get('/group/or?', async (req, res) => {
    const id = req.query.id as string | string[];
    const itemsIDs: string[] = Array.isArray(id) ? id : [id];

    try {
        const items = await prisma.items.findMany({
            where: { id: { in: itemsIDs } }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

export default router;
