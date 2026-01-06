import dotenv from 'dotenv'
dotenv.config()
import validateRateLimitUsingTokenBucket from "../services/rate_limit_token_bucket.service.js";

const BUCKET_CAPACITY=Number(process.env.TOKEN_BUCKET_CAPACITY);
const BUCKET_REFILL_RATE=Number(process.env.TOKEN_BUCKET_REFILL_RATE);

const tokenBucketRateLimitMiddleware = async (req, res, next) => {
  try {
    const clientId = req.client;

    if (!clientId) {
      return res.status(400).json({ message: "Not Authenticated" });
    }

    const result = await validateRateLimitUsingTokenBucket(clientId);

    res.set({
      "X-Bucket_Capacity": BUCKET_CAPACITY,
      "X-RemainingTokens": result.remainingTokens,
      "X-Bucket-Refill-Rate": BUCKET_REFILL_RATE,
    });

    if(!result.allowed){
        return res.status(429).json({
        error: "Rate limit exceeded",
        retryAfter: Math.ceil(1 / BUCKET_REFILL_RATE),
      });
    }

    next()
  } catch  (error) {
    console.log("Rate Limit Error:",error.message)
    return res.status(500).json({message:"Internal Server Error"})
  }
};

export default tokenBucketRateLimitMiddleware
