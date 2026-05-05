import bcrypt from "bcryptjs";
import User from "@/lib/models/User.model";
import { logger } from "@/lib/logger";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";

async function seedAdmin() {
  try {
    logger.info({ action: "seed" }, "Connecting to database...");

    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://mongo@localhost:27017";
    const batchId = process.env.SEED_BATCH || "A001";
    const password =
      process.env.SEED_PASSWORD || randomBytes(8).toString("hex");

    await mongoose.connect(MONGODB_URI);
    const existingAdmin = await User.findOne({ batchId });
    if (existingAdmin) {
      logger.info(
        { action: "seed" },
        "An admin user already exists. Skipping seed.",
      );
      process.exit(0);
    }

    logger.info("Creating admin user...");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      name: "admin",
      batchId,
      email: "admin@thu.edu.tw",
      password: hashedPassword,
      role: "admin",
      approved: true, // Ensure the admin is auto-approved
    });

    logger.info(
      { action: "seed", batchId, password },
      `Admin user created successfully! `,
    );
    process.exit(0);
  } catch (error) {
    console.error({ action: "seed" }, "Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
