import express from 'express'
import clientAuth from '../middleware/clientsAuth.middleware.js'
import { createClient, getClientInfo, rotateKey } from '../controller/clients.controller.js'
import rateLimitMiddlewar from '../middleware/rate_limit.middleware.js'
import tokenBucketRateLimitMiddleware from '../middleware/rate_limit_token_bucket.middleware.js'
import distributedLockMiddleware from '../middleware/distributed_lock.middleware.js'

const clientRouter=express.Router()

clientRouter.post("/createClient",createClient)
clientRouter.post("/rotateKey/:id",clientAuth,tokenBucketRateLimitMiddleware, rotateKey)
clientRouter.get("/client/:id",clientAuth,tokenBucketRateLimitMiddleware,getClientInfo)


export default clientRouter