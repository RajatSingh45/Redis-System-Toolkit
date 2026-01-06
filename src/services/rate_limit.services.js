import dotenv from 'dotenv'
dotenv.config()
import redis from '../config/redis.js'


const WINDOW_SIZE=Number(process.env.RATE_LIMIT_WINDOW_SIZE)
const MAX_REQUEST=Number(process.env.RATE_LIMIT_MAX_REQUEST)

const validateRateLimit=async(clientId)=>{
    const now=Math.floor(Date.now()/1000)

    const windowStart=Math.floor(now/WINDOW_SIZE)*WINDOW_SIZE
   const key=`rate_limit:${clientId}:${windowStart}`

   const reqCount=await redis.incr(key)

   //check if it is first rq in window

   if(reqCount===1){
    redis.expire(key,WINDOW_SIZE)
   }

   //validate max_request
   if(reqCount>MAX_REQUEST){
    return {
        allowed:false,
        remaining:0,
        resetAt:windowStart+WINDOW_SIZE
    }
   }

   return {
        allowed:true,
        remaining:MAX_REQUEST-reqCount,
        resetAt:windowStart+WINDOW_SIZE
   }
}

export default validateRateLimit