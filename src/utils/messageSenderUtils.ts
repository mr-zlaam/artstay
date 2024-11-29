export const messageSender = (otp?: string) => {
  const messages = {
    OTP_SENDER_MESSAGE: `<br>  Please use this password <span style="color: red; font-weight: bold">${otp}</span> to verify your account. If you did not request this OTP, please ignore it.<br><span style="text-align:center; color:red; display:block;font-weight:bold;"><i>Password is valid for 30m</i></span>`
  };
  return messages;
};
