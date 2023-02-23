import Koa from "koa";
import bodyParser from "koa-body";
import cors from "koa2-cors";
import logger from "koa-logger";
import Router from "koa-router";
import {config} from "./config/config"
import { createServer } from "http";
import { Server } from "socket.io";
//import * as socketio from "socket.io";
//import {Socket} from './socketManager'
const router = new Router()
const app = new Koa()
const PORT = config.port;
let httpServer = createServer(app.callback());
const socketIO = new Server(httpServer, {
  cors: {
      origin: "http://localhost:5173"
  }
});
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
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
    console.log(data);
  });
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});
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
const server =httpServer
  .listen(PORT, async()=>{
    console.log(`Server running on port ${PORT}`)
  })
   .on ("error",err=>{
    console.error(err)
   }
  )
 
export default app;
