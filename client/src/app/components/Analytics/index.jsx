import { useEffect, useState } from "react";
import { getAnalyticsSummary } from "../../services/AnalyticsApi";
import "./analytics.css";

const PIE_COLORS = ["#356b45", "#86b879", "#e5b85b", "#e58268", "#7a91c5"];

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const total = summary?.categories.reduce((sum, item) => sum + item.total, 0) || 0;
  let position = 0;
  const slices = (summary?.categories || []).map((item, index) => {
    const percentage = total ? (item.total / total) * 100 : 0;
    const slice = {
      ...item,
      percentage,
      color: PIE_COLORS[index % PIE_COLORS.length],
      start: position,
      end: position + percentage,
    };
    position += percentage;
    return slice;
  });
  const pieBackground = slices.length
    ? `conic-gradient(${slices.map((slice) => `${slice.color} ${slice.start}% ${slice.end}%`).join(", ")})`
    : "#edf1ec";
  useEffect(() => {
    getAnalyticsSummary()
      .then(({ data }) => setSummary(data))
      .catch((requestError) => setError(requestError.message));
  }, []);
  return (
    <section className="dashboard-page">
      <p className="page-eyebrow">INSIGHTS</p>
      <h1>Analytics</h1>
      <p className="page-description">A quick view of your spending patterns.</p>
      {error && <p className="dashboard-error">{error}</p>}
      {summary && (
        <>
          <div className="metric-grid">
            <article>
              <span>Total spent</span>
              <strong>₹{summary.totalSpent.toLocaleString("en-IN")}</strong>
            </article>
            <article>
              <span>This month</span>
              <strong>₹{summary.currentMonthSpent.toLocaleString("en-IN")}</strong>
            </article>
            <article>
              <span>Categories</span>
              <strong>{summary.categories.length}</strong>
            </article>
          </div>
          <div className="data-card">
            <h2>Spending by category</h2>
            {slices.length ? (
              <div className="analytics-breakdown">
                <div
                  className="pie-chart"
                  style={{ background: pieBackground }}
                  aria-label="Expense category pie chart"
                  role="img"
                />
                <div>
                  {slices.map((item) => (
                    <div className="category-row" key={item.category}>
                      <i className="category-dot" style={{ backgroundColor: item.color }} />
                      <span>{item.category}</span>
                      <strong>
                        ₹{item.total.toLocaleString("en-IN")} ({Math.round(item.percentage)}%)
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="empty-state">Add expenses to see category insights.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
