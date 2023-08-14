require('dotenv').config()
const nodeMailer = require('nodemailer')
const { hlp, reCaptcha, sanitizeHTML } = require('../plugins')

const transport = nodeMailer.createTransport({
    //@ts-ignore
    host: 'smtp.gmail.com',
    port: '465',
    secure: 'true',
    auth: {
        type: 'OAUTH2',
        user: process.env.MAILER_USER_EMAIL,
        clientId: process.env.MAILER_CLIENT_ID,
        clientSecret: process.env.MAILER_CLIENT_SECRET,
        refreshToken: process.env.MAILER_REFRESH_TOKEN
    }
})

export default async function sendMail(req, res) {

    const email = req.body.email
    const name = sanitizeHTML(req.body.name)
    const message = sanitizeHTML(req.body.message)
    const token = req.body.token

    try {
        const mailOptions = {
            from: `${name} ${email}`,
            to: /* target === 'app' ? 'next@orbrift.com' :  */ process.env.RECIPIENT_EMAIL,
            subject: 'Message to orbrift',
            html: `
            <p>An email sent from orbrift's contact form  by - <b>${name} - ${email}</b></p>.
            <hr>
            ${message}
        `
        }
        const captchaData = await reCaptcha.verifyCaptchaToken(token)

        if (captchaData) {
            if (captchaData.success === true && captchaData.score >= 0.4 && captchaData.action === 'contactForm' || 'messageOwner') {
                const sent = await transport.sendMail(mailOptions)
                if (sent) {
                    res.status(200).send('Your Message has been sent! Thank you.');
                    // res.statusCode = 200;                  
                    // res.send('Your Message has been sent! Thank you.');
                }
                else
                    hlp.error('Unable to send mail due to mail service connection error. ' + other, 500);
                // console.log('failed')
            }
            else if (captchaData.score <= 0.3) {
                 hlp.error('Sorry! I was unable to verify that you are human. Your message was not sent. ' + other, 400);
            }
            else {
                 hlp.error('Sorry! Authenticity verification failed. Your message was not sent. ' + other, 400);
            }
        }

    }
    catch (e) {
        hlp.error('Unable to send mail due to mail service connection error, Please use other medium above or try again soon.', 500)
    }

}