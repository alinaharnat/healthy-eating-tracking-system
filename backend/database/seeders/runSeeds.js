import dotenv from "dotenv";
import mongoose from "mongoose";
import { runSeeds } from "./index.js";

dotenv.config();

function getMongoUriOrFail() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Set it in backend/.env before running seeds.",
    );
  }

  return mongoUri;
}

function parseResetFlag() {
  return !process.argv.includes("--no-reset");
}

async function main() {
  const mongoUri = getMongoUriOrFail();
  const reset = parseResetFlag();

  await mongoose.connect(mongoUri);

  try {
    const summary = await runSeeds({ reset });

    console.log("Seeding complete.");
    console.log(`Users: ${summary.users}`);
    console.log(`Products: ${summary.products}`);
    console.log(`Meals: ${summary.meals}`);
    console.log(`IoT measurements: ${summary.iotMeasurements}`);
    console.log(`Recommendations: ${summary.recommendations}`);
    console.log(`Reports: ${summary.reports}`);
    console.log(`Dev password for seeded users: ${summary.devPassword}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
