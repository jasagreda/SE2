const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contracts',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    rentAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    billDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
});

const BillingModel = mongoose.model('bills', BillingSchema);
module.exports = BillingModel;