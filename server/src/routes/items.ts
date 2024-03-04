import { PrismaClient, collections, items } from '@prisma/client';
import express from 'express';

export const prisma = new PrismaClient()
const router = express.Router();

/* when you add a propertiy, make sure to add it in the Post thre values */
// # POST

router.post('/:collection_id', async (req, res) => {
    try {
        //should check the title if 1) it exists 2)it is safe
        const { collection_id } = req.params;
        const data = req.body;

        await prisma.items.create({
            data: { collection_id, ...data }
        })

        console.log("[Items] Inserted:", data.title)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error item')
    }
})

// # GET
//get items of  a collection
router.get('/:collection_id', async (req, res) => {
    const { collection_id } = req.params
    try {
        const items = await prisma.items.findMany({
            where: { collection_id: collection_id, trash: false },
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
    try {
        const { id } = req.params // = /{c}
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
            where: {
                id: { in: body }
            }
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
        await prisma.items.update({
            where: { id: id },
            data: changes
        })
        console.log('[Items] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

// # get items with a boolean (such as trash or fav) using AND
router.get('/rule/and', async (req, res) => {
    const rules = req.query;
    const query = Object.entries(rules).map(([key, value]) => ({ [key]: value === 'true' ? true : false }));

    // and?x=y&y=z 

    try {
        const items = await await prisma.items.findMany({
            where: { AND: query },
            orderBy: { title: 'asc' }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

// # get items with a boolean (such as trash or fav) using OR
router.get('/rule/or', async (req, res) => {
    const rules = req.query;
    const query = Object.entries(rules).map(([key, value]) => ({ [key]: value === 'true' ? true : false }));

    // and?x=y&y=z 

    try {
        const items = await await prisma.items.findMany({
            where: { OR: query },
            orderBy: { title: 'asc' }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})

// ## PATCH, change the values for group of items
router.patch('/rule/group', async (req, res) => {
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
router.get('/rule/group', async (req, res) => {
    const { id }: { id: string[] /* item.id[] **/ } = req.body
    const itemsIDs: { id: string }[] = id.map(idvalue => ({ id: idvalue }))

    try {
        const items = await prisma.items.findMany({
            where: { OR: itemsIDs }
        })
        res.status(200).json(items);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).send('error')
    }
})








export default router;
