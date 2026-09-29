import { Button } from "../common/Button";

export function PhoneForm({ phone, isLoading, onPhoneChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Mobile number <span>Include country code</span>
      </label>
      <input
        type="tel"
        value={phone}
        onChange={(event) => onPhoneChange(event.target.value)}
        placeholder="+91 98765 43210"
        autoComplete="tel"
        required
      />
      <Button disabled={isLoading}>{isLoading ? "Sending…" : "Send verification code"}</Button>
    </form>
  );
}
