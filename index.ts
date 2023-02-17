import Koa from "koa";
import bodyParser from "koa-body";
import cors from "koa2-cors";
import logger from "koa-logger";
import Router from "koa-router";
import {config} from "./config/config"
//import * as socketio from "socket.io";
//import {Socket} from './socketManager'
const router = new Router()
const app = new Koa()
const PORT = config.port;
let http = require("http")
let httpServer = http.createServer(app)
//const io = require("socket.io")(httpServer);
app.use (bodyParser({
 // formidable:{uploadDir: './uploads'},
  multipart: true,
  urlencoded: true
}));
app.use(
  cors({
    origin:"*"
  })
);
app.use(logger())
require("./routes/auth.routes")(app);
require("./routes/course.routes")(app);
require("./routes/class.routes")(app);
//require("./routes/link.routes")(app);

//io.on("connection",Socket)
//declare function require(name:string);
// const user = require("./middleware/index");
// router.get("/",async (ctx)=>{
//   try {
//     ctx.body ={
//       status:"success"
//     }
//   } catch (error) {
//     console.log(error)
//   }
// });
//app.use(router.routes())
const server = app
  .listen(PORT, async()=>{
    console.log(`Server running on port ${PORT}`)
  })
   .on ("error",err=>{
    console.error(err)
   }
  )
 
export default app;
