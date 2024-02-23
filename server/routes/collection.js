import express from 'express';
import pool from '../lib/db.js';

const router = express.Router();
const client = await pool.connect();


router.post('/', async (req, res) => {
    try {
        //should check the title if 1) it exists 2)it is safe
        const data = req.body
        client.query(`INSERT INTO collections (title, pincode, templates, cover_path, configurations) VALUES ($1, $2, $3, $4, $5)`,
            [data.title, data.pincode, data.templates, data.cover_path, data.configurations]);
        res.status(200).send("done"); //only needs a signal
        //res.json({ message: 'Get all users' });
        console.log("Passed:", data.title)
    } catch (e) {
        res.status(500).send('error')
    }
})

//GET

router.get('/', async (req, res) => {
    try {
        const { rows } = await client.query('SELECT * FROM collections WHERE trash = false ORDER BY title ASC')
        res.status(200).json(rows); //needs json
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

//get with parameter to get the specific collection details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { rows } = await client.query('SELECT * FROM collections WHERE id=$1', [id])
        res.status(200).json(rows[0]); //needs json
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// DELETE
router.delete('/', async (req, res) => {
    const { body } = req.body;
    //Json: "body": ["id", "id2", "id3"....]
    console.log(typeof body, body)

    let query = 'DELETE FROM collections WHERE id IN (';
    let params = []; // params or values 
    let counter = 0;

    body.map((prop) => {
        if (counter !== 0) query += ', ';
        query += `$${counter + 1}`;
        params.push(prop);
        counter++;
    })

    query += `);`;

    try {
        await client.query(query, params);
        console.log('Deleted:', body)
        res.status(200).send('OK');
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})


//patch
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body; //the json only contain what changed therfore it represents 'changes'

    let query = 'UPDATE collections SET ';
    let params = []; // params or values 
    let counter = 0;

    for (let prop in changes) {
        if (counter !== 0) query += ', ';
        //    if (Array.isArray(changes[prop])) 
        query += `${prop} = $${counter + 1}`;
        params.push(changes[prop]);
        counter++;
    }

    query += ` WHERE id = $${counter + 1};`;
    params.push(id);


    try {
        await client.query(query, params);
        console.log('edited', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

export default router;