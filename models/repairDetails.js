const mongoose = require('mongoose');

const repairDetailsSchema = new mongoose.Schema({
    serialNo: Number,
    particular: String,
    rate: Number,
    amount: Number
});

const RepairDetail = mongoose.model('RepairDetail', repairDetailsSchema);

module.exports = RepairDetail;
