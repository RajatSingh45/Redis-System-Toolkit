import redis from "../config/redis.js"

const GLOBAL="global:leaderboard"
const addOrUpdateUser=async(userId,score)=>{
    const newUser=await redis.zadd(GLOBAL,score,userId)

    return newUser;
}

const getUserScore=async(userId)=>{
    const userScore=await redis.zscore(GLOBAL,userId)

    return userScore?Number(userScore):null
}

const getTopScoreUser=async(limit)=>{

    return await redis.zrevrange(GLOBAL,0,limit-1,"WITHSCORES")

}

const getUserRank=async(userId)=>{
    const useRank=await redis.zrevrank(GLOBAL,userId)

    return useRank?useRank+1:null
}

const leaderboardPage=async(page,size)=>{
    const start=(page-1)*size;
    const end=start+size-1;

    return await redis.zrevrange(GLOBAL,start,end,"WITHSCORES")
}

const removeUser=async(userId)=>{
    await redis.zrem(GLOBAL,userId)
}

const resetLeaderBoard=async()=>{
    await redis.del(GLOBAL);
}

export {addOrUpdateUser,getTopScoreUser,getUserRank,getUserScore,leaderboardPage,removeUser,resetLeaderBoard}