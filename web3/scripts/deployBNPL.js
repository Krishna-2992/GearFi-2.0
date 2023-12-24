const hre = require("hardhat");

async function main() {
  const BNPL = await hre.ethers.getContractFactory("BNPL")
  const bnpl = await BNPL.deploy()
  console.log('✅ Address of BNPL is', bnpl.target)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
