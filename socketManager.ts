export const Socket = (socket)=>{
    try {
        console.log("Connected")
        socket.on("code",(data:string,callback:void)=>{
            socket.broadcast.emit("code",data)
        })
    } catch (error) {
        console.log(error.message)
    }
}