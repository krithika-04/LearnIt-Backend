"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = exports.verifyOtp = exports.resetPass = exports.forgotPass = exports.register = exports.logout = exports.login = void 0;
const client_1 = require("@prisma/client");
const koa_1 = __importDefault(require("koa"));
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const nodemailer_1 = __importDefault(require("nodemailer"));
//const nodemailer = require("nodemailer");
require("dotenv").config();
const key = process.env.secret;
const app = new koa_1.default();
const transporter = nodemailer_1.default.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.mailid,
        pass: "black&white12",
    },
});
// client.messages
//       .create({body: 'Hi there', from: '+15103694272', to: '+919361422286'})
//       .then(message => console.log(message.sid));
let login = async (ctx) => {
    try {
        console.log(ctx.request.body.email);
        await prisma.user.findUnique({
            where: { email: ctx.request.body.email }
        })
            .then(async (user) => {
            // return res.json(user)
            if (!user) {
                ctx.status = 404;
                return ctx.body = {
                    message: "Email is not found.",
                    success: false,
                };
            }
            // If there is user we are now going to compare the password
            const isMatch = await bcryptjs_1.default.compare(ctx.request.body.password, user.password);
            if (isMatch) {
                // User's password is correct and we need to send the JSON Token for that user
                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    user_type: user.user_type
                };
                const token = jsonwebtoken_1.default.sign(payload, key, {
                    expiresIn: 604800,
                });
                const response = {
                    status: true,
                    token: `Bearer ${token}`,
                    user: user,
                    message: "Hurray! You are now logged in.",
                };
                ctx.cookies.set("token", token
                //,{httpOnly:true}
                );
                ctx.status = 202;
                return ctx.body = response;
            }
            else {
                ctx.status = 401;
                ctx.body = {
                    message: "Incorrect password.",
                    status: false,
                };
            }
        });
    }
    catch (error) {
        // console.log("hey")
        console.log(error.message);
    }
};
exports.login = login;
let register = async (ctx) => {
    try {
        const user_data = ctx.request.body;
        // Check for the unique Username
        console.log(user_data);
        const chk_email = await prisma.user.findUnique({
            where: { email: user_data.email },
        });
        // Check for the Unique Email
        if (chk_email) {
            ctx.status = 409;
            return ctx.body = {
                message: "Email is already registered. Did you forgot your password.",
                status: false,
            };
        }
        if (user_data.password != user_data.c_password) {
            ctx.status = 409;
            return ctx.body = {
                message: "Password and confirm password does not match",
                status: false,
            };
        }
        // The data is valid and new we can register the user
        //Hash pass
        const salt = await bcryptjs_1.default.genSaltSync(10);
        const password = await ctx.request.body.password;
        const hash = await bcryptjs_1.default.hash(password, salt);
        user_data.password = hash;
        delete user_data.c_password;
        let data = await prisma.user
            .create({ data: user_data });
        if (data.user_type == "S") {
            let student = await prisma.student.create({ data: { userId: data.id } });
        }
        else if (data.user_type == "T") {
            let teacher = await prisma.teacher.create({ data: { userId: data.id } });
        }
        console.log(data !== undefined);
        if (data !== undefined) {
            const payload = {
                id: data.id,
                username: data.username,
                email: data.email,
                user_type: data.user_type
            };
            const token = jsonwebtoken_1.default.sign(payload, key, {
                expiresIn: 604800,
            });
            const response = {
                status: true,
                token: `Bearer ${token}`,
                user: data,
                message: "Hurry! You are now signed up.",
            };
            ctx.status = 201;
            // ctx.body={
            //   status:"success",
            //   message:"registration successful",
            //   response:response
            // }
            ctx.body = response;
            console.log(ctx.body);
        }
    }
    catch (error) {
        ctx.status = 400;
        ctx.body = { message: error.message };
    }
};
exports.register = register;
let logout = async (ctx) => {
    try {
        ctx.cookies.set("token");
        return ctx.body = { message: "user signed out successfully" };
    }
    catch (error) {
        console.log(error);
    }
};
exports.logout = logout;
let forgotPass = async (ctx) => {
    try {
        const userMail = ctx.request.body.email;
        const user_data = await prisma.user.findUnique({
            where: { email: userMail }
        });
        console.log(user_data == null);
        //chk user exist or not
        if (user_data == null) {
            ctx.status = 404;
            return ctx.body = {
                message: "Email not registred.Please register to continue",
                success: false,
            };
        } //user exist and create one time link valid for 15 mins
        else {
            await prisma.forgotPass.deleteMany({ where: { userId: user_data.id } });
            const fp_secret = key + user_data.password;
            const payload = {
                email: user_data.email,
                id: user_data.id,
            };
            //  res.json(user_data.email)
            const token = jsonwebtoken_1.default.sign(payload, fp_secret, { expiresIn: "15m" });
            const link = `http://localhost:5173/resetPassword/${user_data.id}/${token}`;
            console.log(link);
            console.log(user_data.email);
            const options = {
                from: process.env.mailid,
                to: user_data.email,
                subject: "Password reset request",
                html: `Password reset request has been initiated please click on the link below to reset the password ${link} . Note: The link will be active for only 15 mins`,
            };
            //   let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false,digits:true });
            //   const options = {
            //     from: process.env.mailid,
            //     to: user_data.email,
            //     subject: "Password reset request",
            //     html: `Password reset request has been initiated please enter the otp below to reset the password <b>${otp}</b>. Note: The otp will be active for only 1 hour`,
            //   };
            await new Promise((resolve, reject) => {
                transporter.sendMail(options, function (err, info) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        ctx.status = 400;
                        return ctx.body = {
                            message: "Couldn't send mail",
                            success: false,
                        };
                        return;
                    }
                    console.log("hyy");
                    resolve();
                });
            });
            //  const saltrounds = 10;
            //  const hashedotp = await bcrypt.hash(otp, saltrounds);
            //  const date = new Date();
            //  date.setMinutes(date.getMinutes() + 10);
            //  console.log(date);
            //  const verifiData = {
            //   userId: user_data.id,
            //   otp: hashedotp,
            //   expiresAt: date,
            // };
            // await prisma.forgotPass.create({data:verifiData})
            return ctx.body = {
                message: "Password reset link has been sent to your email",
                success: true,
            };
        }
    }
    catch (error) {
        ctx.status = 400;
        ctx.body = { message: error.message };
    }
};
exports.forgotPass = forgotPass;
let resetPass = async (ctx) => {
    try {
        const { id, token } = ctx.params;
        console.log(id);
        var password = ctx.request.body.password;
        var c_password = ctx.request.body.cpassword;
        if (password != c_password) {
            ctx.status = 409;
            return ctx.body = {
                message: "Password and confirm password does not match",
                success: false,
            };
        }
        //  var c_password = req.body.c_password;
        const user_data = await prisma.user.findUnique({
            where: { id: id }
        });
        console.log(user_data);
        const secret = key + user_data.password;
        try {
            const payload = jsonwebtoken_1.default.verify(token, secret);
            const salt = await bcryptjs_1.default.genSaltSync(10);
            await bcryptjs_1.default.hash(password, salt, async (err, hash) => {
                if (err)
                    throw err;
                password = hash;
                const update = await prisma.user.update({
                    where: {
                        id: id
                    },
                    data: {
                        password: password
                    }
                });
                console.log(update);
            });
            return ctx.body = {
                message: "Password reset successful",
                success: true,
            };
        }
        catch (error) {
            ctx.status = 400;
            console.log(error.message);
            return ctx.body = {
                message: error.message,
                success: false,
            };
        }
    }
    catch (error) {
        ctx.status = 400;
        console.log(error);
        ctx.body = { message: error.message };
    }
};
exports.resetPass = resetPass;
let verifyOtp = async (ctx) => {
    try {
        let { user_id, otp } = ctx.request.body;
        console.log("hello");
        if (!user_id || !otp)
            throw new Error("Otp details are empty");
        else {
            const verifiDetails = await prisma.forgotPass.findFirst({
                where: { userId: user_id },
            });
            if (verifiDetails == null) {
                //no records
                throw new Error("Your account details doesn't or have been verified already.Please sign up or login");
            }
            else {
                const { expiresAt } = verifiDetails;
                const hashedotp = verifiDetails.otp;
                const today = new Date();
                console.log(expiresAt, today);
                if (expiresAt < today) {
                    //otp expired
                    await prisma.forgotPass.delete({ where: { id: verifiDetails.id } });
                    throw new Error("Your otp expired please request again");
                }
                else {
                    console.log(hashedotp);
                    const validotp = await bcryptjs_1.default.compare(otp, hashedotp);
                    if (!validotp)
                        throw new Error("Invalid otp");
                    else {
                        //sucess
                        console.log("hey");
                        await prisma.forgotPass.delete({ where: { id: verifiDetails.id } });
                        return ctx.body = {
                            status: true,
                            message: "otp verifed succesfully",
                        };
                    }
                }
            }
        }
    }
    catch (error) {
        ctx.body = {
            status: false,
            message: error.message,
        };
    }
};
exports.verifyOtp = verifyOtp;
// exports.profile = async (ctx:any)=>{
//   try {
//     const id = ctx.request.body.id;
//     console.log(id)
//     const user_data = await prisma.student.findUnique({where:{id:id}})
//     return ctx.body={
//       name:user_data.name,
//       country:user_data.country
//     }
//   } catch (error) {
//     return ctx.body={
//       "error":error
//     }
//   }
// }
// exports.editProfile = async (ctx:any)=>{
//   try {
//     const update_data = ctx.request.body;
//     const update = await prisma.address.update({
//       where:{id:update_data.id},
//       data:update_data
//     })
//     return ctx.body={
//       "message":"Address update successful",
//       "data":update
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }
// exports.deleteProfile = async (ctx:any)=>{
//   try {
//     const {id,stuId} = ctx.request.body;
//     const deleteAddress = await prisma.address.deleteMany({
//       where:{id:id,studentId:stuId}
//     })
//     return ctx.body={
//       "data":deleteAddress,
//       "message":"deletion successful"
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }
// exports.addProfile = async(ctx:any)=>{
//   try {
//     const {studentId,...addData} = ctx.request.body;
//     const add =  await  prisma.address.create({
//       data: {...addData,
//         student: { 
//            connect: {
//             id: studentId
//            }
//         }
//       }
//     })
//     return ctx.body={
//       "data":add,
//       "message":"Address added"
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }
let hello = async (ctx) => {
    ctx.body = { "message": "welcome!!!" };
};
exports.hello = hello;
//# sourceMappingURL=auth.controller.js.map