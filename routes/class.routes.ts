import Koa from "koa";
import Router from "koa-router"
const router = new Router()
import { makeAttendance,leaveClass } from "../controller/class.controller";
import { requireSigninS } from "../middleware/auth.middleware";
module.exports = app => {
 
        router.post("/api/make-attendance/:id",requireSigninS,makeAttendance);
        router.post("/api/leave-class/:id",requireSigninS,leaveClass)
        app.use(router.routes())
        
      };