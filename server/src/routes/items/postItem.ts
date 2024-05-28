import { prisma } from '@/src/index';
import { itemClientData } from '@/src/types/items';
import { itemCoverCacheConfigs, itemPosterCacheConfigs } from '@/src/utils/cacheConfigs';
import { formidableAllowImagesAndDummyBlobs } from '@/src/utils/formidableOptions';
import handleFileSaving from '@/src/utils/handlers/handleFileSaving';
import { handleLogosFieldsSaving } from '@/src/utils/handlers/handleLogosFieldsSaving';
import userMediaRoot from '@/src/utils/userMediaRoot';
import { items, items_tags } from '@prisma/client';
import { Request, Response } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import { validate as uuidValidate } from 'uuid';

export default async function postItemRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { list_id } = req.params;
    if (!uuidValidate(list_id)) return res.status(401).json({ message: `Bad List ID, List doesn't exist` })

    try {
        const list = await prisma.lists.findUnique({ where: { id: list_id, user_id } })
        if (!list) return res.status(401).json({ message: `Bad List ID, List doesn't exist` })

        const form = formidable({ filter: formidableAllowImagesAndDummyBlobs });
        const [fields, files] = await form.parse(req);
        if (!fields || !fields?.title?.[0]) return res.status(400).json({ message: 'Bad Request' })

        let itemData = {} as itemClientData

        itemData.fav = false
        itemData.trash = false

        itemData.id = crypto.randomUUID()
        itemData.title = fields.title[0]
        itemData.description = fields.description?.[0] ?? '';

        itemData.progress_state = JSON.parse(fields.progress_state?.[0] ?? '{}')
        itemData.configurations = JSON.parse(fields?.configurations?.[0] ?? '{}')
        itemData.related = JSON.parse(fields?.related?.[0] ?? '[]')

        //fields
        itemData.main_fields = JSON.parse(fields?.main_fields?.[0] ?? '[]')
        itemData.extra_fields = JSON.parse(fields?.extra_fields?.[0] ?? '[]')
        itemData.content_fields = JSON.parse(fields?.content_fields?.[0] ?? '[]')

        // images uploading
        // to create folder for the item
        const itemMediaRoot = userMediaRoot(user_id, list.id, itemData.id);
        await fs.promises.mkdir(itemMediaRoot);

        itemData.cover_path = await handleFileSaving(
            files?.cover_path?.[0],
            itemMediaRoot,
            itemCoverCacheConfigs
        )
        itemData.poster_path = await handleFileSaving(
            files?.poster_path?.[0],
            itemMediaRoot,
            itemPosterCacheConfigs
        )

        // logos fields (fields with images)
        const badges = JSON.parse(fields?.badges?.[0] ?? '[]') as itemClientData['badges']
        const links = JSON.parse(fields?.links?.[0] ?? '[]') as itemClientData['links']

        itemData.badges = await handleLogosFieldsSaving(badges, files.badges, itemMediaRoot)
        itemData.links = await handleLogosFieldsSaving(links, files.links, itemMediaRoot)

        // handling tags
        const tagsData = JSON.parse(fields?.tags[0]) as items_tags['id'][]

        let unexistingTags = []

        itemData.tags = tagsData.map((tagID) => {
            if (uuidValidate(tagID)) return tagID
            //if tag isn't a uuid then it is a new tag's name
            const id = crypto.randomUUID()
            const name = String(tagID).trim()
            unexistingTags.push({ id, name, list_id: list.id, user_id })
            return id
        })

        if (unexistingTags.length > 0) await prisma.items_tags.createMany({ data: unexistingTags })

        const item = await prisma.items.create({ data: { ...itemData as items & itemClientData, user_id, list_id: list.id } })
        console.log("[Items] Inserted:", item.title)
        res.status(200).json(item);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}