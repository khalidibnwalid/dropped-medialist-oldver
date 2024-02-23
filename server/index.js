import 'dotenv/config';
import express from "express";
import routes from './routes/index.js';
import main from './migrate.js';

const app = express();
app.use(express.json()); //parser
app.use(express.static('public')); //for images public folder

const port = process.env.PORT;


app.use('/api', routes);

app.listen(port, () => {
    console.log(`listening on ${port}`, '')
});

main()

