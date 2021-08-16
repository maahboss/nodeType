import mongoose from "mongoose";
import { Logger } from "../lib/logger";

const logger = new Logger();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.DB_CONNECTION as string,
      {
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true,
      }
    );

    logger.log("info", `MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    logger.log("error", `Error : ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
