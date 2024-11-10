
// models/Security.js
const mongoose = require('mongoose');

const securitySchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const Security = mongoose.model('Security', securitySchema);

module.exports = Security;