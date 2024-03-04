import express from 'express';
import fs, { unlink } from 'fs';

import * as formidable from 'formidable';

const router = express.Router();

//upload file

router.post('/', async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (!files.file) return new Error('no file was provided')
            if (!fields.filename) return new Error('no Filename was provided')
            //fields
            const filename = fields.filename[0];

            //setting a new place for the saved image instead of the appdata/temp
            const filepath = files.file[0].filepath;  // path to temp
            const newPath = `public/${filename}`;

            // Copy the file to newPath's location
            fs.copyFileSync(filepath, newPath);

            // Delete the original file
            fs.unlinkSync(filepath);

            res.status(200).send("OK"); //only needs a signal
            console.log("Passed:", filename);
        });
    } catch (e) {
        console.log("[File Upload]", e)
        res.status(500).send('error');
    }
});


//delete file
router.delete('/', async (req, res) => {
    const { fileNames } = req.body;

    if (!(fileNames.length > 0 || fileNames)) {
        console.log(`No File Was Deleted`)
        res.status(500).send('No File was Passed')
    }
    try {
        fileNames.map((fileName: string) => {
            const filePath = `public/${fileName}`
            unlink(filePath, (err) => {
                if (err) {
                    console.error(`(file) ${filePath}: `, err);
                } else {
                    console.log(`(file) ${filePath}: DELETED`);
                }
            });
            // image path be in request: ['images/items/{file}']

        })
        res.status(200).send("OK"); //only needs a signal
    } catch (e) {
        console.log("[File Delete]", e)
        res.status(500).send('error')
    }
})


export default router;