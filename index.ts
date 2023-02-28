import Koa from "koa";
import bodyParser from "koa-body";
import cors from "koa2-cors";
import logger from "koa-logger";
import Router from "koa-router";
import {config} from "./config/config"
import { createServer } from "http";
import { Server } from "socket.io";
const router = new Router()
const app = new Koa()
const PORT = config.port;
let httpServer = createServer(app.callback());
const socketIO = new Server(httpServer, {
  cors: {
      origin: "*"
  }
});
app.use (bodyParser({
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
const server =httpServer
  .listen(PORT, async()=>{
    console.log(`Server running on port ${PORT} 😇`)
  })
   .on ("error",err=>{
    console.error(err)
   }
  )
 
export default app;
