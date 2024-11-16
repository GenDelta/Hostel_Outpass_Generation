const mongoose = require('mongoose');

const outpassDetailSchema = new mongoose.Schema({
    listItemId: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentEmail: {
        type: String,
        required: true
    },
    studentContactNumber: {
        type: String,
        required: true
    },
    parentName: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    },
    parentContactNumber: {
        type: String,
        required: true
    },
    leaveFrom: {
        type: String,
        required: true
    },
    leaveFromTime: {
        type: String,
        required: true
    },
    leaveTo: {
        type: String,
        required: true
    },
    leaveToTime: {
        type: String,
        required: true
    },
    reasonForAbsence: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

outpassDetailSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('OutpassDetail', outpassDetailSchema);