// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();

contract BNPL is ReentrancyGuard, IERC721Receiver {
    enum LoanState {
        Created,
        Active,
        Repaid,
        MarginListed,
        Claimed
    }

    struct LoanData {
        address buyer;
        uint256 loanAmount;
        LoanState state;
    }

    struct Listing {
        address seller;
        uint256 price;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemMarginListed(
        address indexed pseudoSeller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed nftAddress,
        uint256 indexed tokenId,
        LoanData loanData
    );

    event MarginTraded(address indexed nftAddress, uint256 indexed tokenId);

    event FundsDeposited(address indexed spender, uint256 amount);

    event FundsWithdrawn(address indexed spender, uint256 amount);

    event LoanRepaid(address nftAddress, uint256 tokenId, LoanState newState);

    // State Variables
    mapping(address => mapping(uint256 => Listing)) private s_listings;
    mapping(address => mapping(uint256 => LoanData)) private s_loan;
    mapping(address => mapping(uint256 => uint256)) private s_repayments;
    mapping(address => mapping(uint256 => Listing)) private s_marginListings;
    mapping(address => uint256) private s_deposits;
    uint256 private downpayment = 30;

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        require(spender == owner, "Not the owner");
        _;
    }

    modifier isCollateralized(address nftAddress, uint256 tokenId) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        require(address(this) == owner, "NFT isn't collateralized");
        _;
    }

    modifier notListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        Listing memory marginListing = s_marginListings[nftAddress][tokenId];

        require(listing.price == 0, "Already listed");
        require(marginListing.price == 0, "Already listed for Margin Sale");
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        Listing memory marginListing = s_marginListings[nftAddress][tokenId];
        require(listing.price > 0 || marginListing.price > 0, "Not Listed");
        _;
    }

    // modifier isMarginListed(address nftAddress, uint256 tokenId) {

    //     require(marginListing.price > 0, "Not listed");
    //     _;
    // }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 _price
    )
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        require(_price > 0, "Price must be above zero");

        IERC721 nft = IERC721(nftAddress);

        //Approval needed for transfer of NFT from seller to vault
        require(
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        //Listiing created
        s_listings[nftAddress][tokenId] = Listing({
            seller: msg.sender,
            price: _price
        });

        emit ItemListed(msg.sender, nftAddress, tokenId, _price);
    }

    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function initializeLoan(
        LoanData memory loan,
        address nftAddress,
        uint256 tokenId
    ) internal {
        s_loan[nftAddress][tokenId] = loan;
    }

    function closeLoan(address nftAddress, uint256 tokenId) internal {
        delete s_loan[nftAddress][tokenId];
    }

    function bnplInitiate(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];

        require(
            msg.value >= (listedItem.price * downpayment) / 100,
            "Price not met"
        );

        //adding msg.value to repayments will lead to inaccurate loan Amount
        // s_repayments[nftAddress][tokenId] += msg.value;

        delete s_listings[nftAddress][tokenId];

        uint256 _loanAmount = listedItem.price - msg.value;

        LoanData memory loan = LoanData({
            buyer: msg.sender,
            loanAmount: _loanAmount,
            state: LoanState.Active
        });

        //Loan initialized for current buyer
        initializeLoan(loan, nftAddress, tokenId);

        //NFT price transferred to Seller
        (bool success, ) = listedItem.seller.call{value: listedItem.price}("");
        require(success, "Transfer of collateral failed.");

        //NFT transferred to Vault
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            address(this),
            tokenId
        );

        emit ItemBought(nftAddress, tokenId, s_loan[nftAddress][tokenId]);
    }

    function marginList(
        address nftAddress,
        uint256 tokenId,
        uint256 _price
    )
        external
        isCollateralized(nftAddress, tokenId)
        notListed(nftAddress, tokenId)
    {
        require(_price > 0, "Price must be above zero");
        require(
            s_loan[nftAddress][tokenId].buyer == msg.sender,
            "Only partial owner of NFT can list for Margin Sale"
        );
        require(
            s_loan[nftAddress][tokenId].state == LoanState.Active,
            "Loan should be active for Marging Listing"
        );
        require(
            s_loan[nftAddress][tokenId].state != LoanState.Repaid,
            "Loan should not be repaid for Marging Listing"
        );

        Listing memory ls = Listing({seller: msg.sender, price: _price});

        //Margin Listing Created
        s_marginListings[nftAddress][tokenId] = ls;

        //Loan state set to MarginListed
        s_loan[nftAddress][tokenId].state = LoanState.MarginListed;

        emit ItemMarginListed(msg.sender, nftAddress, tokenId, _price);
    }

    function cancelMarginListing(address nftAddress, uint256 tokenId)
        external
        isListed(nftAddress, tokenId)
    {
          require(
            s_loan[nftAddress][tokenId].buyer == msg.sender,
            "Only partial owner of NFT can cancel list for Margin Sale"
        );
        // s_loan[nftAddress][tokenId].state = LoanState.Active;
        delete (s_marginListings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    function marginInitiate(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        Listing memory marginListing = s_marginListings[nftAddress][tokenId];

        require(
            msg.value >= (marginListing.price * downpayment) / 100,
            "Price not met"
        );

        //Profit of NFT seller
        uint256 sellerCut = marginListing.price -
            s_loan[nftAddress][tokenId].loanAmount +
            s_repayments[nftAddress][tokenId];

        //Close seller's Loan
        closeLoan(nftAddress, tokenId);

        //Transfer seller's profit
        (bool success, ) = marginListing.seller.call{value: sellerCut}("");
        require(success, "Transfer failed.");

        //Loan Amount for new Buyer
        uint256 _loanAmount = marginListing.price - msg.value;

        LoanData memory loan = LoanData({
            buyer: msg.sender,
            loanAmount: _loanAmount,
            state: LoanState.Active
        });

        initializeLoan(loan, nftAddress, tokenId);

        delete s_marginListings[nftAddress][tokenId];

        emit MarginTraded(nftAddress, tokenId);
    }

    function repay(address nftAddress, uint256 tokenId)
        external
        payable
        nonReentrant
    {
        LoanData memory loanData = s_loan[nftAddress][tokenId];
        require(
            msg.sender == loanData.buyer,
            "You are not the buyer of this item."
        );
        require(msg.value > 0, "Repayment amount must be greater than zero.");

        require(
            loanData.state != LoanState.Repaid &&
                loanData.state != LoanState.Claimed,
            "Loan already Repaid"
        );

        uint256 remainingLoanAmount = loanData.loanAmount -
            s_repayments[nftAddress][tokenId];

        require(
            msg.value <= remainingLoanAmount,
            "Repayment amount exceeds the remaining loan amount."
        );

        s_repayments[nftAddress][tokenId] += msg.value;

        if (s_repayments[nftAddress][tokenId] >= loanData.loanAmount) {
            loanData.state = LoanState.Repaid;
            emit LoanRepaid(nftAddress, tokenId, loanData.state);
        }
    }

    function claimNFTbyBuyer(address nftAddress, uint256 tokenId) public {
        require(
            msg.sender == s_loan[nftAddress][tokenId].buyer,
            "Only buyer can claim NFT"
        );

        require(
            s_loan[nftAddress][tokenId].state != LoanState.Claimed,
            "NFT already Claimed"
        );

        require(
            s_loan[nftAddress][tokenId].state == LoanState.Repaid,
            "Cannot claim with due payment"
        );

        //Transfer NFT to Buyer
        IERC721(nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        s_loan[nftAddress][tokenId].state = LoanState.Claimed;
        //Compatible for both ERC721 & ERC1155
    }

    // Deposit funds function
    function deposit() external payable nonReentrant {
        s_deposits[msg.sender] += msg.value;

        emit FundsDeposited(msg.sender, msg.value);
    }

    //function to widhraw funds
    function withdraw(uint256 amount) external nonReentrant {
        uint256 balance = s_deposits[msg.sender];

        require(balance > 0, "No proceeds to withdraw.");

        require(amount <= balance, "Withdraw cannot exceed deposit.");

        require(amount <= address(this).balance, "Not enough ether in vault.");

        s_deposits[msg.sender] -= amount;

        //Amount transferred to depositor
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed.");

        emit FundsWithdrawn(msg.sender, amount);
    }

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getMarginListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_marginListings[nftAddress][tokenId];
    }

    function getLoanData(address nftAddress, uint256 tokenId)
        external
        view
        returns (LoanData memory)
    {
        return s_loan[nftAddress][tokenId];
    }

    function getBalance(address spender) external view returns (uint256) {
        return s_deposits[spender];
    }

    function getRepayments(address nftAddress, uint256 tokenId)
        external
        view
        returns (uint256)
    {
        return s_repayments[nftAddress][tokenId];
    }

    function getVaultBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

}