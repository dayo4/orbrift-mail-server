require("dotenv").config();

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

const nodeMailer = require("nodemailer");
const { hlp, reCaptcha, sanitizeHTML } = require("../plugins");

const transport = nodeMailer.createTransport({
  //@ts-ignore
  host: "smtp.gmail.com",
  port: "465",
  secure: "true",
  auth: {
    type: "OAUTH2",
    user: process.env.MAILER_USER_EMAIL,
    clientId: process.env.MAILER_CLIENT_ID,
    clientSecret: process.env.MAILER_CLIENT_SECRET,
    refreshToken: process.env.MAILER_REFRESH_TOKEN,
  },
});

const sendMail = async (req, res) => {
  const email = req.body.email;
  const name = sanitizeHTML(req.body.name);
  const message = sanitizeHTML(req.body.message);
  const token = req.body.token;

  try {
    const mailOptions = {
      from: `${name} ${email}`,
      to: /* target === 'app' ? 'next@orbrift.com' :  */ process.env
        .RECIPIENT_EMAIL,
      subject: "Message to orbrift",
      html: `
            <p>An email sent from orbrift's contact form  by - <b>${name} - ${email}</b></p>.
            <hr>
            ${message}
            `,
    };
    const captchaData = await reCaptcha.verifyCaptchaToken(token);

    if (captchaData) {
      if (
        (captchaData.success === true &&
          captchaData.score >= 0.4 &&
          captchaData.action === "contactForm") ||
        "messageOwner"
      ) {
        const sent = await transport.sendMail(mailOptions);
        if (sent) {
          return res.status(200).send("Your Message has been sent! Thank you.");
          // res.statusCode = 200;
          // res.send('Your Message has been sent! Thank you.');
        } else
          hlp.error(
            "Unable to send mail due to mail service connection error. " +
              other,
            500
          );
        // console.log('failed')
      } else if (captchaData.score <= 0.3) {
        hlp.error(
          "Sorry! I was unable to verify that you are human. Your message was not sent. " +
            other,
          400
        );
      } else {
        hlp.error(
          "Sorry! Authenticity verification failed. Your message was not sent. " +
            other,
          400
        );
      }
    }
  } catch (e) {
    console.error("*Inf:", process.env.NODE_ENV);
    console.error("*Inf2:", process.env.MAILER_CLIENT_ID);
    console.error("*Internal Error:", e);
    return res.status(500).json({ message: e });
    // hlp.error('Unable to send mail due to mail service connection error, Please use other medium above or try again soon.', 500)
  }
};

export default allowCors(sendMail);
