import { prisma } from '@/src/index';
import { itemClientData } from '@/src/types/items';
import { listClientData } from '@/src/types/lists';
import { formidableAllowImagesAndDummyBlobs } from '@/src/utils/formidableOptions';
import handleFileEditing from '@/src/utils/handlers/handleFileEditing';
import handleFileSaving from '@/src/utils/handlers/handleFileSaving';
import handleEditLogosFields from '@/src/utils/handlers/handleLogosFieldsEditing';
import { handleLogosFieldsSaving } from '@/src/utils/handlers/handleLogosFieldsSaving';
import userMediaFoldersPath from '@/src/utils/userMediaFoldersPath';
import { items, items_tags } from '@prisma/client';
import { Request, Response } from 'express';
import formidable from 'formidable';
import { validate as uuidValidate } from 'uuid';

export default async function putItemRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' })

    const { id } = req.params;
    if (!uuidValidate(id)) return res.status(401).json({ message: `Bad List ID, List doesn't exist` })

    try {
        const originalItem = await prisma.items.findUnique({ where: { id, user_id } }) as itemClientData & items
        if (!originalItem) return res.status(401).json({ message: `Bad List ID, List doesn't exist` })

        const list = await prisma.lists.findUnique({ where: { id: originalItem.list_id, user_id } }) as listClientData
        if (!list) return res.status(401).json({ message: `List doesn't exist` })

        const form = formidable({ filter: formidableAllowImagesAndDummyBlobs });
        const [fields, files] = await form.parse(req);
        if (!fields || !fields?.title?.[0]) return res.status(400).json({ message: 'Bad Request' })

        const userMediaRoot = userMediaFoldersPath(user_id);

        let itemData = {} as itemClientData

        itemData.fav = originalItem.fav
        itemData.trash = originalItem.trash

        itemData.title = fields.title[0]
        itemData.description = fields.description?.[0] ?? originalItem.description;

        itemData.progress_state = fields.progress_state?.[0]
            ? JSON.parse(fields.progress_state[0])
            : originalItem.progress_state
        itemData.configurations = JSON.parse(fields?.configurations?.[0] ?? '{}')
        itemData.related = JSON.parse(fields?.related?.[0] ?? '[]')

        //fields
        itemData.main_fields = JSON.parse(fields?.main_fields?.[0] ?? '[]')
        itemData.extra_fields = JSON.parse(fields?.extra_fields?.[0] ?? '[]')
        itemData.content_fields = JSON.parse(fields?.content_fields?.[0] ?? '[]')

        // images uploading
        itemData.cover_path = await handleFileEditing(
            files.cover_path?.[0],
            userMediaRoot.lists,
            originalItem?.cover_path,
            // true
        )

        itemData.poster_path = await handleFileEditing(
            files.poster_path?.[0],
            userMediaRoot.lists,
            originalItem?.poster_path,
            // true
        )

        // logos fields (fields with images)
        const badges = JSON.parse(fields?.badges?.[0] ?? '[]') as itemClientData['badges']
        const links = JSON.parse(fields?.links?.[0] ?? '[]') as itemClientData['links']

        //all the logos paths from the logos fields of the list's items, to check if they are used or not
        type logoPath = { logo_path: string }

        const badgesLogosPaths = (await prisma.$queryRaw`SELECT DISTINCT unnest(badges) ->> 'logo_path' AS logo_path
        FROM items WHERE list_id = ${list.id}::uuid 
        AND id NOT IN (${originalItem.id}::uuid)`) as logoPath[] // shouldn't include the item itself

        const linksLogosPaths = (await prisma.$queryRaw`SELECT DISTINCT unnest(links) ->> 'logo_path' AS logo_path
        FROM items WHERE list_id = ${list.id}::uuid 
        AND id NOT IN (${originalItem.id}::uuid)`) as logoPath[] // shouldn't include the item itself

        itemData.badges = await handleEditLogosFields(
            'item',
            userMediaRoot,
            badges,
            files?.badges,
            badgesLogosPaths,
            list.templates?.fieldTemplates?.badges,
            originalItem.badges,
            // true
        )

        itemData.links = await handleEditLogosFields(
            'item',
            userMediaRoot,
            links,
            files?.links,
            linksLogosPaths,
            list.templates?.fieldTemplates?.links,
            originalItem.links,
            // true
        )
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

        const item = await prisma.items.update({
            where: { id, user_id },
            data: itemData as items & itemClientData,
        })
        console.log("[Items] Inserted:", item.title)
        res.status(200).json(item);
    } catch (e) {
        console.log("[Items]", e)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}