import express from 'express';
import pool from '../../lib/db.js';

const router = express.Router();
const client = await pool.connect();


// # get items with a boolean (such as trash or fav) using AND
router.get('/and', async (req, res) => {
    const rules = req.query;
    // and?x=y&y=z as example

    let query = 'SELECT * FROM items WHERE'
    let params = [];
    let counter = 0;

    for (let prop in rules) {
        if (counter !== 0) query += " AND";
        query += ` ${prop} = $${counter + 1}`
        params.push(rules[prop])
        counter++
    }

    query += ' ORDER BY title ASC'

    try {
        const { rows } = await client.query(query, params)
        res.status(200).json(rows);
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})

// # get items with a boolean (such as trash or fav) using OR
router.get('/or', async (req, res) => {
    const rules = req.query;
    // and?x=y&y=z as example

    let query = 'SELECT * FROM items WHERE'
    let params = [];
    let counter = 0;

    for (let prop in rules) {
        if (counter !== 0) query += " OR";
        query += ` ${prop} = $${counter + 1}`
        params.push(rules[prop])
        counter++
    }

    query += ' ORDER BY title ASC'

    console.log(typeof rules.id)

    try {
        const { rows } = await client.query(query, params)
        res.status(200).json(rows);
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})



// ## PATCH, change the values for group of items
router.patch('/group', async (req, res) => {
    const changes = req.body; //the json only contain what changed therfore it represents 'changes'
    const id = req.body.id; //the json only contain what changed therfore it represents 'changes'

    let query = 'UPDATE items SET ';
    let params = []; // params or values 
    let counter = 0;

    for (let prop in changes) {
        //    if (Array.isArray(changes[prop])) 
        if (prop != 'id') {
            if (counter !== 0) query += ', ';
            query += `${prop} = $${counter + 1}`;
            params.push(changes[prop]);
            counter++;
        }
    }

    query += ` WHERE id IN (`;

    let subCounter = 0;
    id.map((prop) => {
        if (subCounter !== 0) query += ', ';
        query += `$${counter + 1}`;
        params.push(prop);
        counter++;
        subCounter++;
    })

    query += `);`;

    try {
        await client.query(query, params);
        console.log('edited', id)
        res.status(200).send('OK');
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})



// # get items with a boolean (such as trash or fav) using OR
router.get('/group/or', async (req, res) => {
    const rules = req.query;
    let id = []
    if (!Array.isArray(req.query.id)) {
        id = [req.query.id];
    } else {
        id = req.query.id
    }
    // and?x=y&y=z as example

    let query = 'SELECT * FROM items WHERE'
    let params = [];
    let counter = 0;

    for (let prop in rules) {
        if (prop != 'id') {
            if (counter !== 0) query += " OR";
            query += ` ${prop} = $${counter + 1}`
            params.push(rules[prop])
            counter++
        }
    }

    if (counter !== 0) query += ' OR'

    query += ` id IN (`;
    let subCounter = 0;
    id.map((prop) => {
        if (subCounter !== 0) query += ', ';
        query += `$${counter + 1}`;
        params.push(prop);
        counter++;
        subCounter++;
    })

    query += `);`;

    try {
        const { rows } = await client.query(query, params)
        res.status(200).json(rows);
    } catch (e) {
        console.log(e)
        res.status(500).send('error')
    }
})





export default router;
