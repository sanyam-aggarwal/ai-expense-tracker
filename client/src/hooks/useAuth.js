import { useState } from "react";
import * as authApi from "../api/authApi";
import { saveSession } from "../utils/sessionStorage";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const execute = async (request) => {
    setIsLoading(true);
    setMessage("");
    try {
      return await request();
    } catch (error) {
      setMessage(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPhoneOtp = async (phone) => {
    const data = await execute(() => authApi.requestOtp(phone));
    if (data) setMessage(data.developmentCode && `Code sent. It expires in 5 minutes.`);
    return Boolean(data);
  };

  const completeSignIn = async (request) => {
    const data = await execute(request);
    if (data) saveSession(data);
    return Boolean(data);
  };

  return {
    isLoading,
    message,
    requestPhoneOtp,
    verifyPhoneOtp: (phone, code) => completeSignIn(() => authApi.verifyOtp(phone, code)),
    signInWithGoogle: (credential) => completeSignIn(() => authApi.signInWithGoogle(credential)),
  };
}
