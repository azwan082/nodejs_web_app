var nodemailer = require('nodemailer');
var mailgun = require('nodemailer-mailgun-transport');
var config = require('../config.json');
var transport = nodemailer.createTransport(mailgun({
  auth: config.mailer
}));
module.exports = transport;