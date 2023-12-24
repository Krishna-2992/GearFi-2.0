// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract Milady is ERC721URIStorage, Ownable {
//     uint256 internal tokenId;

//     constructor() ERC721("Milady", "MIL") {}

//     function mint(address to) public {
//         _safeMint(to, tokenId);
//         unchecked {
//             tokenId++;
//         }
//     }

//     function _baseURI() internal pure override returns (string memory) {
//         return "https://www.miladymaker.net/milady/json/";
//     }
// }