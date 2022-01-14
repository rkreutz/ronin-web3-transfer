
const Web3 = require('web3')
const Erc20 = require('./Erc20')
require('dotenv').config()

const roninRpcUrl_read = process.env.RPC_R; // GET requests
const roninRpcUrl_write = process.env.RPC_W; // POST requests
const chainId = 2020;
const privateKey = process.env.PRIVATE_KEY;
const from = process.env.FROM_ADDRESS;
const to = process.env.TO_ADDRESS;
const wethAddress = "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5";

const web3_read = new Web3(roninRpcUrl_read)
const account = web3_read.eth.accounts.privateKeyToAccount(privateKey);
web3_read.eth.accounts.wallet.add(account);
web3_read.eth.defaultAccount = account.address;
const web3_write = new Web3(roninRpcUrl_write)
web3_write.eth.accounts.wallet.add(account);
web3_write.eth.defaultAccount = account.address;
const wethContract = new web3_read.eth.Contract(Erc20.abi, wethAddress);
const value = Web3.utils.toWei('0.01', 'ether')

var tx = {
  chainId: chainId,
  value: 0,
  from: from, 
  to: wethAddress, 
  gas: 51009,
  gasPrice: 0, 
  // this encodes the ABI of the method and the arguements
  data: wethContract.methods.transfer(to, value).encodeABI() 
};

async function init() {
  const balance = await wethContract.methods.balanceOf(from).call();
  console.log(`${from} ETH balance: ${Web3.utils.fromWei(balance, 'ether')}`);

  console.log(tx);
  const sentTx = web3_write.eth.sendTransaction(tx);
  sentTx.on("receipt", receipt => {
    console.log(receipt)
  });
  sentTx.on("error", err => {
    console.error(err)
  });
}

init()