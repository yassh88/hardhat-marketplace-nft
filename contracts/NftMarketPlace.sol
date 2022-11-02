// SPDX-License-Identifier: SEE LICENSE IN LICENSE

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NftMarketPlace_forListingPriceShouldNotZero();
error NftMarketPlace_NotApprovedFromMarketplace();
error NftMarketPlace_NotOwner();
error NftMarketPlace_ItemAlreadyListed(address nftAddress, uint256 tokenId);

contract NftMarketPlace {
  struct Listing {
    uint256 price;
    address seller;
  }

  // NFT-contract-addreess => nft token => listing
  mapping(address => mapping(uint256 => Listing)) private s_listing;

  //events
  event ItemListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
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

  constructor() {}
}
