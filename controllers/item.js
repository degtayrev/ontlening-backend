const mongoose = require('mongoose');
const moment = require('moment');

const Items = require('../models/item');

const environment = require('../env.json');

exports.getItems = (req, res, next) => {
    Items.find()
        .sort({
            createdAt: 1
        })
        .populate('creator', 'name')
        .exec()
        .then(result => {
            const item = result.map(bar => {
                const createdAt = moment(bar.createdAt).fromNow();
                const updatedAt = moment(bar.updatedAt).fromNow();
                return {
                    id: bar._id,
                    name: bar.name,
                    location: bar.location,
                    quantity: bar.quantity,
                    description: bar.description,
                    category: bar.category,
                    creator: bar.creator,
                    createdAt,
                    updatedAt
                };
            });
            return res.status(200).json(item);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                message: 'Something error while getting shoess'
            });
        });
};

exports.getItemsByCat = (req, res, next) => {
    const {
        category
    } = req.params;
    Items.find({
            category
        })
        .sort({
            createdAt: 1
        })
        .populate('creator', 'name')
        .exec()
        .then(result => {
            const item = result.map(bar => {
                const createdAt = moment(bar.createdAt).fromNow();
                const updatedAt = moment(bar.updatedAt).fromNow();
                return {
                    id: bar._id,
                    name: bar.name,
                    location: bar.location,
                    quantity: bar.quantity,
                    description: bar.description
                    category: bar.category,
                    creator: bar.creator,
                    createdAt,
                    updatedAt
                };
            });
            return res.status(200).json(item);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                message: 'Something error while getting shoess'
            });
        });
};

exports.createItem = (req, res, next) => {
    const {
        name,
        location,
        quantity,
        description,
        category,
    } = req.body;
    const item = new Items({
        name,
        location,
        quantity,
        description,
        category,
        creator: req.user.id
    });
    let itemArray = [];
    for (let i = 0; i < quantity; i++) {
        const itemObj = {
            name,
            location,
            description,
            category,
            creator: req.user.id
        };
        itemArray.push(itemObj);
    }
    Items.insertMany(itemArray, (err, docs) => {
        if (err) {
            return res.status(500).json({
                message: 'Something error while create item'
            });
        }
        return res.status(201).json({
            message: 'Item inserted'
        });
    });
};

exports.updateItem = async (req, res, next) => {
    const id = req.params.id;
    const creator = req.user.id;
    const {
        name,
        location,
        quantity,
        description,
        category,
    } = req.body;
    const item = new Items({
        _id: id,
        name,
        location,
        quantity,
        description,
        category,
        creator
    });
    const ite = await Items.findOne({
        _id: id,
        creator
    });
    if (!ite) {
        return res.status(404).json({
            message: 'Item not found'
        });
    }
    Items.findOneAndUpdate({
        _id: id
    }, item, (error, document, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Something error while updating item'
            });
        } else if (document) {
            return res.status(201).json({
                message: 'Item updated'
            });
        } else if (result) {
            return res.status(201).json({
                message: 'Item updated'
            });
        }
    });
};

exports.deleteItem = async (req, res, next) => {
    const id = req.params.id;
    const creator = req.user.id;
    const ann = await Items.findOne({
        _id: id,
        creator
    });
    if (!ann) {
        return res.status(404).json({
            message: 'Item not found'
        });
    }
    Items.findOneAndDelete({
        _id: id
    }, (error, result) => {
        return res.status(201).json({
            message: 'Item deleted'
        });
    });
};
