import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAccount, useContractWrite, useWaitForTransaction, useContractRead, etherscanBlockExplorers } from 'wagmi';
import { ethers, BigNumber } from 'ethers'
import * as ERC721Drop_abi from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"

import MintQuantity from "../components/MintQuantity";
import { useAppContext } from '../context/appContext'

import { linkedNFTContract } from "../public/constants";
import PostMintDialog from "../components/PostMintDialog";

const heavenly = "#61CDFF"

const Heaven = () => {

   const { mintQuantity, setMintQuantity } = useAppContext() 

   // NFT saleDetails read call
   const { data: saleDetailsData, isError: saleDetailsError, isLoading: saleDetailsLoading } = useContractRead(
      {
         addressOrName: linkedNFTContract,
         contractInterface: ERC721Drop_abi.abi
      },      
      "saleDetails",
      {
         watch: true,
      },
      {
         onError(error) {
            console.log("error", error)
         },
         onSuccess(saleDetailsData) {
            console.log("saleDetails", saleDetailsData)
         },
      },   
   )      

   const saleDetails_totalMinted = saleDetailsData ? BigNumber.from(saleDetailsData[9]).toString() : "loading"
   const saleDetails_maxSupply = saleDetailsData ? BigNumber.from(saleDetailsData[10]).toString() : "loading"
   const saleDetails_mintPrice = saleDetailsData ? BigNumber.from(saleDetailsData[2]).toString() : "loading"

   // NFT purchase (aka mint) write call
   const msgValue = saleDetailsData ? String(mintQuantity.queryValue * saleDetails_mintPrice) : "000";

   const { data: purchaseData, isError: purchaseError, isLoading: purchaseLoading, status: writeStatus, write: purchaseWrite } = useContractWrite(
      {
         addressOrName: linkedNFTContract,
         contractInterface: ERC721Drop_abi.abi
      },
      "purchase",
      {
         args: [
            mintQuantity.queryValue
         ],
         overrides: {
            value: BigNumber.from(msgValue).toString()
         },
         onError(error) {
            console.log("Error", error)
         }
      }
   )

   const { data: waitData, isError: waitError, isLoading: waitLoading } = useWaitForTransaction({
      hash: purchaseData?.hash,
      onSuccess(waitData) {
         console.log("txn complete", waitData)
         console.log("txn hash", waitData.transactionHash)
      }
   })

   return (
      <div className='min-h-screen h-screen text-[#61CDFF]'>
         <Header />
         <main className="h-full flex flex-col flex-wrap items-center justify-center  ">
            <div className="flex flex-col flex-wrap items-center">
               <div className="text-6xl h-fit w-full flex flex-row justify-center " >
                  One of the Lucky Ones
               </div>
               <div className="text-3xl mt-60 h-fit w-full flex flex-row justify-center " >
                  Eternal Paradise Awaits
               </div>
               <div className="mt-8 w-full flex flex-row justify-center">
                  <MintQuantity colorScheme={heavenly}/>
                  <button 
                     className="flex flex-row justify-self-start  text-2xl  p-3  w-fit h-fit border-2 border-solid border-[#61CDFF] hover:bg-[#61CDFF] hover:text-black"
                     onClick={() => purchaseWrite()}   
                  >
                     Mint
                  </button>
               </div>
               <PostMintDialog 
                  txnLoadingStatus={waitLoading}
                  txnSuccessStatus={writeStatus}
                  txnHashLink={waitData}
                  colorScheme={heavenly}
               />               
               { waitLoading == true ? (
                  <div className="text-lg mt-10 flex flex-row flex-wrap justify-center ">           
                     <img
                        className="mb-8 w-fit flex flex-row justify-self-center items-center"
                        width="20px" 
                        src="/SVG-Loaders-master/svg-loaders/tail-spin.svg"
                     />
                     <div className="w-full text-center">
                        {`${saleDetails_maxSupply - saleDetails_totalMinted}` + " / " + `${saleDetails_maxSupply}` + " Pieces Remaining"}
                     </div>
                  </div>   
                  ) : (                  
                  <div className="text-lg mt-10 flex flex-row flex-wrap justify-center ">
                     <div className="w-full text-center">
                        {`${saleDetails_maxSupply - saleDetails_totalMinted}` + " / " + `${saleDetails_maxSupply}` + " Pieces Remaining"}
                     </div>
                  </div>                                          
               )}       
            </div>
            <Link href="/decisions">
               <a className="absolute w-1/2 inset-x-1/4 bottom-10 text-center">
                  ← BACK TO PURGATORY
               </a>
            </Link>
         </main>
         <Footer />
      </div>
   );
};

export default Heaven;