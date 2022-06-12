const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const addressList = require('./addressList')

const leafNodes = addressList.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

console.log("whole merkle tree", merkleTree.toString())

const rootHash = merkleTree.getRoot();
const rootHashBytes32 = '0x' + merkleTree.getRoot().toString('hex')

console.log("rootHash_0x:", rootHashBytes32)

// final root hash = 0xa6f5476e67c0641efc5c7bc19198e5768c87ab6bc6a0ed05712ceed4432e82df

/* for one off testing if address is in the final tree

const claimingAddress = leafNodes[x];
const hexProof = merkleTree.getHexProof(claimingAddress);
console.log("final verification: ", merkleTree.verify(hexProof, claimingAddress, rootHash));

*/