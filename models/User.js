'use strict';
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pubgname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    favouriteMatches: []
});

const User = mongoose.model('User',UserSchema);

module.exports = User;