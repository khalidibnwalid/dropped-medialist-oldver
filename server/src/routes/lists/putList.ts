import { prisma } from "@/src/index";
import { fieldTemplates, listClientData, templates } from "@/src/types/lists";
import { formidableAllowImagesAndDummyBlobs } from "@/src/utils/formidableOptions";
import handleFileEditing from "@/src/utils/handlers/handleFileEditing";
import handleEditLogosFields from "@/src/utils/handlers/handleLogosFieldsEditing";
import userMediaFoldersPath from "@/src/utils/userMediaFoldersPath";
import { lists } from "@prisma/client";
import { Request, Response } from "express";
import formidable from "formidable";
import { validate as uuidValidate } from "uuid";

/** Logos Fields currently can only be edited in a Put request */
export default async function putListRoute(req: Request, res: Response) {
    const user_id = res.locals?.user?.id;
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!uuidValidate(id)) return res.status(401).json({ message: 'Bad List ID' })

    try {
        const originalList = await prisma.lists.findUnique({ where: { id, user_id } }) as listClientData
        if (!originalList) return res.status(401).json({ message: `Bad List ID, List doesn't exist` })

        const form = formidable({ filter: formidableAllowImagesAndDummyBlobs });
        const [fields, files] = await form.parse(req); // don't forget to add fields
        if (!fields || !fields?.title?.[0] || !fields?.templates?.[0]) return res.status(400).json({ message: 'Bad Request' })

        let listData = {} as listClientData

        // unchanging fields
        listData.fav = originalList.fav;
        listData.trash = originalList.trash;

        // changing fields
        listData.title = fields.title[0];
        listData.templates = JSON.parse(fields.templates[0]);
        // listData.configurations = JSON.parse(fields?.configurations);

        listData.templates = JSON.parse(fields.templates[0]) as templates

        // images uploading
        const userMediaRoot = userMediaFoldersPath(user_id);

        listData.cover_path = await handleFileEditing(
            files.cover_path?.[0],
            userMediaRoot.lists,
            originalList?.cover_path,
            // true
        )

        //all the logos paths from the logos fields of the list's items, to check if they are used or not
        type logoPath = { logo_path: string }

        const badgesLogosPaths = (await prisma.$queryRaw`SELECT DISTINCT unnest(badges) ->> 'logo_path' AS logo_path
        FROM items WHERE list_id = ${originalList.id}::uuid`) as logoPath[]

        const linksLogosPaths = (await prisma.$queryRaw`SELECT DISTINCT unnest(links) ->> 'logo_path' AS logo_path
        FROM items WHERE list_id = ${originalList.id}::uuid`) as logoPath[]

        const originalFieldTemplates = originalList.templates?.fieldTemplates as fieldTemplates
        const fieldTemplates = listData.templates.fieldTemplates as fieldTemplates

        if (!fieldTemplates.badges && fieldTemplates.badges?.length !== files?.badges?.length
            || !fieldTemplates.links && fieldTemplates.links?.length !== files?.links?.length)
            return res.status(400).json({ message: 'Bad Request' })

        console.log(files, fieldTemplates?.links)
        listData.templates.fieldTemplates.badges = await handleEditLogosFields(
            'list',
            userMediaRoot,
            fieldTemplates?.badges,
            files?.badges,
            badgesLogosPaths,
            originalFieldTemplates.badges,
            // true
        )

        listData.templates.fieldTemplates.links = await handleEditLogosFields(
            'list',
            userMediaRoot,
            fieldTemplates?.links,
            files?.links,
            linksLogosPaths,
            originalFieldTemplates.links,
            // true
        )

        const list = await prisma.lists.update({
            where: { user_id, id: id },
            data: listData as lists
        });
        console.log('[lists] Edited:', id);
        res.status(200).json(list);
    } catch (e) {
        console.log("[lists]", e);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
