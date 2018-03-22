#!/usr/bin/env bash

if [ "$#" -lt 1 ]; then
    echo "Must specify the address that will be used to deploy contract."
    echo "Usage: ./run_ropsten_network.sh <deploy_address> [<passwords_file>]"
    echo "  Ex: "
    echo "    ./run_ropsten_network.sh 0x00a329c0648769a73afac7f9381e08fb43dbea72 user.pwds"
fi

deploy_address=$1
passwords_file=${2:-user.pwds}

echo "Using file at user.pwds for account passwords"
parity --chain ropsten --min-peers=100 --max-peers=100 --jsonrpc-apis=all --unlock $deploy_address --password user.pwds
