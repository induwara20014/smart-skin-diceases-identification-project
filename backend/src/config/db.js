const mongoose = require("mongoose");

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log("MongoDB connected");
}

module.exports = { connectMongo };

