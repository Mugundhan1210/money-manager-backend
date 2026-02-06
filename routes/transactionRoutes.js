const express = require("express");
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");


const router = express.Router();

// add income, expense, or transfer
// add income, expense, or transfer
router.post("/add", async (req, res) => {
  console.log("Request body:", req.body);

  const { amount, type, accountFrom, accountTo } = req.body;

  try {
    const transaction = new Transaction(req.body);
    await transaction.save();

    // Update account balances
    if (type === "expense" && accountFrom) {
      await Account.findOneAndUpdate(
        { name: accountFrom },
        { $inc: { balance: -amount } }
      );
    }

    if (type === "income" && accountTo) {
      await Account.findOneAndUpdate(
        { name: accountTo },
        { $inc: { balance: amount } }
      );
    }

    if (type === "transfer" && accountFrom && accountTo) {
      await Account.findOneAndUpdate(
        { name: accountFrom },
        { $inc: { balance: -amount } }
      );
      await Account.findOneAndUpdate(
        { name: accountTo },
        { $inc: { balance: amount } }
      );
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Add transaction error:", error);
    res.status(500).json({ message: error.message });
  }
});


// GET transactions with filters
router.get("/", async (req, res) => {
    try {
      const { division, category, startDate, endDate } = req.query;
  
      let filter = {};
  
      if (division) {
        filter.division = division;
      }
  
      if (category) {
        filter.category = category;
      }
  
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
  
      const transactions = await Transaction.find(filter).sort({ date: -1 });
  
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  


// DELETE transaction by ID
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

// UPDATE transaction
router.put("/:id", async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTransaction);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
});


  

// UPDATE transaction (allowed within 12 hours)
router.put("/:id", async (req, res) => {
    try {
      const transactionId = req.params.id;
  
      const transaction = await Transaction.findById(transactionId);
  
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
      const createdTime = new Date(transaction.createdAt);
      const currentTime = new Date();
  
      const timeDifference = (currentTime - createdTime) / (1000 * 60 * 60);
  
      if (timeDifference > 12) {
        return res.status(400).json({
          message: "You can edit this transaction only within 12 hours"
        });
      }
  
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        req.body,
        { new: true }
      );
  
      res.json({
        message: "Transaction updated successfully",
        data: updatedTransaction
      });
  
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
