import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const deploy = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;
  let waitConfirmations;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
    waitConfirmations = 0;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId!].ethUsdPriceFeed;
    waitConfirmations = 6;
  }

  const args = [ethUsdPriceFeedAddress];

  log('Deploying FundMe...')
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args,
    log: true,
    waitConfirmations,
  });
  log('FundMe deployed!')

  if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
    await verify(fundMe.address, args)
  }
};

export default deploy;

deploy.tags = ["all", "fundMe"];
