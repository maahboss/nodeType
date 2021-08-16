require("dotenv").config();
import connectDB from "./dbConfig";
import User from "../models/User";

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const createdUsers = await User.insertMany([]);

    console.log("Data imported");
    process.exit();
  } catch (e) {
    console.error(`Error: ${e}`);
    process.exit(1);
  }
};

const destroyData = async (): Promise<void> => {
  try {
    await User.deleteMany();

    console.log("Data destroyed");
    process.exit();
  } catch (e) {
    console.error(`Error: ${e}`);
    process.exit(1);
  }
};

destroyData();

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
