const hre = require("hardhat");

async function main() {

  const marketplace = await hre.ethers.getContractFactory("freelancerMarketplace");
  const freelancerMarketPlace = await marketplace.deploy();
  await freelancerMarketPlace.deployed();
  console.log("freelancerMarketplace deployed to:", freelancerMarketPlace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
