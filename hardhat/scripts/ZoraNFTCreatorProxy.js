// ************* DO NOT PUSH REPO BEFORE DELETING KEYS *************
// ********** ********** ********** ********** ********** **********


// setting variables for API key, deployer key, and desired network
const API_KEY = ""
const PRIVATE_KEY = ""
const ZoraNFTCreatorProxy_ADDRESS_RINKEBY = "0x2d2acD205bd6d9D0B3E79990e093768375AD3a30"
const ZoraNFTCreatorProxy_ADDRESS_MAINNET = "0xF74B146ce44CC162b601deC3BE331784DB111DC1"
// const privateKeyTest = process.env.NEXT_PUBLIC_DEPLOYER_KEY

// set proxyAddress = to rinkeby or mainnet variable
const proxyAddress = ZoraNFTCreatorProxy_ADDRESS_RINKEBY

// instantiates pointer to file containing ZoraNFTCreatorV1 abi. THIS IS CONFUSING since you are 
// interacting w/ the ZoraNFTCreatorProxy contract, but passing in the abi for the contract the proxy talks to
const ZoraNFTCreatorV1_ABI = require("../node_modules/@zoralabs/nft-drop-contracts/dist/artifacts/ZoraNFTCreatorV1.sol/ZoraNFTCreatorV1.json");
const { ethers } = require("hardhat");

// instantiating ethers provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// instantiating ethers signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// instantiating ZoraNFTCreatorProxy contract to call later
const ZoraNFTCreatorProxy = new ethers.Contract(proxyAddress, ZoraNFTCreatorV1_ABI.abi, signer)

// hardcode desired mint price in ether as a string
const price = "0.01" 

// setting arguments that we will be passing into the createDrop function
// ===== contract params for ZoraNFTCreatorProxy are as follows : 

// name (string)
// symbol (string)
// defaultAdmin (address)
// editionSize (uint64)
// royaltyBPS (uint16) --> 100 bps = 1%
// fundsRecipient (address)
// salesConfig (tuple) - see below for detailed breakdown
// metadataURIBase (string) - current mint number will be appended to end of this string upon each mint
// metadataContractURI (string) - still not sure

// ===== salesConfig (tuple) params are as follows:

// publicSalePrice (uint104) - mint price in wei
// maxSalePurchasePerAddress (uint32) - purchase mint limit per address (if set to 0 === unlimited mints)
// publicSaleStart (uint64) - public sale start timestamp (block.timestamp) - helpful link for getting current timestamp -> https://www.unixtimestamp.com/
// publicSaleEnd (uint64) - public sale start timestamp (block.timestamp)
// presaleStart (uint64) - presale start timestamp (set to 0 if no presale)
// presaleEnd (uint64) - presale end timestamp (set to 0 if no presale)
// presaleMerkleRoot (bytes32) - set this to the following if not implementing an allowList: "0x0000000000000000000000000000000000000000000000000000000000000000"

const createDropArgs = [
   "Garden of Felt Zine Delights", // name - string
   "GFZD", // symbol - string
   "0xA02555D67adB4C9DA3688363413550330d79F420", // defaultAdmin - address
   500, // editionSize - uint64
   500, // royaltyBPS - uint16
   "0xA02555D67adB4C9DA3688363413550330d79F420", // fundsRecipient - address
   [ // salesConfig - tuple
     ethers.utils.parseEther(price), // publicSalePrice (wei) - uint104
     0, // maxSalePurchasePerAddress - uint32
     1654181910, // publicSaleStart - uint64
     5000000000, // publicSaleEnd - uint64
     0, // presaleStart - uint64
     0, // presaleEnd - uint64
     "0x0000000000000000000000000000000000000000000000000000000000000000", // presaleMerkleRoot - bytes32
  ], 
   "ipfs://QmWNQALTWsuxxvPGMeiP2i26yvKiQzq4MFuaRj3GzQvJ7A/", // metadataURIBase - string
   "ipfs://QmYfF2QHybZAovuk6XUgxFuNkAV9wS4s3QxLR5VTymDvPr/0.json" // metadataContractURI - string
]

