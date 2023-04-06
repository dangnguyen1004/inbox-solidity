const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const InboxContract = require("../compile");

let inbox;
const InitialMessage = "Hello world!";

beforeEach(async () => {
  const accounts = await web3.eth.getAccounts();

  inbox = await new web3.eth.Contract(InboxContract.abi)
    .deploy({
      data: InboxContract.evm.bytecode.object,
      arguments: [InitialMessage],
    })
    .send({ from: accounts[0], gas: 1000000, gasPrice: "30000000000000" });
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has default message", async () => {
    const message = await inbox.methods.message().call();
    assert(message === InitialMessage);
  });
});
