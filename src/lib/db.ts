import { Redis } from '@upstash/redis'
import { db } from './imp'

export const redis = new Redis({
  url: db.UPSTASH_REDIS_REST_URL,
  token: db.UPSTASH_REDIS_REST_TOKEN
})
