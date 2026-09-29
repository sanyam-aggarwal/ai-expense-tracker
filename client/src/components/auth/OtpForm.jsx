import { Button } from "../common/Button";

export function OtpForm({ phone, code, isLoading, onCodeChange, onSubmit, onChangePhone }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Verification code <span>Sent to {phone}</span>
      </label>
      <input
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength="6"
        value={code}
        onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, ""))}
        placeholder="6-digit code"
        autoFocus
        required
      />
      <Button disabled={isLoading}>{isLoading ? "Verifying…" : "Verify and continue"}</Button>
      <Button type="button" className="link" onClick={onChangePhone}>
        Use a different number
      </Button>
    </form>
  );
}
