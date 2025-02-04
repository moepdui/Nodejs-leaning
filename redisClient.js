const redis = require('redis');

const redisClient = redis.createClient({
  socket: {
    host: 'redis',
    port: 6379,
  },
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
})();

module.exports = redisClient;
