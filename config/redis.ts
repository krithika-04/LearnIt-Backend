import redis from 'redis';

let redisClient = redis.createClient()
redisClient.on("error",(error)=>{
console.log(error)
})
export {redisClient}