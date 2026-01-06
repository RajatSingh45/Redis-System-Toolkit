import express from 'express'
import clientAuth from '../middleware/clientsAuth.middleware.js'
import tokenBucketRateLimitMiddleware from '../middleware/rate_limit_token_bucket.middleware.js'
import { deleteUser, getRank, getScore, paginatedLeaderboard, postScore, resetBoard, topScore } from '../controller/leaderBoard.controller.js'

const leaderBoardRouter=express.Router()

leaderBoardRouter.post("/score",clientAuth,tokenBucketRateLimitMiddleware,postScore)

leaderBoardRouter.get("/score/:userId", clientAuth,tokenBucketRateLimitMiddleware, getScore);

leaderBoardRouter.get("/rank/:userId", clientAuth, tokenBucketRateLimitMiddleware, getRank);

leaderBoardRouter.get("/top", topScore);

leaderBoardRouter.get("/page", paginatedLeaderboard);

leaderBoardRouter.delete("/delete/:userId", clientAuth, deleteUser);

leaderBoardRouter.delete("/reset", clientAuth, resetBoard);

export default leaderBoardRouter
