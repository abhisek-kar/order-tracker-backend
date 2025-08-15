declare module 'nodemailer-express-handlebars' {
  import { Transporter } from 'nodemailer';
  
  interface HandlebarsOptions {
    viewEngine: {
      extname: string;
      layoutsDir?: string;
      defaultLayout?: string | false;
      partialsDir?: string;
    };
    viewPath: string;
    extName: string;
  }
  
  function hbs(options: HandlebarsOptions): any;
  export = hbs;
}
