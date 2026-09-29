const Expense = require("../models/Expense");
const mongoose = require("mongoose");

exports.getSummary = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.sub);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [totalResult, monthlyResult, categories, recentExpenses] = await Promise.all([
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId, createdAt: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]),
    Expense.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  res.json({
    success: true,
    data: {
      totalSpent: totalResult[0]?.total || 0,
      currentMonthSpent: monthlyResult[0]?.total || 0,
      categories: categories.map(({ _id, total }) => ({ category: _id, total })),
      recentExpenses,
    },
  });
};
