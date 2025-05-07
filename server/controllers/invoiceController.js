const Invoice = require("../models/invoice.model");


exports.createInvoice = async (req, res) => {
  const { invoiceNumber, invoiceDate, invoiceAmount, financialYear } = req.body;

  console.log("Creating invoice with data:", req.body); // ✅ Add this for debugging

  try {
    
    const newInvoice = new Invoice({
      invoiceNumber,
      invoiceDate,
      invoiceAmount,
      financialYear,
    });
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Invoice creation failed:", error);

    res.status(500).json({ message: "Error creating invoice", error });
  }
};


exports.updateInvoice = async (req, res) => {
  const { invoiceNumber } = req.params;
  const updateData = req.body;

  try {
    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber },
      updateData,
      { new: true }
    );
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error });
  }
};


exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().skip(0).limit(10);
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching invoices",
      error,
    });
  }
};



exports.deleteInvoice = async (req, res) => {
  const {invoiceNumber} = req.params
  try {
    await Invoice.findOneAndDelete({invoiceNumber})
    res.status(200).json({message: "Invoice deleted successfully."})
  } catch (error) {
    res.status(500).json({
      message: "Error deleting invoice!",
      error
    })
  }
}
