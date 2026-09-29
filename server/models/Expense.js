const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            default: "Uncategorized",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    { 
        timestamps: true,
        collection: 'expenses'
    }
);

module.exports = mongoose.model('Expense', expenseSchema);
