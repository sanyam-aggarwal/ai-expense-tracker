import { GoogleLogin } from "@react-oauth/google";

export function GoogleSignIn({ enabled, onSuccess, onError }) {
  if (!enabled)
    return <p className="subtle">Google sign-in will appear after you add its client ID.</p>;
  return (
    <GoogleLogin
      onSuccess={({ credential }) => onSuccess(credential)}
      onError={onError}
      theme="outline"
      size="large"
      width="360"
    />
  );
}
