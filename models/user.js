const mongoose = require('mongoose');

const user = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', user);