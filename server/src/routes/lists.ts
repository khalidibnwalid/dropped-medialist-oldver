import { PrismaClient, lists } from '@prisma/client';
import express from 'express';

export const prisma = new PrismaClient()
const router = express.Router();

//GET

router.get('/', async (req, res) => {
    try {
        const lists = await prisma.lists.findMany({
            where: { trash: false },
            orderBy: { title: 'asc' }
        })
        res.status(200).json(lists); //needs json
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})

//get with parameter to get the specific list details
router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const list = await prisma.lists.findUnique({
            where: { id }
        })
        res.status(200).json(list); //needs json
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})

router.post('/', async (req, res) => {
    const data = req.body
    //should check the title if 1) it exists 2)it is safe
    try {
        await prisma.lists.create({ data })
        res.status(200).send("OK");
        console.log("[lists] Inserted:", data.title)
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})

// DELETE
router.delete('/', async (req, res) => {
    const { body }: { body: string[] /* lists.id[] */ } = req.body;

    try {
        await prisma.lists.deleteMany({
            where: {
                id: { in: body }
            }
        })
        console.log('[lists] Deleted:', body)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})


//patch
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    try {
        await prisma.lists.update({
            where: { id: id },
            data: changes
        })
        console.log('[lists] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})


// # with rules
// ## get lists with a boolean (such as trash or fav)
router.get('/rule/and', async (req, res) => {
    const rules = req.query;
    const query = Object.entries(rules).map(([key, value]) => ({ [key]: value === 'true' ? true : false }));

    try {
        const lists = await prisma.lists.findMany({
            where: { AND: query }
        })
        res.status(200).json(lists);
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})
// ## get lists with a boolean (such as trash or fav)
router.get('/rule/or', async (req, res) => {
    const rules = req.query;
    const query = Object.entries(rules).map(([key, value]) => ({ [key]: value === 'true' ? true : false }));

    try {
        const lists = await prisma.lists.findMany({
            where: { OR: query }
        })
        res.status(200).json(lists);
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})


// ## PATCH, change the values for group of list
router.patch('/rule/group', async (req, res) => {
    const data = req.body; //the json only contain what changed therfore it represents 'changes'
    const { id, ...restData }: { id: string[], changes: lists } = data
    const listIDs: { id: string }[] = id.map(idvalue => ({ id: idvalue }))

    try {
        await prisma.lists.updateMany({
            data: restData,
            where: { OR: listIDs }
        })
        console.log('[lists] Edited:', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).send('error')
    }
})


export default router;