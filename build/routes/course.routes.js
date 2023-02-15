"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_router_1 = __importDefault(require("koa-router"));
const course_controller_1 = require("../controller/course.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = new koa_router_1.default();
module.exports = app => {
    router.get("/api/getAllcourses", auth_middleware_1.requireSigninS, course_controller_1.fetchCourseS);
    router.get("/api/getAllcourses/:id", auth_middleware_1.requireSigninT, course_controller_1.fetchCourseT);
    router.post("/api/addCourse/:id", auth_middleware_1.requireSigninT, course_controller_1.addCourse); // id => instructor id
    app.use(router.routes());
};
//# sourceMappingURL=course.routes.js.map