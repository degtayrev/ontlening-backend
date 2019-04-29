const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const {
    upload
} = require('../middlewares/upload');
const {
    createBarang,
    deleteBarang,
    getBarangs,
} = require('../controllers/barang');

router.get('/', getBarangs);

router.post('/', auth, upload.single('image'), createBarang);

router.delete('/:id', auth, deleteBarang);

module.exports = router;