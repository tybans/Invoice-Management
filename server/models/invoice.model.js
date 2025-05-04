const mongoose = require('mongoose')

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    required: true
  },
  invoiceDate: {
    type: Date,
    required: true
  },
  invoiceAmount: {
    type: Number,
    required: true
  },
  financialYear: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Invoice', invoiceSchema)