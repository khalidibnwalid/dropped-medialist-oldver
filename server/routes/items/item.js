import express from 'express';
import pool from '../../lib/db.js';

const router = express.Router();
const client = await pool.connect();


/* when you add a propertiy, make sure to add it in the Post thre values */
// # POST

router.post('/:collection_id', async (req, res) => {
    try {
        //should check the title if 1) it exists 2)it is safe
        const { collection_id } = req.params;
        const data = req.body;

        await client.query(`INSERT INTO items (title, cover_path, description, extra_fields, related, tags, main_fields, links, fav, collection_id, content_fields, badges, poster_path, progress_state, configurations) VALUES ($1, $2, $3, $4, $5, $6, $7 , $8 , $9, $10, $11, $12, $13, $14, $15)`,
            [data.title, data.cover_path, data.description, data.extra_fields, data.related, data.tags, data.main_fields, data.links, data.fav, collection_id, data.content_fields, data.badges, data.poster_path, data.progress_state, data.configurations]);

        console.log("Passed:", data.title)
        res.status(200).send('OK');
    } catch (e) {
        console.log(e)
        res.status(500).send('error item')
    }
})

// # GET
//get items of  a collection
router.get('/:c_id', async (req, res) => {
    try {
        const { c_id } = req.params // = /{c}
        const { rows } = await client.query('SELECT * FROM items WHERE collection_id=$1 AND trash = false ORDER BY title ASC', [c_id])
        res.status(200).json(rows);
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// ## get a single item's data
router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params // = /{c}
        const { rows } = await client.query('SELECT * FROM items WHERE id=$1', [id])
        res.status(200).json(rows[0]);
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// # DELETE
router.delete('/', async (req, res) => {
    const { body } = req.body;
    //Json: "body": ["id", "id2", "id3"....]

    let deleteQuery = 'DELETE FROM items WHERE id IN (';
    let deleteParams = []; // params or values 
    let counter = 0;

    body.map((prop) => {
        if (counter !== 0) deleteQuery += ', ';
        deleteQuery += `$${counter + 1}`;
        deleteParams.push(prop);
        counter++;
    })

    deleteQuery += `);`;

    //to remove the deleted items from other items' related column varchar[]
    let updateQuery = 'UPDATE items SET related = array_diff(related, ARRAY[';
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
        await client.query(updateQuery, updateParams);
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

    let query = 'UPDATE items SET ';
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

////////////////////////////////////////// neeeeds WORKKKKKKKKKKK because it is not dynamical by anymean
// ## PATCH a field: is the old PATCH, i'm using it to reset jsonb[] fields with new values.
router.patch('/fields/:id', async (req, res) => {
    try {
        //should check the title if 1) it exists 2)it is safe
        const { id } = req.params;
        const { value, index } = req.body;


        await client.query(`UPDATE items SET main_fields[$2] = jsonb_set(main_fields[$2], '{value}', $3::jsonb) WHERE id = $1`,
            [id, index, value]);

        res.status(200).send('OK');
        console.log("Edited", id);
    } catch (e) {
        console.error(e); // Log the error for debugging purposes
        res.status(500).send('error')
    }
})

// make the put and we are done

/*for PUT we need 
"dynamically constructs the SQL update statement based on the fields 
provided in the request body. It then uses parameterized queries to handle values 
safely and avoid SQL injection." 
so we don't by wrong set the values to null when we don't want to chaneg them*/

//PUT will be for full editing review REST API in my obsdian md





export default router;
