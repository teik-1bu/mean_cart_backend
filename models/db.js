const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const collection = mongoose.connect('mongodb://localhost/test2', (err) => {
    console.log('Connect db');
});