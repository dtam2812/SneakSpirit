require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDb = require("./Services/ConnectDbService");
const VectorStoreService = require("./Services/VectorStoreService");

const userRoute = require("./Router/UserRoute");
const authRoute = require("./Router/AuthRoute");
const productRoute = require("./Router/ProductRoute");
const voucherRoute = require("./Router/VoucherRoute");
const orderRoute = require("./Router/OrderRoute");
const contactRoute = require("./Router/ContactRoute");
const ChatRoute = require("./Router/ChatRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth/admin", userRoute);
app.use("/api/auth", authRoute);
app.use("/auth/admin", productRoute);
app.use("/auth/admin", voucherRoute);
app.use("/api/auth", orderRoute);
app.use("/api/auth", contactRoute);
app.use("/api/chat", ChatRoute);

async function startServer() {
  try {
    await connectDb();

    // Lấy native db instance từ mongoose sau khi đã connect
    const db = mongoose.connection.db;
    await VectorStoreService.init(db);
    console.log("[VectorStore] Initialized ");

    app.listen(process.env.PORT, () => {
      console.log(`[Server] Running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("[Server] Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
