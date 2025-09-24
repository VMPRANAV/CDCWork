const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packages: {
        //array of strings
    }
    
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;