import { ethers, getNamedAccounts, network } from "hardhat";
import { FundMe } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";
import { assert } from "chai";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundMe: FundMe;
      let deployer: string;
      const sendValue = ethers.utils.parseEther("0.05");

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows peoplw to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();

        const endingBalance = await fundMe.provider.getBalance(fundMe.address);

        assert.equal(endingBalance.toString(), "0");
      });
    });
