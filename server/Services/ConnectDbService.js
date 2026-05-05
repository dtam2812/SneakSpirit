const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(
      `${process.env.DB_URL}/${process.env.DATABASE_NAME}`,
    );
    console.log("connect database succeeded");
  } catch (error) {
    console.log("connect database failed", error);
  }
}

module.exports = connectDatabase;
