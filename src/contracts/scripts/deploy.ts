import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();

  const DaoPass = await ethers.getContractFactory("DaoPass", owner);
  const daoPass = await DaoPass.deploy();

  const contract = await daoPass.deployed();

  console.log("Contract deployed to: ", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
