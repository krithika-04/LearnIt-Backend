// import {redisClient} from '../config/redis'

// let getCallid =async (key,value) => {
//   return new Promise((resolve, reject) => {
//     redisClient.GET(key, (err, res) => {
//       if (err) {
//         reject(err);
//       }
//       resolve(JSON.parse(res));
//     });
//   });
// }
// let saveCallid =async (key:any,value:any) => {
//     return new Promise<void>((resolve, reject) => {
//         redisClient.SET(key,JSON.stringify(value), 86400, (err: any, res: void | PromiseLike<void>)=> {
//           if (err) {
//             reject(err);
//           }
//           resolve(res);
//         });
//       });
// }
// export {getCallid,saveCallid}