import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../../services/ExpenseApi";
import "./expenses.css";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: "", amount: "", category: "Uncategorized" });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const load = () =>
    getExpenses()
      .then(({ data }) => setExpenses(data))
      .catch((requestError) => setError(requestError.message));
  useEffect(() => {
    load();
  }, []);
  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) await updateExpense(editingId, { ...form, amount: Number(form.amount) });
      else await createExpense({ ...form, amount: Number(form.amount) });
      setForm({ description: "", amount: "", category: "Uncategorized" });
      setEditingId(null);
      load();
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  const columns = [
    { name: "Description", selector: (row) => row.description, sortable: true, grow: 2 },
    { name: "Category", selector: (row) => row.category, sortable: true },
    {
      name: "Amount",
      selector: (row) => `₹${row.amount.toLocaleString("en-IN")}`,
      sortable: true,
      right: true,
    },
    {
      name: "Actions",
      right: true,
      cell: (row) => (
        <div className="expense-actions">
          <button
            className="expense-action edit-action"
            type="button"
            aria-label={`Edit ${row.description}`}
            title="Edit expense"
            onClick={() => {
              setEditingId(row._id);
              setForm({ description: row.description, amount: row.amount, category: row.category });
            }}
          >
            ✎
          </button>
          <button
            className="expense-action delete-action"
            type="button"
            aria-label={`Delete ${row.description}`}
            title="Delete expense"
            onClick={async () => {
              if (!window.confirm("Delete this expense?")) return;
              await deleteExpense(row._id);
              load();
            }}
          >
            ×
          </button>
        </div>
      ),
    },
  ];
  return (
    <section className="dashboard-page">
      <p className="page-eyebrow">TRACKING</p>
      <h1>Expenses</h1>
      <p className="page-description">Record every expense and keep it in one place.</p>
      <form className="expense-form" onSubmit={submit}>
        <input
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Description"
          required
        />
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: event.target.value })}
          placeholder="Amount"
          required
        />
        <input
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
          placeholder="Category"
          required
        />
        <button>{editingId ? "Save expense" : "Add expense"}</button>
      </form>
      {error && <p className="dashboard-error">{error}</p>}
      <div className="data-card expense-table">
        <DataTable
          columns={columns}
          data={expenses}
          pagination
          highlightOnHover
          noDataComponent="No expenses yet. Add your first one above."
        />
      </div>
    </section>
  );
}
