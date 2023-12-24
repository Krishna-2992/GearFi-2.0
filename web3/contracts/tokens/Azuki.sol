// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract Azuki is ERC721URIStorage, Ownable {
//     uint256 internal tokenId;

//     constructor() ERC721("Azuki", "AZUKI") {}

//     function mint(address to) public {
//         _safeMint(to, tokenId);
//         unchecked {
//             tokenId++;
//         }
//     }

//     function _baseURI() internal pure override returns (string memory) {
//         return "ipfs://QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4";
//     }
// }