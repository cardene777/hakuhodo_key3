import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DaoPass", function () {
  async function deployOneYearLockFixture() {
    const [owner, account1, account2, account3] = await ethers.getSigners();

    const DaoPass = await ethers.getContractFactory("DaoPass", owner);
    const daoPass = await DaoPass.deploy();

    return { daoPass, owner, account1, account2, account3 };
  }

  describe("Check Base Status", function () {
    it("Check token name & symbol", async function () {
      const { daoPass } = await loadFixture(deployOneYearLockFixture);

      expect(await daoPass.name()).to.equal("DaoPass Token");
      expect(await daoPass.symbol()).to.equal("HKHN");
      expect(await daoPass.valueDecimals()).to.equal(2);
    });
  });

  describe("Mint Token", function () {
    it("Mint Token", async function () {
      const { daoPass, account1 } = await loadFixture(
        deployOneYearLockFixture
      );

      await daoPass.connect(account1).mintToken();
      expect(await daoPass["balanceOf(address)"](account1.address)).to.equal(1);

    });
  });

  describe("Mint Value", function () {
    it("Mint Token", async function () {
      const { daoPass, owner, account1, account2, account3 } =
      await loadFixture(deployOneYearLockFixture);

      // account1 mint token
      const resultMintToken = await daoPass.connect(account1).mintToken();
      expect(await daoPass["balanceOf(address)"](account1.address)).to.equal(1);

      const receipt = await ethers.provider.getTransactionReceipt(
        resultMintToken.hash
      );

      console.log(`receipt: ${JSON.stringify(receipt.logs[0].topics[3])}`);

      // account2 mint token
      const resultMintTokenAccount2 = await daoPass
        .connect(account2)
        .mintToken();
      expect(await daoPass["balanceOf(address)"](account2.address)).to.equal(1);

      const receiptAccount2 = await ethers.provider.getTransactionReceipt(
        resultMintTokenAccount2.hash
      );

      console.log(
        `receiptAccount2: ${JSON.stringify(receiptAccount2.logs[0].topics[3])}`
      );

      // account3 mint token
      const resultMintTokenAccount3 = await daoPass
        .connect(account3)
        .mintToken();
      expect(await daoPass["balanceOf(address)"](account3.address)).to.equal(1);

      const receiptAccount3 = await ethers.provider.getTransactionReceipt(
        resultMintTokenAccount3.hash
      );

      console.log(
        `receiptAccount3: ${JSON.stringify(receiptAccount3.logs[0].topics[3])}`
      );
    });

    it("Check Total Supply", async function () {
      const { daoPass, owner, account1, account2, account3 } =
        await loadFixture(deployOneYearLockFixture);

      // account1 mint token
      await daoPass.connect(account1).mintToken();

      // account2 mint token
      await daoPass
        .connect(account2)
        .mintToken();

      // account3 mint token
      await daoPass
        .connect(account3)
        .mintToken();

      expect(await daoPass.totalSupply()).to.equal(3);

    });

    it("Vote", async function () {
      const { daoPass, owner, account1, account2, account3 } =
        await loadFixture(deployOneYearLockFixture);

      // account1 mint token
      await daoPass.connect(account1).mintToken();

      // account2 mint token
      await daoPass.connect(account2).mintToken();

      // account3 mint token
      await daoPass.connect(account3).mintToken();

      // account1 vote (proposalId = 1)
      await daoPass.connect(account1).vote(1, 1);
      const checkSbtAccount1Proposal1 = await daoPass
        .connect(account1)
        .voteProposal(account1.address, 1);
      expect(checkSbtAccount1Proposal1).to.equal(true);

      // account1 vote (proposalId = 2)
      await daoPass.connect(account1).vote(2, 1);
      const checkSbtAccount1Proposal2 = await daoPass
        .connect(account1)
        .voteProposal(account1.address, 2);
      expect(checkSbtAccount1Proposal2).to.equal(true);

      // account2 vote (proposalId = 1)
      await daoPass.connect(account2).vote(1, 2);
      const checkSbtAccount2Proposal1 = await daoPass
        .connect(account2)
        .voteProposal(account2.address, 1);
      expect(checkSbtAccount2Proposal1).to.equal(true);

      // account3 vote (proposalId = 3)
      await daoPass.connect(account3).vote(3, 3);
      const checkSbtAccount3Proposal3 = await daoPass
        .connect(account3)
        .voteProposal(account3.address, 3);
      expect(checkSbtAccount3Proposal3).to.equal(true);
    });

    it("Check Token Value", async function () {
      const { daoPass, owner, account1, account2, account3 } =
        await loadFixture(deployOneYearLockFixture);

      // account1 mint token
      await daoPass.connect(account1).mintToken();

      // account2 mint token
      await daoPass.connect(account2).mintToken();

      // account3 mint token
      await daoPass.connect(account3).mintToken();

      // account1 vote (proposalId = 1)
      await daoPass.connect(account1).vote(1, 1);

      // account1 vote (proposalId = 2)
      await daoPass.connect(account1).vote(2, 1);

      // account2 vote (proposalId = 1)
      await daoPass.connect(account2).vote(1, 2);

      // account3 vote (proposalId = 3)
      await daoPass.connect(account3).vote(3, 3);

      // account1 token owner
      expect(await daoPass.connect(account1).ownerOf(1)).to.equal(
        account1.address
      );

      // account2 token owner
      expect(await daoPass.connect(account2).ownerOf(2)).to.equal(
        account2.address
      );

      // account3 token owner
      expect(
        await daoPass.connect(account3).ownerOf(3)
      ).to.equal(account3.address);
    });

    it("Check Token Value", async function () {
      const { daoPass, owner, account1, account2, account3 } =
        await loadFixture(deployOneYearLockFixture);

      // account1 mint token
      await daoPass.connect(account1).mintToken();

      // account2 mint token
      await daoPass.connect(account2).mintToken();

      // account3 mint token
      await daoPass.connect(account3).mintToken();

      // account1 vote (proposalId = 1)
      await daoPass.connect(account1).vote(1, 1);

      // account1 vote (proposalId = 2)
      await daoPass.connect(account1).vote(2, 1);

      // account2 vote (proposalId = 1)
      await daoPass.connect(account2).vote(1, 2);

      // account3 vote (proposalId = 3)
      await daoPass.connect(account3).vote(3, 3);

      // account1 token value
      expect(
        await daoPass.connect(account1)["balanceOf(uint256)"](1)
      ).to.equal(3);
      // account2 token value
      expect(
        await daoPass.connect(account2)["balanceOf(uint256)"](2)
      ).to.equal(2);
      // account3 token value
      expect(
        await daoPass.connect(account3)["balanceOf(uint256)"](3)
      ).to.equal(2);
    });
  });
});
