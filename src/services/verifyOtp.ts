import { Response } from "express";
import sendResponse from "./sendResponse.js";

const checkOtpExpiration = (
  res: Response,
  otpTime: string,
  seconds: number,
) => {
  const currentTime = Date.now();
  if (currentTime - parseInt(otpTime) < seconds) {
    sendResponse(res, 200, "Valid OTP ,proceed to reset password");
  } else {
    sendResponse(res, 403, "OTP expired , sorry try again later");
  }
};

export default checkOtpExpiration
