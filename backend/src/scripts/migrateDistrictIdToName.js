require("dotenv").config();

const { connectMongo } = require("../config/db");
const District = require("../models/District");
const Account = require("../models/Account").Account;
const DetectionRecord = require("../models/DetectionRecord");
const Assignment = require("../models/Assignment");

async function buildDistrictMap() {
  const districts = await District.find({}).select("_id name");
  const map = new Map();
  for (const d of districts) {
    map.set(String(d._id), d.name);
  }
  return map;
}

async function migrateAccounts(districtMap) {
  const docs = await Account.collection.find({ districtId: { $exists: true, $ne: null } }).toArray();
  let updated = 0;
  for (const doc of docs) {
    const nextName = districtMap.get(String(doc.districtId)) || doc.districtName || "";
    await Account.updateOne(
      { _id: doc._id },
      {
        $set: { districtName: nextName },
        $unset: { districtId: "" }
      }
    );
    updated += 1;
  }
  return updated;
}

async function migrateDetections(districtMap) {
  const docs = await DetectionRecord.collection.find({ districtId: { $exists: true, $ne: null } }).toArray();
  let updated = 0;
  for (const doc of docs) {
    const nextName = districtMap.get(String(doc.districtId)) || doc.districtName || "";
    await DetectionRecord.updateOne(
      { _id: doc._id },
      {
        $set: { districtName: nextName },
        $unset: { districtId: "" }
      }
    );
    updated += 1;
  }
  return updated;
}

async function migrateAssignments(districtMap) {
  const docs = await Assignment.collection.find({ districtId: { $exists: true, $ne: null } }).toArray();
  let updated = 0;
  for (const doc of docs) {
    const nextName = districtMap.get(String(doc.districtId)) || doc.districtName || "";
    await Assignment.updateOne(
      { _id: doc._id },
      {
        $set: { districtName: nextName },
        $unset: { districtId: "" }
      }
    );
    updated += 1;
  }
  return updated;
}

async function main() {
  await connectMongo();
  const districtMap = await buildDistrictMap();

  const accountCount = await migrateAccounts(districtMap);
  const detectionCount = await migrateDetections(districtMap);
  const assignmentCount = await migrateAssignments(districtMap);

  // eslint-disable-next-line no-console
  console.log(
    `Migration done. Accounts: ${accountCount}, Detections: ${detectionCount}, Assignments: ${assignmentCount}`
  );
  process.exit(0);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

