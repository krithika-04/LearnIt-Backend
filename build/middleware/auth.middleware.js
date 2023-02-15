"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSigninS = exports.requireSigninT = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
let requireSigninT = async (ctx, next) => {
    let token = null;
    if (ctx.request.headers.authorization) {
        token = ctx.request.headers.authorization.slice(7);
    }
    console.log(token);
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.secret);
        console.log(decode);
        if (decode.user_type === 'T')
            await next();
        else {
            ctx.status = 401;
            return ctx.body = {
                message: "Not a teacher"
            };
        }
    }
    catch (error) {
        return ctx.body = { error: true, message: "Unauthorized access." };
    }
};
exports.requireSigninT = requireSigninT;
let requireSigninS = async (ctx, next) => {
    let token = null;
    console.log(ctx.request.headers);
    if (ctx.request.headers.authorization) {
        token = ctx.request.headers.authorization.slice(7);
    }
    console.log(token);
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.secret);
        console.log(decode);
        if (decode.user_type === 'S')
            await next();
        else {
            ctx.status = 401;
            return ctx.body = {
                status: false,
                message: "Not a Student"
            };
        }
    }
    catch (error) {
        return ctx.body = { error: true, message: "Unauthorized access." };
    }
};
exports.requireSigninS = requireSigninS;
//# sourceMappingURL=auth.middleware.js.map