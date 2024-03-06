import { PrismaClient, lists } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../utils/helper-function/objectBoolFilter';


export const prisma = new PrismaClient()
const router = express.Router();

//get
router.get('/:id?', async (req, res) => {
    const { id } = req.params
    const rules = objectBoolFilter(req.query)

    try {
        if (id && !uuidValidate(id)) throw new Error("Bad ID")
        let list = null
        if (id) {
            list = await prisma.lists.findUnique({ where: { id, ...rules } })
        } else {
            list = await prisma.lists.findMany({ where: rules, orderBy: { title: 'asc' } })
        }
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
            where:
                { id: { in: body } }
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
        if (!uuidValidate(id)) throw new Error("Bad ID")
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


// ## PATCH, change the values for group of list
router.patch('/group', async (req, res) => {
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