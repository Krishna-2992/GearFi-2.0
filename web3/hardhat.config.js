require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

const MUMBAI_URL = process.env.MUMBAI_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    polygonMumbai: {
      url: MUMBAI_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
