const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    add: (req, res) => {

        let result = {};
        let status = 201;

        const {name, password} = req.body;
        const user = new User({name, password}); // document = instance of a model
        // TODO: We can hash the password here before we insert instead of in the model

        user.save((err, user) => {
            console.log(err);
            if (!err) {
                result.status = status;
                result.result = user;
            } else {
                status = 500;
                result.status = status;
                result.error = err;
            }
            res.status(status).send(result);
        });
    },

    login: (req, res) => {
        const { name, password } = req.body;

        let result = {};
        let status = 200;
        User.findOne({name}, (err, user) => {
            if (!err && user) {
                // We could compare passwords in our model instead of below
                bcrypt.compare(password, user.password).then(match => {
                    if (match) {
                        status = 200;
                        // Create a token
                        const payload = { user: user.name , id: user._id};
                        const options = { expiresIn: '2d', issuer: 'https://expressjsapp.herokuapp.com' };
                        const secret = process.env.JWT_SECRET;
                        const token = jwt.sign(payload, secret, options);

                        // console.log('TOKEN', token);
                        result.token = token;
                        result.status = status;
                        result.result = user;
                    } else {
                        status = 401;
                        result.status = status;
                        result.error = 'Authentication error';
                    }
                    res.status(status).send(result);
                }).catch(err => {
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                });
            } else {
                status = 404;
                result.status = status;
                result.error = err;
                req.user_data = result;
                res.status(status).send(result);
            }
        });

    },

    getAll: (req, res) => {
        let result = {};
        let status = 200;
        const payload = req.decoded;
        // TODO: Log the payload here to verify that it's the same payload
        //  we used when we created the token
        // console.log('PAYLOAD', payload);
        if (payload && payload.user === 'admin') {
            User.find({}, (err, users) => {
                if (!err) {
                    result.status = status;
                    result.error = err;
                    result.result = users;
                } else {
                    status = 500;
                    result.status = status;
                    result.error = err;
                }
                res.status(status).send(result);
            });
        } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            res.status(status).send(result);
        }

    }
}