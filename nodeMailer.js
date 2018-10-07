'use strict';
const nodemailer = require('nodemailer');
var userName;

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

module.exports = {
    sendMail: function (toUser, username, tableName) {
        console.log ("sending mail to =" + toUser);
        console.log("username and tableName =" + userName + ' ' + tableName);
        var smtpConfig = {
            service: '',
            auth: {
                user: "",
                pass: ""
            }
        };
        var transporter = nodemailer.createTransport(smtpConfig);

        // setup email data with unicode symbols
        userName = toUser.split("@");
        userName = userName[0];
        var link = "http://localhost:3000/";
        console.log ("link = " + link);
        const mailOptions = {
            from: '', // sender address
           // to: toUser, // list of receivers
           to: '',
            subject: 'Time sheet for Approval -' + userName, // Subject line
            html: '<p>Hi ' + userName + ',  ' + userName + ' has submitted timesheet </p> \
            <a href=' + link + '>' + 'View Submitted timesheet' + ' </a>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (err, info) {
            if (err)
                console.log(err)
            else
                console.log(info);
        });
    }
}