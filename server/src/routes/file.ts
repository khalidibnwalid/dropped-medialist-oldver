import express from 'express';
import fs from 'fs';

import * as formidable from 'formidable';

const filesRouter = express.Router();

//upload file

filesRouter.post('/', async (req, res) => {
    const user = res.locals?.user;
    if (!user || !res.locals.session) return res.status(401).json({ message: 'Unauthorized' })

    const userMediaRoot = `public/users/${user.id}`

    try {

        //create media folder for user if not exists
        if (!fs.existsSync(`${userMediaRoot}/images/items`)
            || !fs.existsSync(`${userMediaRoot}/images/lists`)
            || !fs.existsSync(`${userMediaRoot}/images/logos`)
        ) {
            fs.mkdirSync(`${userMediaRoot}/images/items`, { recursive: true })
            fs.mkdirSync(`${userMediaRoot}/images/lists`)
            fs.mkdirSync(`${userMediaRoot}/images/logos`)
        }

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (!files.file) return res.status(400).json({ error: 'no file was provided' })
            if (!fields.filename) return res.status(400).json({ error: 'no filename was provided' })
            //fields
            const filename = fields.filename[0];

            //setting a new place for the saved image instead of the appdata/temp
            const filepath = files.file[0].filepath;  // path to temp
            const newPath = `${userMediaRoot}/${filename}`;

            // Copy the file to newPath's location
            fs.copyFileSync(filepath, newPath);

            // Delete the original file
            fs.unlinkSync(filepath);

            res.status(200).json({ message: 'File Uploaded' }); //only needs a signal
            console.log("Passed:", filename);
        });
    } catch (e) {
        console.log("[File Upload]", e)
        res.status(500).json({ message: 'error' })
    }
});


//delete file
filesRouter.delete('/', async (req, res) => {
    const { fileNames } = req.body;

    if (!(fileNames.length > 0 || fileNames)) {
        return res.status(400).json({ error: 'No File Was Passed' })
    }

    const user = res.locals.user;
    if (!user || !res.locals.session) return res.status(401).json({ message: 'Unauthorized' })

    try {

        fileNames.map((fileName: string) => {
            const filePath = `public/${user.id}/${fileName}`
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`(file) ${filePath}: `, err);
                } else {
                    console.log(`(file) ${filePath}: DELETED`);
                }
            });
            // image path be in request: ['images/items/{file}']

        })
        res.status(200).json({ message: 'File Deleted' });
    } catch (e) {
        console.log("[File Delete]", e)
        res.status(500).json({ message: 'error' })
    }
})


export default filesRouter;