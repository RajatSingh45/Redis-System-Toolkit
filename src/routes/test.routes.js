import express from 'express'
import {testRedis, data, keys } from '../controller/test.controller.js'
import clientAuth from '../middleware/clientsAuth.middleware.js'
import tokenBucketRateLimitMiddleware from '../middleware/rate_limit_token_bucket.middleware.js'

const testRouter=express.Router()

testRouter.get("/test",testRedis)
testRouter.get("/protectedData",clientAuth,tokenBucketRateLimitMiddleware,data)
testRouter.get("/keys",clientAuth,keys)

export default testRouter