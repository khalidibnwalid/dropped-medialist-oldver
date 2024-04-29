import { PrismaClient, lists } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../utils/helper-function/objectBoolFilter';

const prisma = new PrismaClient()
const listsRouter = express.Router();

//get
listsRouter.get('/:id?', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })
        
    const { id } = req.params
    const rules = objectBoolFilter(req.query)

    try {
        if (id && !uuidValidate(id)) return res.status(400).json({ message: 'Bad ID' })
        let list = id
            ? await prisma.lists.findUnique({ where: { ...rules, id, user_id } })
            : await prisma.lists.findMany({ where: { ...rules, user_id }, orderBy: { title: 'asc' } })

        res.status(200).json(list); //needs json
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

listsRouter.post('/', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const data = req.body

    try {
        const list = await prisma.lists.create({ data: { ...data, user_id } })
        res.status(200).json(list);
        console.log("[lists] Inserted:", data.title)
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// DELETE
listsRouter.delete('/', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { body }: { body: string[] /* lists.id[] */ } = req.body;

    try {
        await prisma.lists.deleteMany({
            where:
                { user_id, id: { in: body } }
        })
        console.log('[lists] Deleted:', body)
        res.status(200).json({ message: 'Lists Deleted' });
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


//patch
listsRouter.patch('/:id', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params;
    const changes = req.body;

    try {
        if (!uuidValidate(id)) throw new Error("Bad ID")
        const list = await prisma.lists.update({
            where: { user_id, id: id },
            data: changes
        })

        console.log('[lists] Edited:', id)
        res.status(200).json(list);
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


// ## PATCH, change the values for group of list
listsRouter.patch('/group', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const data = req.body; //the json only contain what changed therfore it represents 'changes'
    const { id, ...restData }: { id: string[], changes: lists } = data
    const listIDs: { id: string }[] = id.map(idvalue => ({ id: idvalue }))

    try {
        await prisma.lists.updateMany({
            data: restData,
            where: { user_id, OR: listIDs }
        })
        console.log('[lists] Edited:', id)
        res.status(200).json({ message: 'Lists Edited' });
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


export default listsRouter;