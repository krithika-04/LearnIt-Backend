import Koa from "koa";
import Router from "koa-router"
import {login,logout,register,forgotPass,resetPass,verifyOtp,hello} from "../controller/auth.controller"
const router = new Router()
module.exports = app => {
 
router.get("/api/hello",hello)
    router.post("/api/login",login);
    router.post("/api/register",register);
    // router.post("/api/profile",user.profile);
     router.post("/api/forgotPass",forgotPass);
    // router.post("/api/editProfile",user.editProfile);
    // router.post("/api/addProfile",user.addProfile);
    router.post("/api/resetPassword/:id/:token",resetPass);
    router.post("/api/verifyOtp", verifyOtp);
    app.use(router.routes())
    
  };