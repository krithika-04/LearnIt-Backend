import { PrismaClient} from "@prisma/client";
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'

import Koa from 'koa'
require("dotenv").config();
let requireSigninT = async (ctx:Koa.Context,next:any)=>
{
  let token = null;
  if (ctx.request.headers.authorization) {
    token = ctx.request.headers.authorization.slice(7);
  }
  console.log(token);
  try {
    const decode= jwt.verify(token, process.env.secret);
    console.log(decode)
  
  if(decode.user_type==='T')
     await next();
      else
      {
        ctx.status=401
      return  ctx.body={
          message:"Not a teacher"
        }
      }
  } catch (error) {
    return ctx.body={ error: true, message: "Unauthorized access." };
  }
 
  
}
let requireSigninS = async (ctx:Koa.Context,next:any)=>
{
  let token = null;
  console.log(ctx.request.headers)
  
  if (ctx.request.headers.authorization) {
    token = ctx.request.headers.authorization.slice(7);
  }
  console.log(token);
  try {
    const decode=  jwt.verify(token, process.env.secret);
  console.log(decode)
  if(decode.user_type==='S')
  await  next();
     else
     {
       ctx.status=401
     return  ctx.body={
         status:false,
         message:"Not a Student"
       }
     }
  } catch (error) {
    ctx.status=400;
    return ctx.body={ error: true, message: "Unauthorized access." };
  }
 
}
// export const isInstructor = async (req, res, next) => {
//   try {
//     // console.log(req.params)

//     const instructor = await Instructor.findByPk(req.params.id).then(
//       (result) => {
//         // console.log(result)
//         if (result != null) {
//           next();
//         } else res.status(403).json({ message: "not an instructor" });
//       }
//     );
//   } catch (error) {
//     console.log("Error:", error);
//   }
// };
export {requireSigninT,requireSigninS}
