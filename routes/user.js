const express = require('express');
const router = express.Router();

const {
    createAccount,
    login,
    pushToken,
    requestToken,
    getUser,
    deleteUser,
    updateUser
} = require('../controllers/user');

router.get('/', getUser);

router.post('/create-account', createAccount);

router.post('/login', login);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;