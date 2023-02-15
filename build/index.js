"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa2_cors_1 = __importDefault(require("koa2-cors"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_router_1 = __importDefault(require("koa-router"));
const config_1 = require("./config/config");
//import * as socketio from "socket.io";
//import {Socket} from './socketManager'
const router = new koa_router_1.default();
const app = new koa_1.default();
const PORT = config_1.config.port;
let http = require("http");
let httpServer = http.createServer(app);
//const io = require("socket.io")(httpServer);
app.use((0, koa_body_1.default)({
    // formidable:{uploadDir: './uploads'},
    multipart: true,
    urlencoded: true
}));
app.use((0, koa2_cors_1.default)({
    origin: "*"
}));
app.use((0, koa_logger_1.default)());
require("./routes/auth.routes")(app);
require("./routes/course.routes")(app);
//require("./routes/class.routes")(app);
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
    .listen(PORT, async () => {
    console.log(`server running on port ${PORT}`);
})
    .on("error", err => {
    console.error(err);
});
exports.default = app;
//# sourceMappingURL=index.js.map