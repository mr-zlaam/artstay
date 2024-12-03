export const messageSender = (otp: string, expireyTime: string) => {
  const messages = {
    OTP_SENDER_MESSAGE: `<br>  Please click on the link <span style="color: red; font-weight: bold">${otp}</span> to verify your account. If you did not request this , please ignore it.<br><span style="text-align:center; color:red; display:block;font-weight:bold;"><i>Link is valid for ${expireyTime}</i></span>`
  };
  return messages;
};
