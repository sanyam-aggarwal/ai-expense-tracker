const express = require("express");
const router = express.Router();
const { createExpense, getExpenseList, getExpenseById, deleteExpense, updateExpense } = require("../controllers/expenseControllers");
const validateObjectId = require("../middlewares/validateObjectId");
const authenticate = require("../middlewares/authenticate");

router.use(authenticate);

router.post("/", createExpense);

router.get("/", getExpenseList);

router.get("/:id", validateObjectId, getExpenseById);

router.delete("/:id", validateObjectId, deleteExpense);

router.patch("/:id", validateObjectId, updateExpense);


module.exports = router;
