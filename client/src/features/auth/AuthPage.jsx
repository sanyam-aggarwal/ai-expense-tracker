import { useState } from "react";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { GoogleSignIn } from "../../components/auth/GoogleSignIn";
import { OtpForm } from "../../components/auth/OtpForm";
import { PhoneForm } from "../../components/auth/PhoneForm";
import { Divider } from "../../components/common/Divider";
import { StatusMessage } from "../../components/common/StatusMessage";
import { useAuth } from "../../hooks/useAuth";

export function AuthPage({ googleEnabled }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("phone");
  const { isLoading, message, requestPhoneOtp, verifyPhoneOtp, signInWithGoogle } = useAuth();
  const redirectToApp = () => window.location.assign("/profile");

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    if (await requestPhoneOtp(phone)) setStep("otp");
  };
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (await verifyPhoneOtp(phone, code)) redirectToApp();
  };
  const handleGoogleSuccess = async (credential) => {
    if (await signInWithGoogle(credential)) redirectToApp();
  };

  return (
    <AuthLayout>
      <div className="brand">S</div>
      <h2>Welcome to Spendwise</h2>
      <p className="subtle">Continue with your mobile number or Google account.</p>
      {step === "phone" ? (
        <PhoneForm
          phone={phone}
          isLoading={isLoading}
          onPhoneChange={setPhone}
          onSubmit={handleRequestOtp}
        />
      ) : (
        <OtpForm
          phone={phone}
          code={code}
          isLoading={isLoading}
          onCodeChange={setCode}
          onSubmit={handleVerifyOtp}
          onChangePhone={() => setStep("phone")}
        />
      )}
      <StatusMessage>{message}</StatusMessage>
      <Divider />
      {/* <div className="google">
        <GoogleSignIn enabled={googleEnabled} onSuccess={handleGoogleSuccess} onError={() => {}} />
      </div> */}
      <p className="terms">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
    </AuthLayout>
  );
}
