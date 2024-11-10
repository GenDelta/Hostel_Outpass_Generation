const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    prn: String,
    photo: String,
    listItems: [{
        id: String,
        outpass: String,
        submitted: Boolean
    }]
});

module.exports = mongoose.model('Student', studentSchema);