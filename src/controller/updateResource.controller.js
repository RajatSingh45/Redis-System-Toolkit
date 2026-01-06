import redis from "../config/redis.js"

const updateResource=async(req,res)=>{
    const currentValue=Number(await redis.get("shared:counter"))||0;
    const updateValue=currentValue+1;

    //setting timeout for slowing the execution time 

    await new Promise((r)=>setTimeout(r,5000))

    await redis.set("shared:counter",updateValue)

    return res.status(200).json({
        message:"Counter updated successfully",
        success:true,
        value:updateValue, 
    })
}

export default updateResource