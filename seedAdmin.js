import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. CHANGE THIS to your actual MongoDB URI from your .env file
const MONGODB_URI = "mongodb+srv://prajwalgautam2727_db_user:jX4UAU5Lb19I5SVh@cluster0.6vozwwh.mongodb.net/pharmacy_db?retryWrites=true&w=majority&appName=Cluster0";

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);

    const email = "admin@example.com";
    const password = "AdminPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = {
      username: "admin",
      email: email,
      password: hashedPassword,
      role: "ADMIN", // Must be uppercase to match your Middleware/Form logic
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Access the 'users' collection directly
    const db = mongoose.connection.db;
    
    // This will create the user if they don't exist, or update them if they do
    await db.collection("users").updateOne(
      { email: email },
      { $set: adminUser },
      { upsert: true }
    );

    console.log("-----------------------------------------");
    console.log("✅ SUCCESS: Admin user created in Database!");
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log("-----------------------------------------");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();