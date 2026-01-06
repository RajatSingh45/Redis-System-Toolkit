import { randomUUID } from "crypto";
import redis from "../config/redis.js";

const QUEUE = "queue:jobs";
const DLQ = "queue:dlq";
const PROCESSING = "queue:processing";
const MAX_RETRIES = 3;

const enqueue = async (payload) => {
  const id = randomUUID();

  await redis.hset(`job:${id}`, {
    status: "queued",
    payload: JSON.stringify(payload),
    retries: 0,
  });

  await redis.lpush(QUEUE, id);

  return id;
};

const getJobStatus = async (id) => {
  return await redis.hgetall(`job:${id}`);
};

const processJob = async (worker = "worker-1") => {
    while(true){
   const jobId=await redis.brpoplpush(QUEUE,PROCESSING,0)

  await redis.hset(`job:${jobId}`, {
    status: "processing",
    worker: worker,
  });

  const job = await redis.hgetall(`job:${jobId}`);

  const retries = Number(job.retries || 0);

  try {
    const parsedPayload = JSON.parse(job.payload);
    console.log(`processing ${jobId}:`, parsedPayload);
    await fakeTask();

    await redis.hset(`job:${jobId}`, {
      status: "completed",
    });
  } catch (error) {
    console.log(`Error processing job ${jobId}:`, error?.message || error || 'Unknown error');
    const newRetries = retries + 1;
    if (newRetries > MAX_RETRIES) {
      await redis.hset(`job:${jobId}`, { status: "dead", retries: newRetries });
      await redis.lpush(DLQ, jobId);
      console.log(`job ${jobId} moved to DLQ after ${newRetries} retries`);
    } else {
      await redis.hset(`job:${jobId}`, { retries: newRetries });
      await redis.lpush(QUEUE, jobId);
    }
  }
}
};

const fakeTask=()=>{
    return new Promise((resolve,reject)=>{
        const done=Math.random()>0.3;
        setTimeout(()=>{done?resolve():reject(new Error('Task failed'))},500)
    })
}

export {enqueue,getJobStatus,processJob}
