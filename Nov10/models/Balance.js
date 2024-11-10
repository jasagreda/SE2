const mongoose = require('mongoose');

const BalanceSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contracts',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const BalanceModel = mongoose.model('balances', BalanceSchema);
module.exports = BalanceModel;