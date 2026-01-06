import redis from "../config/redis.js";

const sessionTTL = 60 * 30;
const createSessionService = async (data) => {
  const sessionId = crypto.randomUUID();

  await redis.set(
    `session:${sessionId}`,
    JSON.stringify({ ...data, createdAt: Date.now() }),
    "EX",
    sessionTTL
  );

  return sessionId;
};

const getSessionServices = async (sessionId) => {
  const session = await redis.get(`session:${sessionId}`);

  return session ? JSON.parse(session) : null;
};

const deleteSessionService = async (sessionId) => {
  await redis.del(`session:${sessionId}`);
};

export { createSessionService, getSessionServices, deleteSessionService };
