import { PrismaClient, lists } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../utils/helper-function/objectBoolFilter';


const prisma = new PrismaClient()
const listsRouter = express.Router();

//get
listsRouter.get('/:id?', async (req, res) => {
    const { id } = req.params
    const rules = objectBoolFilter(req.query)
    const user_id = res.locals.user.id

    try {
        if (id && !uuidValidate(id)) throw new Error("Bad ID")
        let list = null
        if (id) {
            list = await prisma.lists.findUnique({ where: { ...rules, id, user_id } })
        } else {
            list = await prisma.lists.findMany({ where: { ...rules, user_id }, orderBy: { title: 'asc' } })
        }
        res.status(200).json(list); //needs json
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'error' })
    }
})

listsRouter.post('/', async (req, res) => {
    const data = req.body
    //should check the title if 1) it exists 2)it is safe
    try {
        await prisma.lists.create({ data })
        res.status(200).json({ message: 'List Added' });
        console.log("[lists] Inserted:", data.title)
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'error' })
    }
})

// DELETE
listsRouter.delete('/', async (req, res) => {
    const { body }: { body: string[] /* lists.id[] */ } = req.body;
    const user_id = res.locals.user.id

    try {
        await prisma.lists.deleteMany({
            where:
                { user_id, id: { in: body } }
        })
        console.log('[lists] Deleted:', body)
        res.status(200).json({ message: 'Lists Deleted' });
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'error' })
    }
})


//patch
listsRouter.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    const user_id = res.locals.user.id

    try {
        if (!uuidValidate(id)) throw new Error("Bad ID")
        await prisma.lists.update({
            where: { user_id, id: id },
            data: changes
        })
        console.log('[lists] Edited:', id)
        res.status(200).json({ message: 'List Edited' });
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'error' })
    }
})


// ## PATCH, change the values for group of list
listsRouter.patch('/group', async (req, res) => {
    const data = req.body; //the json only contain what changed therfore it represents 'changes'
    const { id, ...restData }: { id: string[], changes: lists } = data
    const listIDs: { id: string }[] = id.map(idvalue => ({ id: idvalue }))
    const user_id = res.locals.user.id

    try {
        await prisma.lists.updateMany({
            data: restData,
            where: { user_id, OR: listIDs }
        })
        console.log('[lists] Edited:', id)
        res.status(200).json({ message: 'Lists Edited' });
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'error' })
    }
})


export default listsRouter;