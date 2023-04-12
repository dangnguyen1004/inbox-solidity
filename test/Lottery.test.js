const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { LotteryContract } = require("../compile");

let lottery;
let accounts;
const InitialMessage = "Hello world!";
const NewMessage = "New hello world!";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(LotteryContract.abi)
    .deploy({
      data: LotteryContract.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 1000000, gasPrice: "30000000000000" });
});

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allow one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert(players[0] === accounts[0]);
    assert(players.length == 1);
  });

  it("allow multi accounts to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await lottery.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert(players[0] === accounts[0]);
    assert(players[1] === accounts[1]);
    assert(players[2] === accounts[2]);
    assert(players.length == 3);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 100,
      });
      assert(false);
    } catch (error) {
      assert.ok(error);
    }
  });

  it("only manger can call pickerWinner", async () => {
    try {
      await lottery.methods.enter().pickWiner({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert.ok(error);
    }
  });

  it("send money to the winner and reset players", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickerWiner().send({ from: accounts[0] });
    const finalBalance = web3.eth.getBalance(accounts[0])
    const different = finalBalance - initialBalance

    assert(different > web3.utils.toWei('1.8', 'ether'))
  });
});
