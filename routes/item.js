const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const {
    createItem,
    deleteItem,
    getItems,
    getItemsByCat,
    updateItem
} = require('../controllers/item');

router.get('/', getItems);

router.get('/:category', getItemsByCat);

router.post('/', auth, createItem);

router.put('/:id', auth, updateItem)

router.delete('/:id', auth, deleteItem);

module.exports = router;