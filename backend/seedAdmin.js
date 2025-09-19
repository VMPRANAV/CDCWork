const {MONGO_URL} = require('./.config/config')

const mongoose = require("mongoose");
const readline = require("readline/promises");
const Admin = require('./models/admin');

const MONGO = MONGO_URL || "mongodb://127.0.0.1:27017/CDCWork";

async function main() {
  // connect
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });



  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const collegeEmail = await rl.question("Admin email: ");
    const password = await rl.question("Password (visible): ");

    rl.close();

    const response = await Admin.findOne({collegeEmail});
    if(response ){
        console.log("Admin already Exist");
        return;
    }


    const admin = new Admin({
        collegeEmail,
        password,
        role : "admin"
    })

    await admin.save();

    console.log("Admin user created/updated:", {
      id: admin._id,
      name: admin.name,
      collegeEmail: admin.collegeEmail,
      role: admin.role,
    });
  } catch (e) {
    rl.close();
    console.error("Error:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
