import Koa from "koa";
import Router from "koa-router"
const router = new Router()
import { makeAttendance,leaveClass ,fetchAttendance} from "../controller/class.controller";
import { requireSigninS,requireSigninT } from "../middleware/auth.middleware";
module.exports = app => {
 
        router.post("/api/make-attendance/:id",requireSigninS,makeAttendance);
        router.post("/api/leave-class/:id",requireSigninS,leaveClass)
        router.get('/api/fetch-attendance/:id',requireSigninT,fetchAttendance)
        app.use(router.routes())
        
      };