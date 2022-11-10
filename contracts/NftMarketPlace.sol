// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketPlace_forListingPriceShouldNotZero();
error NftMarketPlace_NotApprovedFromMarketplace();
error NftMarketPlace_NotOwner();
error NftMarketPlace_ItemAlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketPlace_NotListed(address nftAddress, uint256 tokenId);
error NftMarketPlace_PriceNotMeet(
  address nftAddress,
  uint256 tokenId,
  uint256 price
);
error NftMarketPlace_NothingForWithdraw(address saller);
error NftMarketPlace_TransferFailed(address saller);

contract NftMarketPlace is ReentrancyGuard {
  struct Listing {
    uint256 price;
    address seller;
  }

  // NFT-contract-addreess => nft token => listing
  mapping(address => mapping(uint256 => Listing)) private s_listing;
  mapping(address => uint256) private s_proceeds;
  //events
  event ItemListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );
  event ItemBought(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  event ItemCancelFromListing(
    address indexed nftAddress,
    uint256 indexed tokenId
  );

  modifier notListed(
    address nftAddress,
    uint256 tokenId,
    address owner
  ) {
    Listing memory item = s_listing[nftAddress][tokenId];
    if (item.price > 0) {
      revert NftMarketPlace_ItemAlreadyListed(nftAddress, tokenId);
    }
    _;
  }

  modifier isListed(
    address nftAddress,
    uint256 tokenId,
    address owner
  ) {
    Listing memory item = s_listing[nftAddress][tokenId];
    if (item.price <= 0) {
      revert NftMarketPlace_NotListed(nftAddress, tokenId);
    }
    _;
  }

  modifier isOwner(
    address nftAddress,
    uint256 tokenId,
    address spender
  ) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if (owner != spender) {
      revert NftMarketPlace_NotOwner();
    }
    _;
  }

  function listItem(
    address nftAddress,
    uint256 tokenId,
    uint256 price
  )
    external
    notListed(nftAddress, tokenId, msg.sender)
    isOwner(nftAddress, tokenId, msg.sender)
  {
    if (price <= 0) {
      revert NftMarketPlace_forListingPriceShouldNotZero();
    }
    IERC721 nft = IERC721(nftAddress);
    if (nft.getApproved(tokenId) != address(this)) {
      revert NftMarketPlace_NotApprovedFromMarketplace();
    }
    s_listing[nftAddress][tokenId] = Listing(price, msg.sender);
    emit ItemListed(msg.sender, nftAddress, tokenId, price);
  }

  function buyItem(address nftAddress, uint256 tokenId)
    external
    payable
    isListed(nftAddress, tokenId, msg.sender)
    nonReentrant
  {
    Listing memory item = s_listing[nftAddress][tokenId];
    if (msg.value < item.price) {
      revert NftMarketPlace_PriceNotMeet(nftAddress, tokenId, item.price);
    }
    s_proceeds[item.seller] = s_proceeds[item.seller] + msg.value;
    delete (s_listing[nftAddress][tokenId]);
    IERC721(nftAddress).safeTransferFrom(item.seller, msg.sender, tokenId);
    emit ItemBought(nftAddress, item.seller, tokenId, msg.value);
  }

  function cancelListing(address nftAddress, uint256 tokenId)
    external
    isListed(nftAddress, tokenId, msg.sender)
    isOwner(nftAddress, tokenId, msg.sender)
  {
    delete (s_listing[nftAddress][tokenId]);
    emit ItemCancelFromListing(nftAddress, tokenId);
  }

  function updateListing(
    address nftAddress,
    uint256 tokenId,
    uint256 newPrice
  )
    external
    isListed(nftAddress, tokenId, msg.sender)
    isOwner(nftAddress, tokenId, msg.sender)
  {
    s_listing[nftAddress][tokenId].price = newPrice;
    emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
  }

  function withdrawProceed() external payable nonReentrant {
    if (s_proceeds[msg.sender] < 0) {
      revert NftMarketPlace_NothingForWithdraw(msg.sender);
    }
    s_proceeds[msg.sender] = 0;
    (bool success, ) = payable(msg.sender).call{value: s_proceeds[msg.sender]}(
      ""
    );
    if (success) {
      revert NftMarketPlace_TransferFailed(msg.sender);
    }
  }

  function getListing(address nftAddress, uint256 tokenId)
    external
    view
    returns (Listing memory)
  {
    return s_listing[nftAddress][tokenId];
  }

  function getProceeds(address seller) external view returns (uint256) {
    return s_proceeds[seller];
  }

  constructor() {}
}
