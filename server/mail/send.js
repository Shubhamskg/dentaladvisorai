import nodemailer from 'nodemailer'
import dotnet from 'dotenv'
// import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
dotnet.config()
// import smtpTransport from 'nodemailer-smtp-transport';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_SECRET
    }
})
// const smtpTransport=new SMTPTransport();
// const transporter = nodemailer.createTransport(smtpTransport({
//     host:'webmail.porkbun.com',
//     secureConnection: false,
//     tls: {
//       rejectUnauthorized: false
//     },
//     port: 587,
//     auth: {
//         user: process.env.MAIL_EMAIL,
//         pass: process.env.MAIL_SECRET,
//   }
// }));

export default ({ to, subject, html }) => {
    var options = {
        from: `Dental Advisor <${process.env.MAIL_EMAIL}>`,
        to,
        subject,
        html
    }

    transporter.sendMail(options, function (err, done) {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ', done?.response);
        }
    });
}