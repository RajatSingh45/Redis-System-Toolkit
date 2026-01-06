import express from 'express'
import clientAuth from '../middleware/clientsAuth.middleware.js'
import tokenBucketRateLimitMiddleware from '../middleware/rate_limit_token_bucket.middleware.js'
import distributedLockMiddleware from '../middleware/distributed_lock.middleware.js'
import updateResource from '../controller/updateResource.controller.js'


const updateResourceRouter=express.Router()

updateResourceRouter.post("/update/:id",clientAuth,tokenBucketRateLimitMiddleware,distributedLockMiddleware(8000),updateResource)

export default updateResourceRouter