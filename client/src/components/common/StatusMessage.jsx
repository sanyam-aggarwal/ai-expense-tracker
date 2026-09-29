export function StatusMessage({ children }) {
  return children ? (
    <p className="message" role="status">
      {children}
    </p>
  ) : null;
}
