const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const userRoutes = require("./routes/userRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const authRoutes = require("./routes/authRoutes");


app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
