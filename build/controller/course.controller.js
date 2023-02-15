"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCourseT = exports.fetchCourseS = exports.addCourse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let addCourse = async (ctx) => {
    try {
        const course = ctx.request.body;
        const user_id = ctx.params.id;
        const { id } = await prisma.teacher.findFirst({ where: { userId: user_id }, select: { id: true } });
        console.log(id);
        course.slug = ctx.request.body.course_name.toLowerCase().replaceAll(" ", "-");
        course.teacherId = id;
        course.schedule_date = new Date(course.schedule_date);
        console.log(course);
        let courseData = await prisma.course.create({ data: course });
        return ctx.body = { message: "Course created", status: true, data: courseData };
    }
    catch (error) {
        ctx.body = { message: error.message };
    }
};
exports.addCourse = addCourse;
let fetchCourseS = async (ctx) => {
    try {
        const courseData = await prisma.course.findMany({
            // Returns all courses
            include: {
                Teacher: {}
            },
        });
        ctx.status = 200;
        return ctx.body = {
            data: courseData,
            status: true
        };
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.fetchCourseS = fetchCourseS;
let fetchCourseT = async (ctx) => {
    try {
        const user_id = ctx.params.id;
        const { id } = await prisma.teacher.findFirst({ where: { userId: user_id }, select: { id: true } });
        const courseData = await prisma.course.findMany({
            // Returns all courses
            where: { teacherId: id },
            include: {
                Teacher: {}
            },
        });
        ctx.status = 200;
        return ctx.body = {
            data: courseData,
            status: true
        };
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.fetchCourseT = fetchCourseT;
//# sourceMappingURL=course.controller.js.map