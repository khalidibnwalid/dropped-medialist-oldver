import { prisma } from '@/src/index';
import { listClientData } from '@/src/types/lists';
import { formidableAllowImagesAndDummyBlobs } from '@/src/utils/formidableOptions';
import handleFileSaving from '@/src/utils/handlers/handleFileSaving';
import { handleLogosFieldsSaving } from '@/src/utils/handlers/handleLogosFieldsSaving';
import userMediaFoldersPath from '@/src/utils/userMediaFoldersPath';
import { lists } from '@prisma/client';
import { Request, Response } from 'express';
import formidable from 'formidable';

export default async function postListRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id;
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const form = formidable({ filter: formidableAllowImagesAndDummyBlobs });
        const [fields, files] = await form.parse(req);
        if (!fields || !fields?.title?.[0] || !fields?.templates?.[0]) return res.status(400).json({ message: 'Bad Request' })

        let listData = {} as listClientData

        listData.title = fields.title[0];
        listData.templates = JSON.parse(fields.templates[0]);
        // listData.configurations = JSON.parse(fields?.configurations);
        listData.fav = false;
        listData.trash = false;

        // images uploading
        const userMediaRoot = userMediaFoldersPath(user_id);

        listData.cover_path = await handleFileSaving(files?.cover_path?.[0], userMediaRoot.lists);

        listData.templates.fieldTemplates.badges =
            await handleLogosFieldsSaving(listData.templates.fieldTemplates?.badges, files.badges, userMediaRoot)
        listData.templates.fieldTemplates.links =
            await handleLogosFieldsSaving(listData.templates.fieldTemplates?.links, files.links, userMediaRoot)

        // listData.configurations = fields.configurations;

        const list = await prisma.lists.create({ data: { ...listData as lists, user_id } });
        res.status(200).json(list);
        console.log("[lists] Inserted:", list.title);
    } catch (e) {
        console.log("[lists]", e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
