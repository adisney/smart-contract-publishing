# smart-contract-publishing

## Setup
### node.js
You must have node.js installed for this project. Please download node.js from [here](https://nodejs.org/en/download/).

Once node has been installed run the following command to initialize the project workspace.

```
npm i
```

This will examine `package.json` and install the packages specified in the `dependencies` and the `devDependencies` directives.

### Parity
This project was written with the expectation that you would be using Parity for your Ethereum node software. No worries if that is not the case. All that is actually necessary is you are running an ethereum node (network independent), meaning either Geth or Parity are acceptable.

The primary way this expectation expresses itself is in scripts in the bin directory. `./bin/run_dev_network.sh` and `./bin/run_ropsten_network.sh` both assume you are using parity and run a parity node with some helpful flags enabled to facilitate easy contract deployment. Similar options exist for Geth, so it would be possible to port the run scripts for Geth.

You can download the latest Parity release from [here](https://github.com/paritytech/parity/releases).

### Solidity
To compile the included smart contracts you will need to have a Solidity compiler installed. Please follow [these instructions](http://solidity.readthedocs.io/en/v0.4.21/installing-solidity.html) to install `solc`.

Solidity version 0.4.21 or higher is required.

## Usage
### Assumptions
* Default websocket port (8546) for parity is being used. If this is not the case the target host:port will have to be updated in `src/index.js`.
* If connected to Roptsten or any other non-dev network, the node will need access to a funded Ether account.
* The specified account must be unlocked. The scripts in `./bin/` demonstrate how to unlock accounts when starting your Parity node.

### Dev network
For your first attempt at deploying a contract I suggest you deploy to a dev network. This is easy to do because Parity is kind in offering the `--config dev` flag. This starts a local development chain with a variety of useful features, the most of important of which being:
* InstantSeal engine - In other words the node will automatically mine any transaction submitted to it.
* A funded ETH address at public key `0x00a329c0648769a73afac7f9381e08fb43dbea72`

You can find more details on how to configure your development network [here](https://github.com/paritytech/parity/wiki/Private-development-chain).

If you're on a Unix machine (i.e. Ubuntu, OSX, etc), then you can run the `run_dev_network.sh` script in the `bin` directory. This will start a parity node running the dev network with all of the jsonrpc apis open and the funded account unlocked.

```
./bin/run_dev_network.sh
```

Once your node is running, ensure that the node project is configured (i.e. packages installed), open a new terminal and run the following:

```
npm run publish_contract -s
```
Note: The `-s` flag is to prevent npm from noisily erroring out when the process exits with a non-zero exit code. If you are for experiencing problems that I don't describe in the README or you don't understand, try removing the flag to get the complete error output from npm.

If this is your first time running that command, the most likely outcome is that it resulted in an error. The error message should be something along the lines of:

```
ERROR:
No ABI or binary available for contract. Please compile contract
Compile using the following command:
    solc --bin --abi -o target contracts/Adoption.sol
```

Until you compile the contracts using the above `solc` command, the abi and binary files for the contract at `contracts/Adoption.sol` will not be available for the `publish_contract` script to use to deploy the contract. So run `solc --bin --abi -o target contracts/Adoption.sol` and then try running `publish_contract` again.

Hopefully at this point, all has gone well and you will see output indicating that the deploy transaction has been mined and the contract address and the transaction receipt have been provided.

Congratulations! You've just deployed your smart contract to your local dev network!

### Ropsten or other networks
Once you've deployed to your dev network, you should give deploying to Ropsten, Rinkeby or another dev network a shot. The deployment process can be quite different when your transactions are not mined immediately as they are in dev.

To do this, you can run the `run_ropsten_network.sh` script in the `./bin/` directory. This script requires a bit more input and preparation on your part before it is useful, though. The steps required of you are:
* Create a new account - Keep track of the password you used for this test account. You will need it shortly.
* Fund the account - Try using a faucet for your target network. Some Ropsten faucets:
    * http://faucet.ropsten.be:3001/
    * https://faucet.kyber.network/
* Create a file in the root project directory called `user.pwds` containing the address and password for your test ETH account. This will simply need to be a file containing the account password on a single line.

Once those steps are completed and your account is funded, start your test chain network.

```
./bin/run_ropsten_network.sh
```

Then, as you did on the dev network, run the `publish_contract` script, though this time with one modification. You need to pass in the address that will be funding the deployement transaction to the script.

```
npm run publish_contract -s <deployment_address>
```

Assuming you've got the abi and the binary available, this script should prepare and send the transaction to deploy the Adoption contract to the test network. The process will be much slower than it was in dev. You've published a contract to a live network, so the transaction needs to propagate to miners and selected by those miners to include in a block. Depending on the miners, this could take a few minutes. Usually, however, after a few seconds you'll see the same output you saw in dev, indicating that the deploy transaction has been mined and that the contract is available at the specified address.

There you have it. Your contract is deployed to a real, live test network. To deploy to the mainnet, simply run your parity node connected to mainnet, apply the same steps above and fire away. Be prepared, though, because these steps will now cost *real Ether*. Don't take these actions until you're comfortable with the dev and testnet deployment process.
