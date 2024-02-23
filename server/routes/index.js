import express from 'express';
import routerCollection from './collection.js';
import routerCollectionRule from './collection-rule.js'
import routerItem from './items/item.js'
import routerItemRule from './items/item-rule.js'
import routerImage from './items/image.js'
import routerTag from './items/tags.js'
import routerFile from './file.js'

const router = express.Router();

// to store all routes, instead of putting them in a single page
router.use('/collections', routerCollection);
router.use('/collections/rule', routerCollectionRule);
router.use('/items', routerItem);
router.use('/items/rule', routerItemRule);
router.use('/images', routerImage);
router.use('/tags', routerTag);
router.use('/files', routerFile);

export default router;
