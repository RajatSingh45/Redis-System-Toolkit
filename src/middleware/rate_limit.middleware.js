import dotenv from 'dotenv'
dotenv.config()
import validateRateLimit from "../services/rate_limit.services.js";

const MAX_REQUEST = Number(process.env.RATE_LIMIT_MAX_REQUEST);

const rateLimitMiddlewar = async (req, res, next) => {
  try {
    const clientId = req.client;

    if (!clientId) {
      return res.status(400).json({ message: "Not Authenticated" });
    }

    const result = await validateRateLimit(clientId);

    res.set({
      "X-RateLimit-Limit": MAX_REQUEST,
      "X-RateLimit-Remaining": result.remaining,
      "X-RateLimit-ResetAt": result.resetAt,
    });

    if (!result.allowed) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        retryAfter: result.resetAt,
      });
    }

    next()
  } catch (error) {
    console.log("Rate Limit Error:",error.message)
    return res.status(500).json({message:"Internal Server Error"})
  }
};


export default rateLimitMiddlewar
