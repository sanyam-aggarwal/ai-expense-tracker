const Expense = require("../models/Expense")

const createExpense = async(req, res) => {
    try {
        const expense = await Expense.create({ ...req.body, user: req.user.sub })
        res.status(201).json({ 
            success: true,
            data: expense
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateExpense = async(req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOneAndUpdate({ _id: id, user: req.user.sub }, req.body, { new: true, runValidators: true })
        if (!expense) {
            return res.status(404).json({
              success: false,
              message: "Expense not found",
            });
          }
        res.status(202).json({ 
            success: true,
            message: "Expense updated successfully",
            data: expense
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getExpenseList = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.size) || 10;
        const skip = page * limit;
        const filter = { user: req.user.sub };

        if (req.query.description) {
            filter.description = req.query.description;
        }

        if (req.query.search) {
            filter.description = {
              $regex: req.query.search,
              $options: "i",
            };
        }

        if (req.query.amount) {
            filter.amount = {};
            filter.amount.$gte = Number(req.query.amount);
        }

        let sort = {
            createdAt: -1,
        };
        if (req.query.sort) {
            const field = req.query.sort;
      
            if (field.startsWith("-")) {
              sort = {
                [field.substring(1)]: -1,
              };
            } else {
              sort = {
                [field]: 1,
              };
            }
          }
        const expenses = await Expense.find(filter).skip(skip).limit(limit).sort(sort);
        const total = await Expense.countDocuments(filter);
        res.status(200).json({ 
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            count: expenses.length,
            data: expenses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getExpenseById = async(req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user.sub })
        if (!expense) {
            return res.status(404).json({
              success: false,
              message: "Expense not found",
            });
          }
        res.status(200).json({ 
            success: true,
            data: expense
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteExpense = async(req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findOneAndDelete({ _id: id, user: req.user.sub })
        if (!expense) {
            return res.status(404).json({
              success: false,
              message: "Expense not found",
            });
          }
        res.status(200).json({ 
            success: true,
            message: "Expense deleted successfully",
            data: expense
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createExpense,
    updateExpense,
    getExpenseList,
    getExpenseById,
    deleteExpense
}
