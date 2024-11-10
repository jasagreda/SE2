const mongoose = require('mongoose')

const ContractSchema = new mongoose.Schema({
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    dateOfContract: Date,
    startDate: Date,
    endDate: Date,
    monthlyRent: String,
    advance: String,
    securityDeposit: String,
})

const ContractModel = mongoose.model("contracts", ContractSchema)
module.exports = ContractModel