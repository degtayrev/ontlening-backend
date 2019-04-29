const mongoose = require('mongoose');
const shortid = require('shortid');

const barang = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: shortid.generate
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Barang', barang);