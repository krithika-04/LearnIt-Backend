import {PrismaClient} from "@prisma/client";
import Koa from 'koa'
const prisma = new PrismaClient()
const makeAttendance=async (ctx:Koa.Context) => {
   try {
    const attendanceData= ctx.request.body;
    const courseId = attendanceData.courseId;
    const user_id =ctx.params.id ;
    const {id} = await prisma.student.findFirst({where:{userId:user_id},select:{id:true}})
    attendanceData.join_time = new Date();
    console.log("date ",new Date())
    const isExist = await prisma.attendence.findFirst({where:{AND:[{studentId:id,courseId:courseId}]}})
    if(isExist){
        let updateData = await prisma.attendence.update({where:{id:isExist.id},data:{...attendanceData}})

        return ctx.body={
            message:"attendance marked!!",
            status:true,
            data:updateData
        }
    }
    else{
        attendanceData.studentId = id;
        let addData = await prisma.attendence.create({data:attendanceData})
        return ctx.body={
            message:"attendance marked!!",
            status:true,
            data:addData
        }
    }
   } catch (error) {
    ctx.status=400;
    ctx.body={
        status:false,
        error:error.message
    }
   }
}
const leaveClass =async (ctx:Koa.Context) => {
    try {
        const attendanceData= ctx.request.body;
        const courseId = attendanceData.courseId;
        const user_id =ctx.params.id ;
        const {id} = await prisma.student.findFirst({where:{userId:user_id},select:{id:true}})
        const isExist = await prisma.attendence.findFirst({where:{AND:[{studentId:id,courseId:courseId}]}})
        if(isExist){
            const left_time = new Date();
            const duration = Math.floor(((left_time.getTime() - isExist.join_time.getTime())/1000)/60);
            const prevDuration = isExist.duration;
            console.log("prev ",prevDuration);
            console.log("curr ",duration);
            attendanceData.duration=prevDuration+duration;
            let updateData = await prisma.attendence.update({where:{id:isExist.id},data:{...attendanceData}})
    
            return ctx.body={
                message:"duration calculated!!",
                status:true,
                data:updateData
            }
        }
        else{

            return ctx.body={
                message:"your attendance is not yet marked!!",
                status:false
            }
        }
       } catch (error) {
        ctx.status=400;
        ctx.body={
            status:false,
            error:error.message
        }
       }    
}
const fetchAttendance=async (ctx:Koa.Context) => {
    try {
     const course_id =ctx.params.id ;
     const attendanceData = await prisma.attendence.findMany({
        where:{
            courseId:course_id
        }
     })
     return ctx.body={
        message:"fetch attendance data",
        status:true,
        data:attendanceData
     }
     
    } catch (error) {
     ctx.status=400;
     ctx.body={
         status:false,
         error:error.message
     }
    }
 }
export {makeAttendance,leaveClass,fetchAttendance}