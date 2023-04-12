const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
const lotteryPath = path.resolve(__dirname, "contracts", "Lottery.sol");

const inboxSource = fs.readFileSync(inboxPath, "utf-8");
const lotterySource = fs.readFileSync(lotteryPath, "utf-8");

var input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
      content: inboxSource,
    },
    "Lottery.sol": {
      content: lotterySource,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const InboxContract = output.contracts["Inbox.sol"].Inbox;
const LotteryContract = output.contracts["Lottery.sol"].Lottery;

module.exports = { InboxContract, LotteryContract };
