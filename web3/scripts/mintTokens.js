const hre = require('hardhat')

async function main() {
    const contractAddress1 = '0x63c44637395F93D59Ed4298370183492d89694cF'
    const contractAddress2 = '0x9DBFa7c14cfb32b91c61a0B5B23c1CC1796fFBD2'
    const contractAddress3 = '0x5541FF6B03cc2eBF443BeD3Bf3bebF9016A6225F'
    const contractAddress4 = '0x920470bF8142a4bB4E960B5f17d79a6A1b7549dD'
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
    ]

    const provider = new ethers.JsonRpcProvider(process.env.MUMBAI_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)


      const contract = new ethers.Contract(contractAddress2, contractAbi, wallet)
      const tx = await contract.mint("0x12cec4db3c41283139742ffff9866e2e6df91e53")
      await tx.wait()
      console.log('✅ nft minted for 2')
      const contract2 = new ethers.Contract(contractAddress3, contractAbi, wallet)
      const tx2 = await contract.mint("0x12cec4db3c41283139742ffff9866e2e6df91e53")
      await tx2.wait()
      console.log('✅ nft minted for 3')
      const contract3 = new ethers.Contract(contractAddress4, contractAbi, wallet)
      const tx3 = await contract3.mint("0x12cec4db3c41283139742ffff9866e2e6df91e53")
      await tx3.wait()
      console.log('✅ nft minted for 4')
      const contract4 = new ethers.Contract(contractAddress5, contractAbi, wallet)
      const tx4 = await contract4.mint("0x12cec4db3c41283139742ffff9866e2e6df91e53")
      await tx4.wait()
      console.log('✅ nft minted for 5')


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
