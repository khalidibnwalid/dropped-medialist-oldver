import { prisma } from '@/src/index';
import { listClientData } from '@/src/types/lists';
import { formidableAllowImagesAndDummyBlobs } from '@/src/utils/formidableOptions';
import handleFileSaving from '@/src/utils/handlers/handleFileSaving';
import { handleLogosFieldsSaving } from '@/src/utils/handlers/handleLogosFieldsSaving';
import userMediaRoot from '@/src/utils/userMediaRoot';
import { lists } from '@prisma/client';
import { Request, Response } from 'express';
import formidable from 'formidable';
import fs from 'fs';

export default async function postListRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id;
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const form = formidable({ filter: formidableAllowImagesAndDummyBlobs });
        const [fields, files] = await form.parse(req);
        if (!fields || !fields?.title?.[0] || !fields?.templates?.[0]) return res.status(400).json({ message: 'Bad Request' })

        let listData = {} as listClientData

        listData.id = crypto.randomUUID();
        listData.title = fields.title[0];
        listData.templates = JSON.parse(fields.templates[0]);
        // listData.configurations = JSON.parse(fields?.configurations?.[0] | '{}');
        listData.fav = false;
        listData.trash = false;

        const listMediaRoot = userMediaRoot(user_id, listData.id);
        // create the list media folder
        await fs.promises.mkdir(listMediaRoot);

        // images uploading
        listData.cover_path = await handleFileSaving(files?.cover_path?.[0], listMediaRoot);

        // only add a listID prefix to list logos
        listData.templates.fieldTemplates.badges =
            await handleLogosFieldsSaving(
                listData.templates.fieldTemplates?.badges,
                files.badges,
                listMediaRoot,
                'template'
            )

        listData.templates.fieldTemplates.links =
            await handleLogosFieldsSaving(
                listData.templates.fieldTemplates?.links,
                files.links,
                listMediaRoot,
                'template'
            )

        const list = await prisma.lists.create({ data: { ...listData as lists, user_id } });
        res.status(200).json(list);
        console.log("[lists] Inserted:", list.title);
    } catch (e) {
        console.log("[lists]", e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
