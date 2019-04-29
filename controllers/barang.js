const mongoose = require('mongoose');
const moment = require('moment');

const Barangs = require('../models/barang');

const environment = require('../env.json');

exports.getBarangs = (req, res, next) => {
    Barangs.find()
        .sort({
            createdAt: 1
        })
        .populate('creator', 'name')
        .exec()
        .then(result => {
            const barang = result.map(bar => {
                const createdAt = moment(bar.createdAt).fromNow();
                const updatedAt = moment(bar.updatedAt).fromNow();
                return {
                    id: bar._id,
                    name: bar.name,
                    image: `${environment.env.DOMAIN}/api/upload/image/${bar.image}`,
                    creator: bar.creator,
                    createdAt,
                    updatedAt
                };
            });
            return res.status(200).json(barang);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                message: 'Something error while getting shoess'
            });
        });
};

exports.createBarang = (req, res, next) => {
    const {
        name,
    } = req.body;
    const barang = new Barangs({
        name,
        image: req.file.filename,
        creator: req.user.id
    });
    barang.save()
        .then(result => {
            return res.status(201).json({
                message: 'Barang created'
            });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                message: 'Something error while create barang'
            });
        });
};

exports.deleteBarang = async (req, res, next) => {
    const id = req.params.id;
    const creator = req.user.id;
    const ann = await Barangs.findOne({
        _id: id,
        creator
    });
    if (!ann) {
        return res.status(404).json({
            message: 'Barang not found'
        });
    }
    Barangs.findOneAndDelete({
        _id: id
    }, (error, result) => {
        return res.status(201).json({
            message: 'Barang deleted'
        });
    });
};
