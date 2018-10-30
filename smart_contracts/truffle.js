/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

var HDWalletProvider = require('truffle-hdwallet-provider');
var mnemonic = "catch craft gold ivory adjust acquire into goose ugly edit immune bus"
var privateKey = "0x9b623f24e9f112448f6be4e6331753b3d3932312ab85be86592d4ffb247126f0"

module.exports = {
  networks: {
    develpment: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/54afdf5d4e7444629d97bea7958ffe03')
      },
      network_id: 4,
      //from: "0x70ad1442792fc4baecba91765d1ac6659c8cb8ab",
      gas: 7000000,
      gasPrice: 10000000000,
    }
  }
};
