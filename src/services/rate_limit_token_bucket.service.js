import dotenv from 'dotenv'
dotenv.config()
import redis from '../config/redis.js'

const BUCKET_CAPACITY=Number(process.env.TOKEN_BUCKET_CAPACITY);
const BUCKET_REFILL_RATE=Number(process.env.TOKEN_BUCKET_REFILL_RATE);

const validateRateLimitUsingTokenBucket=async(clientId)=>{
    const key=`rate_limit:token_bucket:${clientId}`

    const now=Date.now()

    const luaScript=`
      local bucket=redis.call("HGETALL",KEYS[1])

      local remainingTokens=tonumber(bucket[2]) or ${BUCKET_CAPACITY}
      local lastRefill=tonumber(bucket[4]) or ${now}

      local bucket_capacity=${BUCKET_CAPACITY}
      local refillRate=${BUCKET_REFILL_RATE}

      local timeElapsed=(${now}-lastRefill)/1000
      local refill=math.floor(timeElapsed*refillRate)

      remainingTokens=math.min(bucket_capacity,remainingTokens+refill)

      if remainingTokens<1 then
        return {0,remainingTokens}
      end

      remainingTokens=remainingTokens-1

      redis.call("HSET", KEYS[1],
      "tokens",remainingTokens,
      "lastRefill",${now}
      )

      return {1,remainingTokens}
    `

    const result=await redis.eval(luaScript,1,key)

    const allowed=result[0]

    if(allowed===0){
        return {
            allowed:false,
            remainingTokens:result[1]
        }
    }

    return {
        allowed:true,
        remainingTokens:result[1]
    }
}

export default validateRateLimitUsingTokenBucket