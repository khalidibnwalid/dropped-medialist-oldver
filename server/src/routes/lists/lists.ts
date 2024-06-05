import { prisma } from '@/src/index';
import { lists } from '@prisma/client';
import express from 'express';
import { validate as uuidValidate } from 'uuid';
import objectBoolFilter from '../../utils/helperFunction/objectBoolFilter';
import putListRoute from './putList';
import postListRoute from './postList';
import deleteListsRoute from './deleteList';

export const listsRouter = express.Router();

listsRouter.post('/', postListRoute);
listsRouter.put('/:id', putListRoute)
listsRouter.delete('/', deleteListsRoute)

//get
listsRouter.get('/:id?', async (req, res) => {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params
    if (id && !uuidValidate(id)) return res.status(400).json({ message: 'Bad ID' })

    try {
        const rules = objectBoolFilter(req.query)

        const list = id
            ? await prisma.lists.findUnique({ where: { ...rules, id, user_id } })
            : await prisma.lists.findMany({ where: { ...rules, user_id }, orderBy: { title: 'asc' } })

        res.status(200).json(list); //needs json
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
    if (!uuidValidate(id)) return res.status(400).json({ message: 'Bad ID' })

    try {
        const data = req.body;

        const list = await prisma.lists.update({
            where: { id, user_id },
            data: { ...data, id, user_id }
        })

        console.log('[lists] Edited:', id)
        res.status(200).json(list);
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})


// ## PATCH, change the values for group of list
listsRouter.patch('/group/id', async (req, res) => {
    try {
        const user_id = res.locals?.user?.id
        if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

        const data = req.body; //the json only contain what changed therfore it represents 'changes'
        const { id, ...restData }: { id: lists['id'][] | lists['id'], changes: lists } = data
        const listIDs = [].concat(id) as lists['id'][];

        if (listIDs.some(id => !uuidValidate(id)) || listIDs.length === 0)
            return res.status(404).json({ message: "Bad List ID, List Doesn't exist" });

        await prisma.lists.updateMany({
            data: { ...restData, user_id },
            where: { id: { in: listIDs }, user_id }
        })

        const lists = await prisma.lists.findMany({ where: { id: { in: listIDs }, user_id } })
        console.log('[lists] Edited:', listIDs)
        res.status(200).json(lists);
    } catch (e) {
        console.log("[lists]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

export default listsRouter;