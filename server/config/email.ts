import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';
import {htmlToText} from 'html-to-text';
import juice from 'juice';
import endpointsConfig from '../endpoints.config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default ({templateName, templateVars, ...restOfOptions}: any) => {
  const templatePath = `config/templates/${templateName}.html`;
  const options = {
    ...restOfOptions,
    async: true,
  };

  if (templateName && fs.existsSync(templatePath)) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = ejs.render(template, templateVars);
    const text = htmlToText(html);
    const htmlWithStylesInlined = juice(html);

    options.html = htmlWithStylesInlined;
    options.text = text;
  }

  if (endpointsConfig.nodeEnv !== 'development') {
    const smtp = nodemailer.createTransport({
      host: endpointsConfig.smtpHost,
      port: Number(endpointsConfig.smtpPort),
      secure: false,
      auth: {
        user: endpointsConfig.smtpUsername,
        pass: endpointsConfig.smtpPassword,
      },
      requireTLS: true,
      tls: {
        ciphers:'SSLv3'
    }
    });

    return smtp.sendMail(options);
  } else {
    const smtp = nodemailer.createTransport({
      service: endpointsConfig.smtpService,
      auth: {
        user: endpointsConfig.smtpUsername,
        pass: endpointsConfig.smtpPassword,
      },
    });
    return smtp.sendMail(options);
  }
};
