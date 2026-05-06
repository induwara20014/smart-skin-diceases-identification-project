require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { connectMongo } = require("../config/db");
const District = require("../models/District");

async function main() {
  await connectMongo();

  const filePath = path.join(__dirname, "districts-lk.json");
  const districts = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const name of districts) {
    await District.updateOne({ name }, { $setOnInsert: { name, code: "" } }, { upsert: true });
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded districts: ${districts.length}`);
  process.exit(0);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

