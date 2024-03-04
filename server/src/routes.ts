import express from 'express';
import collectionRouter from './routes/collections';
import fileRouter from './routes/file';
import imagesRouter from './routes/images';
import itemsRouter from './routes/items';
import tagsRouter from './routes/tags';

const router = express.Router();

// to store all routes, instead of putting them in a single page
router.use('/collections', collectionRouter);
router.use('/items', itemsRouter);
router.use('/images', imagesRouter);
router.use('/tags', tagsRouter);
router.use('/files', fileRouter);

export default router;
