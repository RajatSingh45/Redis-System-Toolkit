import redis from "../config/redis.js";

const testRedis = async (req, res) => {
  try {
    const pong = await redis.ping();
    if (!pong) {
      return res
        .status(400)
        .json({ sucess: false, message: "Redis is not working!" });
    }

    res.status(200).json({ success: true, redis: pong });
  } catch (error) {
    res.status(500).json({ error: "Redis not reachable" });
  }
};

const data = async (req, res) => {
  res.json({
    success: true,
    clientId: req.client,
    data: "This is protected data",
  });
};

const keys = async (req, res) => {
  const clientId = req.client;

  const keys = await redis.zrange(`client:${clientId}:apiKey`, 0, -1);

  res.json({
    clientId,
    activeKeys: keys.length,
    keys,
  });
};

export {testRedis,data,keys};
