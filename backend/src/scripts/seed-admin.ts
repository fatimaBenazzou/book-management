import "dotenv/config";
import mongoose from "mongoose";
import userModel from "../models/users.js";

const ADMIN = {
  firstName: "Super",
  lastName: "Admin",
  email: "superadmin@library.com",
  password: "Admin@5678",
  phone: "1111111111",
  role: "admin" as const,
  isActive: true,
};

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI as string, {
    dbName: process.env.MONGODB_DB_NAME,
    auth: {
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD,
    },
  });

  const existing = await userModel.findOne({ email: ADMIN.email });

  if (existing) {
    console.log(`Admin already exists: ${ADMIN.email}`);
  } else {
    await userModel.create(ADMIN);
    console.log("Admin created successfully.");
  }

  console.log("----------------------------");
  console.log("  Email   :", ADMIN.email);
  console.log("  Password:", ADMIN.password);
  console.log("----------------------------");

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
