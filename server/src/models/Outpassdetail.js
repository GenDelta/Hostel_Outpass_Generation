const mongoose = require('mongoose');

const outpassDetailSchema = new mongoose.Schema({
    listItemId: String,
    studentName: String,
    studentEmail: String,
    studentContactNumber: String,
    parentName: String,
    parentEmail: String,
    parentContactNumber: String,
    leaveFrom: String,
    leaveFromTime: String,
    leaveTo: String,
    leaveToTime: String,
    reasonForAbsence: String
});

module.exports = mongoose.model('OutpassDetail', outpassDetailSchema);