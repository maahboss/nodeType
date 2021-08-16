require("dotenv").config();
import connectDB from "./database/dbConfig";
import { app } from "./app";
import { Logger } from "./lib/logger";

const logger = new Logger();

/** Connect to DB */
connectDB()
  .then(() => {
    app.listen(process.env.PORT || "3000", () =>
      logger.log("info", `server running on port ${process.env.PORT || "3000"}`)
    );
  })
  .catch((error) => logger.log("error", error));
