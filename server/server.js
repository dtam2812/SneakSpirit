const express = require("express");
const app = express();
const cors = require("cors");

const connectDb = require("./Services/ConnectDbService");
const userRoute = require("./Router/UserRoute");
const authRoute = require("./Router/AuthRoute");
const productRoute = require("./Router/ProductRoute");
const voucherRoute = require("./Router/VoucherRoute");
const orderRoute = require("./Router/OrderRoute");
const contactRoute = require("./Router/ContactRoute");

require("dotenv").config();
//middleware apply cors add all request
app.use(cors());
//middleware get info from client by req.body
app.use(express.json());

//connect database
connectDb();

//middleware router
app.use("/auth/admin", userRoute);
app.use("/api/auth", authRoute);
app.use("/auth/admin", productRoute);
app.use("/auth/admin", voucherRoute);
app.use("/api/auth", orderRoute);
app.use("/api/auth", contactRoute);

app.listen(process.env.PORT, () => {
  console.log(`server is running ${process.env.PORT}`);
});
