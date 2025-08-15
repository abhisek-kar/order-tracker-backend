import nodemailer from "nodemailer";
import logger from "../utils/logger";
import appEnv from "./env";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
  host: appEnv.EMAIL_HOST,
  port: Number(appEnv.EMAIL_PORT),
  secure: Number(appEnv.EMAIL_PORT) === 465,
  auth: {
    user: appEnv.EMAIL_USER,
    pass: appEnv.EMAIL_PASS,
  },
  logger: false,
});

// transporter.use(
//   "compile",
//   hbs({
//     viewEngine: {
//       extname: ".hbs",
//       layoutsDir: path.resolve("./src/views/email"),
//       defaultLayout: false,
//       partialsDir: path.resolve("./src/views/email/partials"),
//     },
//     viewPath: path.resolve("./src/views/email"),
//     extName: ".hbs",
//   })
// );

transporter.verify((error, success) => {
  if (error) {
    logger.error("Nodemailer configuration error:", error);
  } else {
    logger.info("Nodemailer is ready to send emails");
  }
});

export default transporter;
