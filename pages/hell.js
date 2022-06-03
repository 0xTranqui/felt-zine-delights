import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAccount, useContractWrite, useWaitForTransaction, useContractRead, etherscanBlockExplorers } from 'wagmi';
import { ethers, BigNumber } from 'ethers'
import * as ERC721Drop_abi from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"

const linkedNFTContract = "0x3F8033eA907c2EcD71ECc076A9C2AB67a4288ce5";

const Hell = () => {

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

   const saleDetails_totalMinted = saleDetailsData ? BigNumber.from(saleDetailsData[9]).toString()  : "loading"
   const saleDetails_maxSupply = saleDetailsData ? BigNumber.from(saleDetailsData[10]).toString()  : "loading"
   const saleDetails_mintPrice = saleDetailsData ? BigNumber.from(saleDetailsData[2]).toString() : "loading"

   // NFT purchase (aka mint) write call
   const mintQuantity = "1"
   const msgValue = saleDetailsData ? String(mintQuantity * saleDetails_mintPrice) : "000";

   const { data: purchaseData, isError: purchaseError, isLoading: purchaseLoading, write: purchaseWrite } = useContractWrite(
      {
         addressOrName: linkedNFTContract,
         contractInterface: ERC721Drop_abi.abi
      },
      "purchase",
      {
         args: [
            mintQuantity
         ],
         overrides: {
            value: BigNumber.from(msgValue).toString()
         }
      }
   )

   const waitForTransaction = useWaitForTransaction({
      hash: purchaseData?.hash,
      onError(error) {
         console.log('error', error)
      },
      onSuccess(data) {
         console.log("sucess", data)
      }
   })  


   return (
      <div className='min-h-screen h-screen text-[#FF3333]'>
         <Header />
         <main className="h-full flex flex-col flex-wrap items-center justify-center  ">
            <div className="flex flex-col flex-wrap items-center">
               <div className="text-6xl h-fit w-full flex flex-row justify-center " >
                  One of the Damned
               </div>
               <div className="text-3xl mt-60 h-fit w-full flex flex-row justify-center " >
                  Eternal Suffering Awaits
               </div>
               <button
                  className="text-2xl mt-8 py-3 p-3 w-3/12 h-fit flex flex-row justify-center justify-items-center border-2 border-solid border-[#FF3333] hover:bg-[#FF3333] hover:text-black"
                  onClick={() => purchaseWrite()}    
               >
                  Mint
               </button>
               <div className="text-lg mt-10 flex flex-row flex-wrap justify-center ">
                  <div className="w-full text-center">
                     {`${saleDetails_maxSupply - saleDetails_totalMinted}` + " / " + `${saleDetails_maxSupply}` + " Pieces Remaining"}
                  </div>
               </div>
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


export default Hell;