"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const auth_controller_1 = require("../controller/auth.controller");
const router = new koa_router_1.default();
module.exports = app => {
    router.get("/api/hello", auth_controller_1.hello);
    router.post("/api/login", auth_controller_1.login);
    router.post("/api/register", auth_controller_1.register);
    // router.post("/api/profile",user.profile);
    router.post("/api/forgotPass", auth_controller_1.forgotPass);
    // router.post("/api/editProfile",user.editProfile);
    // router.post("/api/addProfile",user.addProfile);
    router.post("/api/resetPassword/:id/:token", auth_controller_1.resetPass);
    router.post("/api/verifyOtp", auth_controller_1.verifyOtp);
    app.use(router.routes());
};
//# sourceMappingURL=auth.routes.js.map