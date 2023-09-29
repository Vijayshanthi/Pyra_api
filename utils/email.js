// email.js
const nodemailer = require('nodemailer');
require('dotenv').config();


const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'testmnmail@gmail.com',
    pass: 'gcfwtednhgasgvqb',
  },
  from: 'testmnmail@gmail.com',
});

transport
  .verify()
  .then(() => console.info('Connected to email server'))
  .catch((error) =>
    console.warn(
      'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
      error
    )
  );
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};
module.exports = {
  transport,
  sendEmail,
};
