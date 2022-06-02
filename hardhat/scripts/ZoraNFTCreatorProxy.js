// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
const API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_DEPLOYER_KEY;
const CONTRACT_ADDRESS = "0x2d2acD205bd6d9D0B3E79990e093768375AD3a30"

// rinkeby - ZoraNFTCreatorProxy : 0x2d2acD205bd6d9D0B3E79990e093768375AD3a30
// mainnet - ZoraNFTCreatorProxy :


// initiates file holding ERC721DropProxy abi
const contract = require("../node_modules/@zoralabs/nft-drop-contracts/dist/artifacts/ZoraNFTCreatorProxy.sol/ZoraNFTCreatorProxy.json");
const { ethers } = require("hardhat");

// Provider
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const ZoraNFTCreatorProxy = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer)

const createDropArgs = [
   "test project", // name - string
   "TEST", // symbol - string
   "0xA02555D67adB4C9DA3688363413550330d79F420", // defaultAdmin - address
   10, // editionSize - uint64
   500, // royaltyBPS - uint16
   "0x806164c929Ad3A6f4bd70c2370b3Ef36c64dEaa8", // fundsRecipient - address
   [ // comments come from IERC721Drop.sol contract
     0, // publicSalePrice (ETH) - uint104
     0, // maxSalePurchasePerAddress - uint32
     186, // publicSaleStart - uint64
     250, // publicSaleEnd - uint64
     "", // presaleStart - uint64
     "", // presaleEnd - uint64
     "", // presaleMerkleRoot - bytes32
   ], // salesConfig - tuple
   "ipfs://test_URIBase", // metadataURIBase - string
   "ipfs://ContractURI", // metadataContractURI - string
]

// contract params for ZoraNFTCreatorProxy are as follows : 

// name (string)
// symbol (string)
// defaultAdmin (address)
// editionSize (uint64)
// royaltyBPS (uint16) - 100 = 1%
// fundsRecipient (address)
// salesConfig (tuple) - see below for detailed breakdown
// metadataURIBase (string) - asdf
// metadataContractURI (string) - asdf


// struct SalesConfiguration {
//   /// @dev Public sale price (max ether value > 1000 ether with this value)
//   uint104 publicSalePrice;
//   /// @notice Purchase mint limit per address (if set to 0 === unlimited mints)
//   /// @dev Max purchase number per txn (90+32 = 122)
//   uint32 maxSalePurchasePerAddress;
//   /// @dev uint64 type allows for dates into 292 billion years
//   /// @notice Public sale start timestamp (block.timestamp)
//   uint64 publicSaleStart;
//   /// @notice Public sale end timestamp (block.timestamp)
//   uint64 publicSaleEnd;
//   /// @notice Presale start timestamp
//   /// @dev new storage slot
//   uint64 presaleStart;
//   /// @notice Presale end timestamp
//   uint64 presaleEnd;
//   /// @notice Presale merkle root
//   bytes32 presaleMerkleRoot;
// }

async function main() {
   
   const createDrop = await ZoraNFTCreatorProxy.createDrop(createDropArgs)
   await createDrop.wait()
   console.log("transaction successsfull, check etherscan for confirmation")
   
   // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
//   const _creatorDropProxy = await hre.ethers.getContractFactory("contract");
//   const CreatorDropProxy = await _creatorDropProxy.createDrop(createDropArgs);

//   await CreatorDropProxy.deployed();

//   console.log("Greeter deployed to:", CreatorDropProxy.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
