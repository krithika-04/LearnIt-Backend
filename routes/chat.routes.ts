import Koa from "koa";
import Router from "koa-router"
import { socketFunction } from "../controller/chat.controller";
const router = new Router()
module.exports = app => {
 
router.get("/api/socket",socketFunction)
   
    app.use(router.routes())
    
  };