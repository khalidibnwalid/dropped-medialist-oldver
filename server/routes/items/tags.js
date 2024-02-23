import express from 'express';
import pool from '../../lib/db.js';

const router = express.Router();
const client = await pool.connect();

/* when you add a propertiy, make sure to add it in the Post thre values */
// # POST

router.post('/:collection_id', async (req, res) => {
    const { collection_id } = req.params;
    const { body } = req.body;
    const { id } = req.query; //boolean if id?=true it will post it with them, if false it will generatre it

    let query = '';
    if (id) { query = 'INSERT INTO items_tags (collection_id, group_name, name, description, id) VALUES ' }
    else { query = 'INSERT INTO items_tags (collection_id, group_name, name, description) VALUES ' }

    let params = [collection_id]; // params or values 

    let counter = 1;

    function addProp(prop) {
        query += `, $${counter + 1}`;
        params.push(prop);
        counter++;
    }

    body.map((prop) => {
        (counter > 1) ? query += `, ($1` : query += `($1` // to add the collection_id to all tags
        prop.group_name ? addProp(prop.group_name) : addProp(null)
        prop.name ? addProp(prop.name) : addProp(null)
        prop.description ? addProp(prop.description) : addProp(null)
        if (id) {prop.id ? addProp(prop.id) : addProp(null)}
        query += `)`;
    })

    if (counter == 1) { query += `);` }

    try {
        await client.query(query, params);
        console.log('Inserted New Tags')
        res.status(200).send('OK');
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// # GET
//get all tags of  a collection
router.get('/:collection_id', async (req, res) => {
    try {
        const { collection_id } = req.params // = /{c}
        const { rows } = await client.query('SELECT * FROM items_tags WHERE collection_id=$1 ORDER BY name ASC', [collection_id])
        res.status(200).json(rows);
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// # DELETE
router.delete('/', async (req, res) => {
    const { body } = req.body;

    // to remove tags rows from items_tags table
    //Json: "body": ["id", "id2", "id3"....]
    let deleteQuery = 'DELETE FROM items_tags WHERE id IN (';
    let deleteParams = []; // params or values 
    let counter = 0;

    body.map((prop) => {
        if (counter !== 0) deleteQuery += ', ';
        deleteQuery += `$${counter + 1}`;
        deleteParams.push(prop);
        counter++;
    })

    deleteQuery += `);`;

    //to remove tags from tags column varchar[] in items table
    let updateQuery = 'UPDATE items SET tags = array_diff(tags, ARRAY[';
    let updateParams = []; // params or values 
    counter = 0;

    body.map((prop) => {
        if (counter !== 0) updateQuery += ', ';
        updateQuery += `$${counter + 1}`;
        updateParams.push(prop);
        counter++;
    })

    updateQuery += `]::varchar[]);`;

    try {
        await client.query(deleteQuery, deleteParams);
        console.log(deleteQuery, deleteParams);
        await client.query(updateQuery, updateParams);
        console.log(updateQuery, updateParams);
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

    let query = 'UPDATE items_tags SET ';
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
