import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DECIMALS,
  INITIAL_ANSWER,
  developmentChains,
} from "../helper-hardhat-config";

const deploy = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("Deploying mocks...");

    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });

    log("Mocks deployed!");
  }
};

export default deploy;

deploy.tags = ["all", "mocks"];