const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const addressList = require('./addressList')

const leafNodes = addressList.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

console.log("whole merkle tree", merkleTree.toString())

const rootHash = merkleTree.getRoot();
const rootHashBytes32 = '0x' + merkleTree.getRoot().toString('hex')

console.log("rootHash_0x:", rootHashBytes32)

// final root hash = 0x8132893218fc041ac039be48d18ff3dbb964a7d21ed845674ffbcd5d3d1fca77


/* for one off testing if address is in the final tree



const claimingAddress = leafNodes[2];
const hexProof = merkleTree.getHexProof(claimingAddress);
console.log("final verification: ", merkleTree.verify(hexProof, claimingAddress, rootHash));


*/