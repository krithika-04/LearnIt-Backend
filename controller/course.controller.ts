import { PrismaClient } from "@prisma/client";
import Koa from "koa";
const prisma = new PrismaClient();
let addCourse = async (ctx: Koa.Context) => {
  try {
    const course = ctx.request.body;
    const isEmpty = !Object.values(course).every(
      (attr) => attr !== null && attr !== ""
    );
    if (isEmpty) {
      ctx.status = 404;
      return (ctx.body = {
        message: "all details are required to add the course!",
        status: false,
      });
    }
    const user_id = ctx.params.id;
    const { id } = await prisma.teacher.findFirst({
      where: { userId: user_id },
      select: { id: true },
    });
    console.log(id);
    course.slug = ctx.request.body.course_name
      .toLowerCase()
      .replaceAll(" ", "-");
    course.teacherId = id;
    course.schedule_date = new Date(course.schedule_date);
    console.log(course);
    let courseData = await prisma.course.create({ data: course });
    return (ctx.body = {
      message: "Course created",
      status: true,
      data: courseData,
    });
  } catch (error) {
    ctx.status = 400;
    ctx.body = { message: error.message, status: false };
  }
};
let fetchCourseS = async (ctx: Koa.Context) => {
  try {
    // Returns all courses
    const courseData = await prisma.course.findMany({
      include: {
        Teacher: {},
      },
    });

    ctx.status = 200;
    return (ctx.body = {
      data: courseData,
      status: true,
    });
  } catch (error) {
    ctx.status = 400;
    console.log(error.message);
  }
};
let fetchCourseT = async (ctx: Koa.Context) => {
  try {
    const user_id = ctx.params.id;
    const courses = (
      await prisma.teacher.findFirst({
        where: {
          userId: user_id,
        },
        include: {
          courses: true,
        },
      })
    ).courses;

    console.log(courses);

    ctx.status = 200;
    return (ctx.body = {
      data: courses,
      status: true,
    });
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      error: error,
    };
    console.log(error.message);
  }
};
export { addCourse, fetchCourseS, fetchCourseT };
