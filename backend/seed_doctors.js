const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: __dirname + '/.env' }); // Loads MONGODB_URI from your .env

// --- 2. SCRIPT TO INSERT THEM ---
async function seedDoctors() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skin_mage";
    console.log("Connecting to MongoDB at:", MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to the database successfully!");

    // Read the doctors from the local JSON file
    const fileData = fs.readFileSync(path.join(__dirname, "doctors.json"), "utf8");
    const doctorsList = JSON.parse(fileData);

    // We need the Account model
    // Assuming this script is placed in the backend folder, we require from src/models/Account
    const { Account } = require("./src/models/Account");

    let addedCount = 0;

    for (const doc of doctorsList) {
      // Auto-generate missing auth fields
      const fallbackEmail = doc.name.replace(/[^a-zA-Z]/g, '').toLowerCase() + "@skinmage.com";
      const finalEmail = doc.email ? doc.email.toLowerCase() : fallbackEmail;
      const finalPassword = doc.password || "doctor123";

      // Check if email already exists
      const existing = await Account.findOne({ email: finalEmail });
      
      if (existing) {
        console.log(`[SKIP] A user with email ${finalEmail} already exists (${doc.name}).`);
        continue;
      }

      // Hash the password just like the registration route does
      const passwordHash = await bcrypt.hash(finalPassword, 10);

      // Create the account
      await Account.create({
        name: doc.name,
        email: finalEmail,
        passwordHash: passwordHash,
        role: "doctor",
        districtName: doc.districtName,
        specialty: doc.specialty
      });

      console.log(`[SUCCESS] Added doctor: ${doc.name}`);
      addedCount++;
    }

    console.log(`\nFinished! Successfully added ${addedCount} new doctors.`);
    
  } catch (error) {
    console.error("\n[ERROR] Something went wrong:", error.message);
  } finally {
    // Always close the database connection
    await mongoose.disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

// Run the script
seedDoctors();
