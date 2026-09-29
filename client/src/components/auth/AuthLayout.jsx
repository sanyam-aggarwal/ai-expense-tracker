export function AuthLayout({ children }) {
  return (
    <main className="page">
      <section className="intro">
        <p className="eyebrow">SMART PERSONAL FINANCE</p>
        <h1>Know where every rupee goes.</h1>
        <p>Sign in to make your spending calmer, clearer, and easier to manage.</p>
      </section>
      <section className="card">{children}</section>
    </main>
  );
}
