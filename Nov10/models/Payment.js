const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    method: {
        type: String,
        enum: ['Cash', 'Check'],
        required: true
    }
});

const PaymentModel = mongoose.model('payments', PaymentSchema);
module.exports = PaymentModel;