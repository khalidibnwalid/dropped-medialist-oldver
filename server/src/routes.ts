import express from 'express';
import listsRouter from './routes/lists/lists';
import filesRouter from './routes/file';
import imagesRouter from './routes/images';
import itemsRouter from './routes/items';
import tagsRouter from './routes/tags';
import sessionsRoutes from './routes/sessions';
import usersRouter from './routes/user';

const router = express.Router();

// to store all routes, instead of putting them in a single page
router.use('/lists', listsRouter);
router.use('/items', itemsRouter);
router.use('/images', imagesRouter);
router.use('/tags', tagsRouter);
router.use('/files', filesRouter);
router.use('/user', usersRouter);
router.use('/sessions', sessionsRoutes);

export default router;
