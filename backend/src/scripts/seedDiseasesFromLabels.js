require("dotenv").config();

const fs = require("fs");
const path = require("path");

const { connectMongo } = require("../config/db");
const Disease = require("../models/Disease");

async function main() {
  await connectMongo();

  const labelsPath = path.join(__dirname, "..", "..", "ml", "labels.json");
  const labels = JSON.parse(fs.readFileSync(labelsPath, "utf-8"));

  const diseaseNames = Array.isArray(labels) ? labels : Object.keys(labels);
  for (const name of diseaseNames) {
    const clean = String(name).trim();
    if (!clean) continue;
    await Disease.updateOne(
      { name: clean },
      { $setOnInsert: { name: clean, description: "", symptoms: [], precautions: [], treatments: [] } },
      { upsert: true }
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seeded/ensured diseases: ${diseaseNames.length}`);
  process.exit(0);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

