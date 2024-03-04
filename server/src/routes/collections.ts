import { PrismaClient, collections } from '@prisma/client';
import express from 'express';

export const prisma = new PrismaClient()
const router = express.Router();

//GET

router.get('/', async (req, res) => {
    try {
        const collections = await prisma.collections.findMany({
            where: { trash: false },
            orderBy: { title: 'asc' }
        })
        res.status(200).json(collections); //needs json
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})

//get with parameter to get the specific collection details
router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const collection = await prisma.collections.findUnique({
            where: { id }
        })
        res.status(200).json(collection); //needs json
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})

router.post('/', async (req, res) => {
    const data = req.body
    //should check the title if 1) it exists 2)it is safe
    try {
        await prisma.collections.create({ data })
        res.status(200).send("OK");
        console.log("[Collections] Inserted:", data.title)
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})

// DELETE
router.delete('/', async (req, res) => {
    const { body }: { body: string[] /* collections.id[] */ } = req.body;

    try {
        await prisma.collections.deleteMany({
            where: {
                id: { in: body }
            }
        })
        console.log('[Collections] Deleted:', body)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})


//patch
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    try {
        await prisma.collections.update({
            where: { id: id },
            data: changes
        })
        console.log('[Collections] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})


// # with rules
// ## get collections with a boolean (such as trash or fav)
router.get('/rule/and', async (req, res) => {
    const rules = req.query;
    const query = Object.entries(rules).map(([key, value]) => ({ [key]: value === 'true' ? true : false }));

    try {
        const collections = await prisma.collections.findMany({
            where: { AND: query }
        })
        res.status(200).json(collections);
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})
// ## get collections with a boolean (such as trash or fav)
router.get('/rule/or', async (req, res) => {
    const rules = req.query;
    const query = Object.entries(rules).map(([key, value]) => ({ [key]: value === 'true' ? true : false }));

    try {
        const collections = await prisma.collections.findMany({
            where: { OR: query }
        })
        res.status(200).json(collections);
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})


// ## PATCH, change the values for group of collection
router.patch('/rule/group', async (req, res) => {
    const data = req.body; //the json only contain what changed therfore it represents 'changes'
    const { id, ...restData }: { id: string[], changes: collections } = data
    const collectionIDs: { id: string }[] = id.map(idvalue => ({ id: idvalue }))

    try {
        await prisma.collections.updateMany({
            data: restData,
            where: { OR: collectionIDs }
        })
        console.log('[Collections] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[Collections]", e)
        res.status(500).send('error')
    }
})


export default router;