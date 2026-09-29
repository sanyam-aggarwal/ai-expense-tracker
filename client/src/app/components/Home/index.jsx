import { Link } from "react-router-dom";
import { authService } from "../../authService";
import "./home.css";

const benefits = [
  {
    icon: "◎",
    title: "See every expense",
    text: "Keep purchases, categories, and totals together instead of scattered across messages and notes.",
  },
  {
    icon: "◔",
    title: "Understand patterns",
    text: "Turn everyday spending into useful category insights, so you know where your money goes.",
  },
  {
    icon: "✓",
    title: "Stay in control",
    text: "A simple, private place to make informed choices before small expenses become big surprises.",
  },
];

export default function Home() {
  const destination = authService.isAuthenticated() ? "/profile" : "/login";
  return (
    <main className="home-page">
      <nav className="home-nav">
        <Link className="home-brand" to="/">
          <span>S</span> Spendwise
        </Link>
        <Link className="nav-login" to={destination}>
          {authService.isAuthenticated() ? "Open dashboard" : "Sign in"}
        </Link>
      </nav>
      <section className="home-hero">
        <div>
          <p className="home-eyebrow">PERSONAL FINANCE, SIMPLIFIED</p>
          <h1>Spend with intention, not uncertainty.</h1>
          <p className="home-intro">
            Spendwise gives you a calmer, clearer view of your everyday money. Record expenses in
            seconds and understand the habits behind them.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to={destination}>
              Start tracking free
            </Link>
            <a className="secondary-link" href="#benefits">
              Explore benefits ↓
            </a>
          </div>
        </div>
        <div className="hero-card">
          <p>This month</p>
          <strong>₹12,000</strong>
          <span>Clear spending. Better choices.</span>
          <div className="mini-chart">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <small>Food is your top category</small>
        </div>
      </section>
      <section id="benefits" className="benefit-section">
        <p className="home-eyebrow">WHY SPENDWISE</p>
        <h2>A practical money habit that sticks.</h2>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title}>
              <span>{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="home-cta">
        <div>
          <p className="home-eyebrow">READY WHEN YOU ARE</p>
          <h2>Make room for what matters.</h2>
        </div>
        <Link className="primary-link" to={destination}>
          Create your account
        </Link>
      </section>
      <footer>© {new Date().getFullYear()} Spendwise · Your spending, made understandable.</footer>
    </main>
  );
}
