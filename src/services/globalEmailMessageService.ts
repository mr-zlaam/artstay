import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { HOST_EMAIL, HOST_EMAIL_SECRET } from "../configs/config.js";
import { generateRandomStrings } from "../utils/slugStringGeneratorUtils.js";
import logger from "../utils/loggerUtils.js";
import reshttp from "reshttp";
import constant from "../constants/constant.js";
import { replaceAllPlaceholders } from "../utils/replacePlaceHolderInTemplateUtils.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: HOST_EMAIL,
    pass: HOST_EMAIL_SECRET
  }
});

export async function gloabalEmailMessage(
  from: string,
  to: string,
  senderIntro?: string,
  message?: string | null,
  subject?: string,
  header?: string,
  addsOn?: string
) {
  const templatePath = path.resolve(__dirname, "../../templates/globalMessageTemplate.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  const placeholders = {
    companyname: constant.COMPANY_NAME || "Artstay",
    senderIntro: senderIntro || "",
    message: message || "",
    header: header || "",
    addsOn: addsOn || ""
  };
  htmlTemplate = replaceAllPlaceholders(htmlTemplate, placeholders);
  const randomStr = generateRandomStrings(10);
  const mailOptions = {
    from: from ?? "noreply@pls.com",
    to: to,
    subject: subject ?? constant.COMPANY_NAME,
    html: htmlTemplate,
    headers: {
      "Message-ID": `<${randomStr}.dev>`
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(" Email message sent successfully: " + info.response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error Email message sending :${error.message}`);
      throw { status: reshttp.internalServerErrorCode, message: reshttp.internalServerErrorMessage };
    } else {
      logger.error(`Error sending Email  message:${error as string}`);
      throw { status: reshttp.internalServerErrorCode, message: reshttp.internalServerErrorMessage };
    }
  }
}
