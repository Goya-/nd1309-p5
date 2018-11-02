## install and run
1. `cd smart_contracts`
2. `npm i`
3. `ganache-cli` run localhost develpment environment
4. `truffle test` run code test
5. `truffle compiler` get abi 
6. `truffle deploy --network rinkeby -f 2 --reset` deploy smartcontracts to Rinkeby
7. `truffle deploy --network develpment -f 2 --reset` deploy smartcontracts to local
7. cogy abi in *SatarNotary.json* and *SatarNotary*(develpment) in console, replace code in *index.html*
8. open  *index.html*

## smart contract on a public test network (Rinkeby)
1. Transaction ID(createStar()): `0x5ad3edfb721d73dffac7eb92ac06dff2cfda9976decca827e6fa32d0ae9761b3`
2. Transaction ID(putStarUpForSale()): `0x6120de457ebe3790be5a51fa5eb972d79a4d9b94fb42b0832dc98f2f3b912252`
3. Contract address: `0x65c970e9c2e984d581980d421ee56333448e17dc`