const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');

const userSchema = mongoose.Schema({
    email: { type: String, 
        required: true, 
        unique: true, 
        match: [/^([\w\.]+@([\w-]+\.)+[\w-]{2,4})?$/] 
    },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model( 'User', userSchema);