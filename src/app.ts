import { Logger } from "./lib/logger";
import express, { Request, Response } from "express";
import { middlewares } from "./middleware/errorHandler";
import { apiRoutes } from "./routes";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import expressSession from "express-session";
import rateLimit from "express-rate-limit";

/** init app */
const app = express();

const logger = new Logger();

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  skipSuccessfulRequests: true,
});

//  apply to all requests
app.use(limiter);

/** Secure the Express apps by setting various HTTP headers.*/
app.use(helmet());

app.use(
  expressSession({
    resave: false,
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    proxy: true,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use(logger.getRequestLogger());

/** Express 4.x middleware which sanitizes user-supplied data to prevent MongoDB Operator Injection. */
// To remove data that contains prohibited characters:
app.use(mongoSanitize());

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send("Hello");
});
app.use("/api", apiRoutes);

/** Handle Errors*/
app.use(logger.getRequestErrorLogger());

/** To handle not found apis*/
app.use(middlewares.notFoundHandler);

/** Error handler*/
app.use(middlewares.errorHandler);

export { app };
