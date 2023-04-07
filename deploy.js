const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const InboxContract = require("./compile");

const InitialMessage = "Hello world!";
const mnemonic =
  "design grow test return sorry alcohol wrong soda oil mountain radar cart";
const networkUrl =
  "https://sepolia.infura.io/v3/2a5b75fa45c74446937f0e7ef657963e";

const provider = new HDWalletProvider(mnemonic, networkUrl);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const firstAccount = accounts[0];

  const inbox = await new web3.eth.Contract(InboxContract.abi)
    .deploy({
      data: InboxContract.evm.bytecode.object,
      arguments: [InitialMessage],
    })
    .send({ from: firstAccount, gas: 1000000 });

  console.log("🚀 ~ file: deploy.js:25 ~ deploy ~ inbox:", inbox);
};

const inboxContractAddress = "0x8508726f43d25877292847978697726aa1A1E871";

const playWithInboxContract = async () => {
  const inbox = new web3.eth.Contract(InboxContract.abi, inboxContractAddress);
  const message = await inbox.methods.message().call();
  console.log(
    "🚀 ~ file: deploy.js:34 ~ playWithInboxContract ~ message:",
    message
  );
};

playWithInboxContract();
