import { Router } from "express";
import { authRouter } from "./authRouter";

const routes = Router();

routes.use("/v1/user", authRouter);

export { routes as apiRoutes };
