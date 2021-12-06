require('dotenv').config()
const nodeMailer = require('nodemailer')
const { hlp, reCaptcha, sanitizeHTML } = require('../../plugins')


const transport = nodeMailer.createTransport({
    //@ts-ignore
    host: 'smtp.gmail.com',
    port: '465',
    secure: 'true',
    auth: {
        type: 'OAUTH2',
        user: 'dayorx68@gmail.com',
        clientId: process.env.MAILER_CLIENT_ID,
        clientSecret: process.env.MAILER_CLIENT_SECRET,
        refreshToken: process.env.MAILER_REFRESH_TOKEN
    }
})

module.exports = {
    async send(req, res) {
        const email = req.body.email
        const name = sanitizeHTML(req.body.name)
        const subject = sanitizeHTML(req.body.subject)
        const message = sanitizeHTML(req.body.message)
        const token = req.body.token

        try {
            const mailOptions = {
                from: `${name} ${email}`,
                to: /* target === 'app' ? 'next@orbrift.com' :  */'dayo4@live.com',
                subject: subject,
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
                        return 'Your Message has been sent! Thank you.'
                    }
                    else
                        hlp.error(captchaData+'  ' + sent , 400);
                        // hlp.error('Unable to send mail due to mail service connection error. ' + other + sent , 400);
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
            hlp.error(/* 'Unable to send mail due to mail service connection error, Please use other medium above or try again soon.' */+ e, 400)
        }
    },

    async sendProjectEnq(req, res) {
        const email = req.body.email
        const name = sanitizeHTML(req.body.name)
        const site_status = sanitizeHTML(req.body.site_status)
        const purpose = sanitizeHTML(req.body.purpose)
        const type = sanitizeHTML(req.body.type)
        const template = sanitizeHTML(req.body.template)
        const logo = sanitizeHTML(req.body.logo)
        const description = sanitizeHTML(req.body.description)
        const features = sanitizeHTML(req.body.features)
        const budget = sanitizeHTML(req.body.budget)
        const token = req.body.token
    

        try {
            const mailOptions = {
                from: `${name} ${email}`,
                to: /* 'next@orbrift.com' */ 'dayo4@live.com',
                subject: 'Project Enquiry',
                html: `
                <p>A Project Enquiry sent by - <b>${name} - ${email}</b></p>.
                <hr>
                <b>Site Status: </b>${site_status}
                <hr>
                <b>Purpose: </b>${purpose}
                <hr>
                <b>Type: </b>${type}
                <hr>
                <b>Has Existing Template: </b>${template}
                <hr>
                <b>Need New Logo: </b>${logo}
                <hr>
                <b>Business Description: </b>${description}
                <hr>
                <b>Required Website Features: </b>${features}
                <hr>
                <b>Budget: </b>${budget}
                <hr>
            `
            }

            const captchaData = await reCaptcha.verifyCaptchaToken(token)

            if (captchaData) {
                const other = 'Please use other medium above or try again soon.'

                if (captchaData.success === true && captchaData.score >= 0.4 && captchaData.action === 'contactForm' || 'messageOwner') {
                    const sent = await transport.sendMail(mailOptions)
                    if (sent) {
                        return 'Your Message has been sent! Thank you.'
                    }
                    else
                        hlp.error('Unable to send mail due to mail service connection error. ' + other, 400);
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
            hlp.error('Unable to send mail due to mail service connection error, Please use other medium above or try again soon.', 400)
        }
    }

}
