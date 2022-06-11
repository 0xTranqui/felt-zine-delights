import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAccount, useContractWrite, useWaitForTransaction, useContractRead, etherscanBlockExplorers } from 'wagmi';
import { ethers, BigNumber } from 'ethers'

// import * as ERC721_abi from "../contractABI/abi.json"
import * as ERC721_abi from "../contractABI/abi2.json"

import MintQuantity from "../components/MintQuantity";
import { useAppContext } from '../context/appContext'
import { linkedNFTContract } from "../public/constants";
import PostMintDialog from "../components/PostMintDialog";
import { useEffect, useState } from "react";
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const addressList = require('../merkle-tree-gen/addressList');

const hellish = "#c23d05"

const Hell = () => {
   
   const { mintQuantity, setMintQuantity } = useAppContext()
   const [accountHexProof, setAccountHexProof] = useState(); 
   const [accountIncluded, setAccountIncluded] = useState("false");

   // get account hook
   const { data: account, isError: accountError, isLoading: accountLoading } = useAccount(); 
   const currentUserAddress = account ? account.address.toString() : ""

     // totalSupply read call
   const { data: totalSupplyData, isError: totalSupplyError, isLoading: totalSupplyLoading } = useContractRead(
      {
         addressOrName: linkedNFTContract,
         contractInterface: ERC721_abi.abi
      },      
      "totalSupply",
      {
         watch: true,
      },
      {
         onError(error) {
            console.log("error: ", error)
         },
         onSuccess(totalSupplyData) {
            console.log("totalSupply: ", totalSupplyData)
         },
      },   
   )
   
   const totalSupply = totalSupplyData ? totalSupplyData.toString() : "loading"
   const MAX_SUPPLY = "500"
   const publicMintPrice = "40000000000000000" // 0.04 eth
   const holderMintPrice = "20000000000000000" // 0.02 eth

   // checking current account for inclusion on allowlist
   const merkleMe = () => {

      const leafNodes = addressList.map(addr => keccak256(addr));
      const leafNodesHashStrings = leafNodes.map(addr => addr.toString('hex'))
      const accountKeccakdHashString = keccak256(currentUserAddress).toString('hex')
      const isIncluded = leafNodesHashStrings.includes(accountKeccakdHashString);
      setAccountIncluded(isIncluded)
      const claimingAddress = keccak256(currentUserAddress);

      if (isIncluded) {         
         const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
         const hexProof = merkleTree.getHexProof(claimingAddress);
         setAccountHexProof(hexProof);
         console.log("what hex prrof got passed in", hexProof);
      }
   }

   // holder mint write call

   const holderMintMsgValue = String(mintQuantity.queryValue * holderMintPrice);

   const { data: holderMintData, isError: holderMintError, isLoading: holderMintLoading, status: holderMintStatus, write: holderMintWrite } = useContractWrite(
      {
         addressOrName: linkedNFTContract,
         contractInterface: ERC721_abi.abi
      },
      "fzHoldersMint",
      {
         args: [
            mintQuantity.queryValue,
            accountHexProof,
            "Sinner"
         ],
         overrides: {
            value: holderMintMsgValue 
         },
         onError(error) {
            console.log("Error: ", error)
         }
      }
   )

   const { data: holderMintWaitData, isError: holderMintWaitError, isLoading: holderMintWaitLoading } = useWaitForTransaction({
      hash:  holderMintData?.hash,
      onSuccess(holderMintWaitData) {
         console.log("txn complete: ", holderMintWaitData)
         console.log("txn hash: ", holderMintWaitData.transactionHash)
      }
   })        

   // public mint write call information

   const publicMintMsgValue = String(mintQuantity.queryValue * publicMintPrice);
            
   const { data: publicMintData, isError: publicMintError, isLoading: publicMintLoading, status: publicMintStatus, write: publicMintWrite } = useContractWrite(
      {
         addressOrName: linkedNFTContract,
         contractInterface: ERC721_abi.abi
      },
      "publicMint",
      {
         args: [
            mintQuantity.queryValue,
            "Sinner"
         ],
         overrides: {
            value: publicMintMsgValue  
         },
         onError(error) {
            console.log("Error: ", error)
         }
      }
   )

   const { data: publicMintWaitData, isError: publicMintWaitError, isLoading: publicMintWaitLoading } = useWaitForTransaction({
      hash:  publicMintData?.hash,
      onSuccess(publicMintWaitData) {
         console.log("txn complete: ", publicMintWaitData)
         console.log("txn hash: ", publicMintWaitData.transactionHash)
      }
   })

   // function that calls public/holder mint depending on account logged in
   const masterMint = () => {

      if (accountIncluded) {
         holderMintWrite()
         
      } else {
         publicMintWrite()
      }
   }

   useEffect(() => {
      merkleMe();
      }, 
      [currentUserAddress]
   )

   return (
      <div className={` bg-[url("../public/hell_main_2.png")] bg-cover min-h-screen h-screen  text-[#c23d05]`}>
         <Header />
         <main className="h-full flex flex-col flex-wrap items-center justify-center  ">
            <div className="  flex flex-col flex-wrap items-center">
               <div className={`text-center p-8 mt-5 sm:mt-0 bg-black border-[16px] border-double border-[${hellish}] font-gothiccc text-7xl h-fit w-fit flex flex-row justify-center`} >
                  One of the Damned
               </div>
               <div className={`mt-20 mb-10 p-8  border-[16px] border-[${hellish}] border-double bg-black h-fit  `} >
                  <div className="text-center text-4xl h-fit w-full flex flex-row justify-center " >
                     Eternal Suffering Awaits
                  </div>
                  <div className="mt-8 w-full flex flex-row justify-center">
                     <MintQuantity colorScheme={hellish} />
                     <button 
                        className="flex flex-row justify-self-start  text-2xl  p-3  w-fit h-fit border-2 border-solid border-[#c23d05] hover:bg-[#c23d05] hover:text-black"
                        onClick={() => masterMint()}   
                     >
                        Mint
                     </button>
                  </div>
                  <PostMintDialog               
                     isHolder={accountIncluded}
                     publicTxnLoadingStatus={publicMintWaitLoading}
                     publicTxnSuccessStatus={publicMintStatus}
                     publicTxnHashLink={publicMintWaitData}
                     holderTxnLoadingStatus={holderMintWaitLoading}
                     holderTxnSuccessStatus={holderMintStatus}
                     holderTxnHashLink={holderMintWaitData}
                     colorScheme={hellish}
                  />
                  { publicMintWaitLoading == true || holderMintWaitLoading == true ? (
                     <div className="text-2xl mt-10 flex flex-row flex-wrap justify-center ">                    
                        <img
                           className="mb-8 w-fit flex flex-row justify-self-center items-center"
                           width="20px" 
                           src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                        />
                        <div className="w-full text-center">
                           {`${MAX_SUPPLY - totalSupply}` + " / " + `${MAX_SUPPLY}` + " Pieces Remaining"}
                        </div>
                     </div>   
                     ) : (                  
                     <div className="text-2xl mt-10 flex flex-row flex-wrap justify-center ">
                        <div className="w-full text-center">
                        {`${MAX_SUPPLY - totalSupply}` + " / " + `${MAX_SUPPLY}` + " Pieces Remaining"}
                        </div>
                     </div>                                          
                  )}
                  <Link href="/decisions">
                     <a className="mt-5 text-xl flex flex-row justify-center text-center">
                        ← BACK TO PURGATORY
                     </a>
                  </Link>         
               </div> 
            </div>
         </main>
         <Footer />
      </div>
   );
};

export default Hell;