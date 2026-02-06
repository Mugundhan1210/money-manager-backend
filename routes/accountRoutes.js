const express = require("express");
const Account = require("../models/Account");
const router = express.Router();

/* Get all accounts */
router.get("/", async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

/* Create account */
router.post("/add", async (req, res) => {
  const account = new Account(req.body);
  await account.save();
  res.json(account);
});

module.exports = router;
