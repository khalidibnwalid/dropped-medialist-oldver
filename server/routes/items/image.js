import express from 'express';
import pool from '../../lib/db.js';

const router = express.Router();
const client = await pool.connect();

/* when you add a propertiy, make sure to add it in the Post thre values */
// # POST
router.post('/:item_id', async (req, res) => {
    const { item_id } = req.params;
    const { body } = req.body;

    let query = 'INSERT INTO items_images (item_id, image_path, title, description) VALUES ';

    let params = [item_id]; // params or values 

    let counter = 1;

    function addProp(prop) {
        query += `, $${counter + 1}`;
        params.push(prop);
        counter++;
    }

    body.map((prop) => {
        (counter > 1) ? query += `, ($1` : query += `($1` // to add the item_id to all images
        addProp(prop.image_path)
        prop.title ? addProp(prop.title) : addProp(null)
        prop.description ? addProp(prop.description) : addProp(null)
        query += `)`;
    })

    if (counter == 1) { query += `);` }

    try {
        await client.query(query, params);
        console.log('Inserted New Images')
        res.status(200).send('OK');
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// # GET
//get images of an item
router.get('/:item_id', async (req, res) => {
    try {
        const { item_id } = req.params // = /{c}
        const { rows } = await client.query('SELECT * FROM items_images WHERE item_id=$1', [item_id])
        res.status(200).json(rows);
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// # DELETE
router.delete('/', async (req, res) => {
    const { body } = req.body;
    //Json: "body": ["id", "id2", "id3"....]
    let query = 'DELETE FROM items_images WHERE id IN (';
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


// # Patch
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body; //the json only contain what changed therfore it represents 'changes'

    let query = 'UPDATE items_images SET ';
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
