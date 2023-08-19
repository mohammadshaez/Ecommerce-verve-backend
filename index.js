console.clear();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRouter = require("./routes/User");
const authRouter = require("./routes/auth");
const productsRouter = require("./routes/Product");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const stripeRouter = require("./routes/Stripe");
const cors = require('cors')
app.use(cors())

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("Connection Failed", err);
  });

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/user", UserRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/checkout", stripeRouter);

app.listen(process.env.PORT || 3001, () => {
  console.log("Server is live and running");
});
