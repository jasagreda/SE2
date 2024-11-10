const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'units',
        required: true
    },
    maintenanceType: {
        type: String,
        required: true
    },
    dateStart: Date,
    dateEnd: Date,
    cost: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
});

const MaintenanceModel = mongoose.model('maintenances', MaintenanceSchema);
module.exports = MaintenanceModel;