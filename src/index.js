#!/usr/bin/env node

var child_process = require('child_process');
var fs = require('fs');
var Web3 = require('web3');
var web3 = new Web3();
web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8546"));

function compiledContractExists() {
    return fs.existsSync('./target/Adoption.abi') && fs.existsSync('./target/Adoption.bin');
}

function deployContract(transaction, gasAmount) {
    transaction
        .send({
            from: fromAddress,
            gas: gasAmount
        })
        .on('transactionHash', function(hash) {
            console.log("Contract deployment transaction hash: " + hash);
        })
        .on('receipt', function(receipt) {
            console.log("Transaction receipt received. Contract is located at address: " + receipt.contractAddress);
            console.log(receipt);
            console.log("");
            console.log("Exiting...");
            console.log("");
            process.exit();
        })
        .on('error', function(error, receipt) {
            console.error(error);
            if (receipt) {
                console.error("Transaction receipt:");
                console.error(receipt);
            }
            process.exit(1);
        });
}

var fromAddress = "0x00a329c0648769a73afac7f9381e08fb43dbea72";
if (process.argv.length < 3) {
    console.log("No deployment address provided. Using default for parity dev network: " + fromAddress);
} else {
    fromAddress = process.argv[2];
    console.log("Using address " + fromAddress + " to deploy.");
}

if (!compiledContractExists()) {
    console.error("");
    console.error("ERROR:");
    console.error("No ABI or binary available for contract. Please compile contract");
    console.error("Compile using the following command:");
    console.error("    solc --bin --abi -o target contracts/Adoption.sol");
    console.error("Exiting...");
    console.error("");
    process.exit(1);
}

var abi = JSON.parse(fs.readFileSync('./target/Adoption.abi', 'utf8'));
var adoptionCompiled = "0x" + fs.readFileSync('./target/Adoption.bin', 'utf8');
var AdoptionContract = new web3.eth.Contract(abi, null, {from: fromAddress});
var transaction = AdoptionContract.deploy({data: adoptionCompiled});
transaction.estimateGas()
    .then(function(gasAmount) {
        console.log("Estimated gas to deploy contract: " + gasAmount);
        deployContract(transaction, gasAmount);
    })
    .catch(function(error) {
        console.log("Error estimating gas for deployment transactions: " + error);
    });
