import { socketIO } from "../index";
import Koa from 'koa'
const socketFunction = async (ctx:Koa.Context)=>{
    console.log("123")
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('join',({user_id,roomId})=>{
      
        socket.join(roomId)
    })
    socket.on('message', (data) => {
      socketIO.to(data.roomId).emit('messageResponse', data);
      console.log(data);
    });
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
  });
}

export {socketFunction}