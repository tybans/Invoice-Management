const express = require("express");
const router = express.Router();
const {
  createInvoice,
  updateInvoice,
  getInvoices,
  deleteInvoice,
} = require("../controllers/invoiceController");

router.post("/", createInvoice);
router.put("/:invoiceNumber", updateInvoice);
router.get("/", getInvoices);
router.delete("/:invoiceNumber", deleteInvoice);

module.exports = router;
