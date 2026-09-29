import { post } from "./http";

export const requestOtp = (phone) => post("/api/auth/phone/request-otp", { phone });
export const verifyOtp = (phone, code) => post("/api/auth/phone/verify-otp", { phone, code });
export const signInWithGoogle = (credential) => post("/api/auth/google", { credential });
