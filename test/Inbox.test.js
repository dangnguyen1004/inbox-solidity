const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { InboxContract } = require("../compile");

let inbox;
let accounts;
const InitialMessage = "Hello world!";
const NewMessage = "New hello world!";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

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

  it("can change the message", async () => {
    await inbox.methods.setMessage(NewMessage).send({ from: accounts[0], gas: 1000000 });
    const newMessage = await inbox.methods.message().call();
    assert(newMessage === NewMessage);
  });
});
