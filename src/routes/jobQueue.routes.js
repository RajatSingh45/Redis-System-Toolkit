import express from "express";
import clientAuth from '../middleware/clientsAuth.middleware.js'
import tokenBucketRateLimitMiddleware from '../middleware/rate_limit_token_bucket.middleware.js'
import { createJob, jobStatus } from "../controller/jobQueue.controller.js";


const jobRouter = express.Router();

jobRouter.post("/create",clientAuth,createJob);
jobRouter.get("/status/:id", clientAuth, tokenBucketRateLimitMiddleware,jobStatus);

export default jobRouter;
