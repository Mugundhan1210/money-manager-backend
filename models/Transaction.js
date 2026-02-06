const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense","transfer"],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    division: {
      type: String,
      enum: ["office", "personal"],
      required: true,
    },

    description: {
      type: String,
    },

    accountFrom: {
      type: String,
    },
    
    accountTo: {
      type: String,
    },
    

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
