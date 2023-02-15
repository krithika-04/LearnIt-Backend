import Koa from "koa";
import Router from "koa-router"
import {addCourse,fetchCourseS,fetchCourseT} from "../controller/course.controller"
import { requireSigninT,requireSigninS } from "../middleware/auth.middleware";
const router = new Router()
module.exports = app => {
  router.get("/api/getAllcourses",requireSigninS,fetchCourseS)
  router.get("/api/getAllcourses/:id",requireSigninT,fetchCourseT)
  router.post("/api/addCourse/:id",requireSigninT,addCourse); // id => instructor id
    
    app.use(router.routes())
  };