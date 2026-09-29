import { useEffect, useState } from "react";
import { getCurrentUser, updateProfile, uploadAvatar } from "../../services/UserApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  useEffect(() => {
    getCurrentUser()
      .then(({ user: result }) => {
        setUser(result);
        setForm({ name: result.name || "", email: result.email || "" });
      })
      .catch((requestError) => setError(requestError.message));
  }, []);
  return (
    <section className="dashboard-page">
      <p className="page-eyebrow">ACCOUNT</p>
      <h1>Profile</h1>
      <p className="page-description">Your identity and preferred sign-in methods.</p>
      {error && <p className="dashboard-error">{error}</p>}
      {user && (
        <div className="profile-card">
          <div className="profile-avatar">{user.name?.[0] || user.phone?.[1] || "U"}</div>
          <div>
            <h2>{user.name || "Spendwise member"}</h2>
            <dl>
              <div>
                <dt>Mobile</dt>
                <dd>{user.phone || "Not connected"}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email || "Not connected"}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      <form
        className="expense-form"
        onSubmit={async (event) => {
          event.preventDefault();
          const { user: updated } = await updateProfile(form);
          setUser(updated);
          localStorage.setItem("expense_tracker_user", JSON.stringify(updated));
        }}
      >
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Full name"
        />
        <input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Email"
        />
        <button>Save changes</button>
      </form>
    </section>
  );
}
