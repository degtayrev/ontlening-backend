const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/user');

exports.getUser = async (req, res, next) => {
    Users.find()
        .sort({
            createdAt: -1
        })
        .exec()
        .then(result => {
            return res.status(200).json(result);
        })
        .catch(error => {
            return res.status(500).json({
                message: 'Something error while getting users'
            });
        });
}

exports.createAccount = async (req, res, next) => {
    const name = req.body.name.trim();
    const username = req.body.username.trim();
    const password = req.body.password;
    const level = req.body.level.trim();
    const usr = await Users.findOne({
        username
    });
    if (usr) {
        return res.status(409).json({
            message: 'Username already taken'
        });
    }
    bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
            return res.status(500).json({
                message: 'Something error while hashing your password'
            });
        }
        const user = new Users({
            name,
            username,
            password: hash,
            level
        });
        user.save()
            .then(result => {
                return res.status(201).json({
                    message: 'Account created'
                });
            })
            .catch(error => {
                return res.status(500).json({
                    message: 'Something error while creating your account'
                });
            });
    });
};

exports.login = async (req, res, next) => {
    const username = req.body.username.trim();
    const password = req.body.password;
    const usr = await Users.findOne({
        username
    });
    if (!usr) {
        return res.status(404).json({
            message: 'Username not registered'
        });
    }
    bcrypt.compare(password, usr.password, (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Something error while comparing your password'
            });
        } else if (result) {
            const token = jwt.sign({
                id: usr._id,
                username: usr.username
            }, 'secret');
            res.setHeader('Authorization', 'Bearer ' + token);
            return res.status(201).json({
                message: 'Login success',
                id: usr._id,
                username: usr.username,
                level: usr.level,
                name: usr.name
            });
        }
        return res.status(401).json({
            message: 'Wrong password'
        });
    });
};

exports.updateUser = async (req, res, next) => {
    const id = req.params.id;
    const {
        name,
        username,
        password,
        level
    } = req.body;
    hased = await bcrypt.hash(password, 10);
    const user = new Users({
        _id: id,
        name,
        username,
        password: hased,
        level
    });
    const usr = await Users.findOne({
        _id: id
    });
    if (!usr) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    Users.findOneAndUpdate({
        _id: id
    }, user, (error, document, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: 'Something error while updating user'
            });
        } else if (document) {
            return res.status(201).json({
                message: 'User updated'
            });
        } else if (result) {
            return res.status(201).json({
                message: 'User updated'
            });
        }
    });
};

exports.deleteUser = async (req, res, next) => {
    const id = req.params.id;
    const usr = await Users.findOne({
        _id: id
    });
    if (!usr) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    Users.findOneAndDelete({
        _id: id
    }, (error, result) => {
        return res.status(201).json({
            message: 'User deleted'
        });
    });
};