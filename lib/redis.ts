// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!); // Add your Redis URL in .env

export default redis;
