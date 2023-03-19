## Module Install

```sh
npm ci
```

- Compile

```sh
npx hardhat compile
```

- Test

```sh
npx hardhat test
```

## Deploy

```sh
npx hardhat run scripts/deploy.js --network goerli
```

## Verify & Publish

```sh
npx hardhat verify scripts/deploy.js --network goerli
```

## Copy ABI

```sh
cp -r artifacts/contracts/DaoPass.sol/. ../frontend/src/abi/DaoPass
```

## Contract
shibuyaテストネット：0xD688acB676771F6aA01114c78A39E594564d3944
https://shibuya.subscan.io/account/0xD688acB676771F6aA01114c78A39E594564d3944
goerliテストネット：0xE8E9a8b52Db9C8afEF0e2F8DC288CF2B9DF27Cb3
https://goerli.etherscan.io/address/0xE8E9a8b52Db9C8afEF0e2F8DC288CF2B9DF27Cb3
https://goerli.etherscan.io/address/0xE8E9a8b52Db9C8afEF0e2F8DC288CF2B9DF27Cb3#code
