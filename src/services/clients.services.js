import dotenv from 'dotenv'
dotenv.config()
import redis from "../config/redis.js";
import { generateToken, generateHashKey } from "../utils/keyGenerator.utils.js";

const period = Number(process.env.API_KEY_GRACE_PERIOD_SECONDS) ;
const keep = Number(process.env.API_KEY_RETENTION);

// console.log("period:",period)
// console.log("keep:",keep)

const createClientService = async ({ id, name }) => {
  const createdAt = Date.now();
  await redis.hset(`client:${id}:meta`, "name", name, "createdAt", createdAt);

  return { id, name, createdAt };
};

const enforceRetention = async (clientId) => {
  const totalMembers = await redis.zcard(`client:${clientId}:apiKey`);
  if (totalMembers <= keep) return;

  const toRemove = await redis.zrange(
    `client:${clientId}:apiKey`,
    0,
    totalMembers - keep - 1
  );

  if (!toRemove || toRemove.length === 0) return;

  const multi = redis.multi();

  toRemove.forEach((hashed) => {
    multi.del(`apiKey:${hashed}`);
    multi.zrem(`client:${clientId}:apiKey`, hashed);
  });

  await multi.exec();
};

const generateAndStoreApiKey = async (clientId) => {
  const token = generateToken();
  const hashed = generateHashKey(token);
  const now = Math.floor(Date.now() / 1000);

  const multi = redis.multi();

  multi.set(`apiKey:${hashed}`, clientId);
  console.log("Saving apiKey:", `apiKey:${hashed}`);

  if (period > 0) {
    multi.expire(`apiKey:${hashed}`, period);
  }

  multi.zadd(`client:${clientId}:apiKey`, now, hashed);

  await multi.exec();



  //check whether the key is not exceeding the retention value that is 2
  await enforceRetention(clientId);

  return token;
};

const keyRotation = async ( id ) => {
  return await generateAndStoreApiKey(id);
};

const getClient = async (id) => {
  const client = await redis.hgetall(`client:${id}:meta`);

  if(!client){
    // console.log("client in service:",client)
    return null
  }

  return { id, client };
};

const validateApiKey = async (token) => {
  if (!token) return null;

  // console.log("token:",token)

  const hashed = generateHashKey(token);
  const client = await redis.get(`apiKey:${hashed}`);

  if (!client){
    // console.log("client in validateApiKey:",client)
   return null;
  }
    
  return client;
};

export {
  createClientService,
  generateAndStoreApiKey,
  enforceRetention,
  validateApiKey,
  keyRotation,
  getClient,
};
