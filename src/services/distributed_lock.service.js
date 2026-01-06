import crypto from 'crypto'
import redis from '../config/redis.js';

const acquireLock=async(key,ttl=8000)=>{
    //generate lockId
    const lockId=crypto.randomUUID();

    const result= await redis.set(key,lockId,"NX","PX",ttl)

    if(result!="OK"){
        return null
    }

    return lockId
}

const releaseLock=async(key,lockId)=>{

  const lua = `
    if redis.call("get", KEYS[1]) == ARGV[1]
    then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `

   return redis.eval(lua,1,key,lockId)
}

export {acquireLock,releaseLock}