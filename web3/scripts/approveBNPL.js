const hre = require('hardhat')

async function main() {
    const contractAddress1 = '0x920470bF8142a4bB4E960B5f17d79a6A1b7549dD'
    const contractAddress2 = '0x9DBFa7c14cfb32b91c61a0B5B23c1CC1796fFBD2'
    const contractAddress3 = '0x5541FF6B03cc2eBF443BeD3Bf3bebF9016A6225F'
    const contractAddress4 = '0x63c44637395F93D59Ed4298370183492d89694cF'
    const contractAddress5 = '0xe0939Fb9D1cA59a54B0C809920bb7436Ce69bBE4'

    const tokenAddresses = [
        contractAddress1,
        contractAddress2,
        contractAddress3,
        contractAddress4,
        contractAddress5,
    ]

    const contractAbi = [
        'function mint(address to) public',
        'function tokenURI(uint256 tokenId) public',
        'function approve(address to, uint256 tokenId) external',
    ]

    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    for(let tokenAddress of tokenAddresses) {
      const contract = new ethers.Contract(tokenAddress, contractAbi, wallet)
      const tx0 = await contract.approve(
          '0x37da7F65d3BAb7f329Dc87A8bA6F17D7a8536464',
          1
      )
      await tx0.wait()
      const tx1 = await contract.approve(
          '0x37da7F65d3BAb7f329Dc87A8bA6F17D7a8536464',
          2
      )
      await tx1.wait()
      console.log('✅ bnpl approved for 2 nfts')
    }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
