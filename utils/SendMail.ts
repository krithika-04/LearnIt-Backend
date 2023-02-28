import nodemailer from "nodemailer" 
const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.mailid,
      pass: "black&white12",
    },
  });
const sendMail=async (options,ctx)=>{
    await new Promise<void>((resolve,reject)=>{
        transporter.sendMail(options, function (err :any, info :any) {
          if (err) {
            console.log(err);
            reject(err)
            ctx.status=400
            return ctx.body={
              message: "Couldn't send mail",
              success: false,
            } 
          }
         resolve();
        });
      })
}
export{sendMail}