async function main() {
  const createDrop = await ZoraNFTCreatorProxy.createDrop(
    createDropArgs[0], // Collection Name
    createDropArgs[1], // Collection Symbol
    createDropArgs[2], // Contract Admin
    createDropArgs[3], // Token Supply
    createDropArgs[4], // Royalty Bps
    createDropArgs[5], // Funds Recipient
    createDropArgs[6], // Sales Config
    createDropArgs[7], // metadataBaseURI
    createDropArgs[8], // metadataContractURI
  )
  const txResult = await createDrop.wait()
  console.log("Transaction successful!")
  console.log("NFT contract address =", txResult.logs[0].address)
  console.log("Transaction hash of NFT contract creation =", txResult.logs[0].transactionHash)
  // console.log("whats Private_Key", PRIVATE_KEY)
  // console.log("whats privateKeyTest", privateKeyTest)
  // console.log("whats api key", API_KEY)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/*

===== How everything works

1. load abi for ZoraNFTCreatorV1 contract (factory contract that allows you to create editions/collections)
2. instantiate the ZoraNFTCreatorProxy contract, passing in the abi for the ZoraNFTCreatorV1 contract
3. define the paramters you want to pass into the createDrop function
4. send a transaction to the ZoraNFTCreatorProxy contract calling the createDrop function
5. the ZoraNFTCreatorProxy contract will then make multiple calls to set up your NFT contract. One of which will be the creation of a contract called "ERC721DropProxy", which is actually your end product. On etherscan, you must confirm that it is indeed a proxy by going to the contract page, clicking the code tab, clicking the "More Options" button, and then clicking the "Is this a proxy?" dropdown
6. This will then take you to a UI that allows you to verify your contract as a proxy contract
7. Once complete, go back to your ERC721DropProxy contract and you can start interacting with it!

*/

  // direct copy of SalesConfig + SaleDetails structs specified in IERC721Drop.sol (file 11 of this contract https://rinkeby.etherscan.io/address/0xd0a79ded1e06b8e242ff4763d91c674dc6dcd67d#code)
  // front end can query SaleDetails to get # of mints + total supply, sale active status, etc.

  //     /// @notice Sales states and configuration
  //   /// @dev Uses 3 storage slots
  //   struct SalesConfiguration {
  //     /// @dev Public sale price (max ether value > 1000 ether with this value)
  //     uint104 publicSalePrice;
  //     /// @notice Purchase mint limit per address (if set to 0 === unlimited mints)
  //     /// @dev Max purchase number per txn (90+32 = 122)
  //     uint32 maxSalePurchasePerAddress;
  //     /// @dev uint64 type allows for dates into 292 billion years
  //     /// @notice Public sale start timestamp (136+64 = 186)
  //     uint64 publicSaleStart;
  //     /// @notice Public sale end timestamp (186+64 = 250)
  //     uint64 publicSaleEnd;
  //     /// @notice Presale start timestamp
  //     /// @dev new storage slot
  //     uint64 presaleStart;
  //     /// @notice Presale end timestamp
  //     uint64 presaleEnd;
  //     /// @notice Presale merkle root
  //     bytes32 presaleMerkleRoot;
  // }

  // /// @notice Return value for sales details to use with front-ends
  // struct SaleDetails {
  //     // Synthesized status variables for sale and presale
  //     bool publicSaleActive;
  //     bool presaleActive;
  //     // Price for public sale
  //     uint256 publicSalePrice;
  //     // Timed sale actions for public sale
  //     uint64 publicSaleStart;
  //     uint64 publicSaleEnd;
  //     // Timed sale actions for presale
  //     uint64 presaleStart;
  //     uint64 presaleEnd;
  //     // Merkle root (includes address, quantity, and price data for each entry)
  //     bytes32 presaleMerkleRoot;
  //     // Limit public sale to a specific number of mints per wallet
  //     uint256 maxSalePurchasePerAddress;
  //     // Information about the rest of the supply
  //     // Total that have been minted
  //     uint256 totalMinted;
  //     // The total supply available
  //     uint256 maxSupply;
  // }

  // example SalesConfiguration to pass into contract when if testing on etherscan:
  // [0, 0, 1654181910, 50000000000, 0, 0, "0x0000000000000000000000000000000000000000000000000000000000000000"]