import {
  acquireLock,
  releaseLock,
} from "../services/distributed_lock.service.js";

const distributedLockMiddleware = (ttl = 8000) => {
  return async (req, res, next) => {
    const lockKey = "lock:resource:shared_counter";

    const lockId = await acquireLock(lockKey, ttl);

    if (!lockId) {
      return res.status(423).json({
        error: "Resource is locked at this moment, try again later",
      });
    }

    req.lock = { key: lockKey, lockId };

    res.on("finish", async () => {
      await releaseLock(lockKey, lockId);
      console.log(`Lock ${lockKey} released`);
    });

    next();
  };
};

export default distributedLockMiddleware;
