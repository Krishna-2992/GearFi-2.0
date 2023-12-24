const hre = require('hardhat')

async function main() {
    const contractAddress1 = '0x63c44637395F93D59Ed4298370183492d89694cF'
    const contractAddress2 = '0x9DBFa7c14cfb32b91c61a0B5B23c1CC1796fFBD2'
    const contractAddress3 = '0x5541FF6B03cc2eBF443BeD3Bf3bebF9016A6225F'
    const contractAddress4 = '0x920470bF8142a4bB4E960B5f17d79a6A1b7549dD'
    const contractAddress5 = '0xe0939Fb9D1cA59a54B0C809920bb7436Ce69bBE4'

    const tokenAddresses = [
      contractAddress2,
      contractAddress3,
      contractAddress4,
      contractAddress5,
  ]

    const contractAbi = [
        'function mint(address to) public',
        'function tokenURI(uint256 tokenId) public',
        'function approve(address to, uint256 tokenId) external'
    ]

    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

      
      const contract = new ethers.Contract(contractAddress5, contractAbi, wallet)
      const tx0 = await contract.approve('0x1161bA51CDf4DDe9FCa75e9A0492A1a5B173C340', 1)
      const tx1 = await contract.approve('0x1161bA51CDf4DDe9FCa75e9A0492A1a5B173C340', 2)
      await tx0.wait()
      await tx1.wait()

    console.log('✅ bnpl approved for 1st nft token2')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
