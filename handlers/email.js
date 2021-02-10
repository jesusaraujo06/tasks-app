
const nodemailer = require('nodemailer');
const pug = require('pug');
// Juice permite agregar estilos lineales
const juice = require('juice');
// Htmltotex nos va a crear una version de nuestro correo de html a puro texto
const { htmlToText } = require('html-to-text');

// Utilidad que viene con node
const util = require('util');
// Config de email
const emailConfig = require('../config/email');
// const email = require('../config/email');

// async..await no está permitido en el alcance global, debe usar un contenedor

  
// crear un objeto transportador reutilizable utilizando el transporte SMTP predeterminado
let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
    },
});

// Generar HTML
const generarHTML = (archivo, opciones = {}) => {
    // Le estamos pasando opciones que trae variables dentro, pug.renderFile toma como segundo parametros opciones, las leee, las mapea y lo inyecta automaticamente
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}

exports.enviar = async (opciones, otrasOpciones = {}) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText(html);
    // console.log(text)
    let opcionesEmail = {
        from: 'Tareas Tesleras <no-reply@tareastesla.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text: text, // plain text body
        html: html, // html body
    };

    // La funcion Sendmail no soporte async/await, solo soporte promises
    // util.promisify convierte a async/await = transporter.sendMail(mailOptions);
    const enviarEmail = util.promisify(transporter.sendMail, transporter);
    return enviarEmail.call(transporter, opcionesEmail);
    
}
  
// console.log("Message sent: %s", info.messageId);
// // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// // Preview only available when sending through an Ethereal account
// console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
