const CircuitBreaker = require('opossum');

async function redisSetWithBreaker(redisClient, key, value, ttl) {
  return redisClient.set(key, value, 'EX', ttl);
}

const breakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 5000,
};

const breaker = new CircuitBreaker(redisSetWithBreaker, breakerOptions);

module.exports = breaker;
