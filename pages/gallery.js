import Header from "../components/Header"
import Footer from "../components/Footer"
import NFTCard from "../components/NFTCard"
import Link from "next/link"
import { useContractRead, useAccount } from "wagmi"
import { MediaThumbnail, NFTPreview, MediaConfiguration } from "@zoralabs/nft-components"
import { Networks, NFTFetchConfiguration, Strategies, useNFT, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"
import * as ERC721Drop_abi from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import { BigNumber } from "ethers"
import { useState, useEffect } from 'react'
import { createClient } from "urql"
import { Switch } from "@headlessui/react"
import { linkedNFTContract } from "../public/constants"


// APIs
const API_MAINNET = "https://api.zora.co/graphql"
const API_RINKEBY = "https://indexer-dev-rinkeby.zora.co/v1/graphql"

const client = createClient({
   url: API_MAINNET,
})

console.log("client", client)

export default function Gallery() {
   const [nftsMinted, setNFTsMinted] = useState();
   const [loading, setLoading] = useState(false);
   const [rawData, setRawData] = useState();
   const [userData, setUserData] = useState()
   const [enabled, setEnabled] = useState(false);
   
   // hook to get the current account of user
   const { data: account, isError: accountError, isLoading: accountLoading } = useAccount(); 
   const currentUserAddress = account ? account.address.toLowerCase() : ""

   // read call to get current totalSupply
   const { data: supplyData, isError: supplyError, isLoading: supplyLoading } = useContractRead(
      {
         addressOrName: linkedNFTContract,
         contractInterface: ERC721Drop_abi.abi
      },      
      "totalSupply",
      {
         watch: true
      },
      {
         onError(error) {
            console.log("error", error)
         },
         onSuccess(supplyData) {
            console.log("totalSupply", supplyData)
         },
      }
   )   
   
   const totalSupply = supplyData ? BigNumber.from(supplyData).toString() : "loading"
   const numOfCallsRequired = Math.ceil(totalSupply / 100)

   const generateCalls = (numCalls) => {
      const callArray = [];
   
      for (let i = 0; i < numCalls; i++ ) {
      let call = 

      // rinkeby old indexer query
      // ` 
      //    query {
      //       Token(
      //          where: 
      //          {
      //             address: {_eq: "${linkedNFTContract}" } 
      //          }
      //          limit: 100
      //          offset: ${i * 100}
      //       ) {
      //          tokenId
      //          owner
      //       }
      //    }
      // `

      // mainnet new indexer query
      ` 
         query {
            tokens(where: {collectionAddresses: "0x7e6663E45Ae5689b313e6498D22B041f4283c88A"}, pagination: {limit: 500}) {
               nodes {
                  token {
                     tokenId
                     owner
                  }
               }
               pageInfo {
                  hasNextPage
                  endCursor
               }
            }
         }
      `

      callArray.push(call)
      } 
      return callArray
   }
   
   const generateQueries = (array, length) => {
      const promises = []
      for (let i = 0; i < length; i++) {
      promises.push(client.query(array[i]).toPromise())
      }
      return promises
   }
   
   const runPromises = async (inputArray) => {
      return Promise.all(inputArray).then((results) => {
         return [results]
      })
   }
   
   const concatPromiseResultsRinkeby = (multipleArrays) => {
      const masterArray = []
      for (let i = 0; i < multipleArrays[0].length; i++ ) {
         for (let j = 0; j < multipleArrays[0][i].data.Token.length; j++ ) {
            masterArray.push(multipleArrays[0][i].data.Token[j])
         }
      } return masterArray
   }

   const concatPromiseResultsMainnet = (multipleArrays) => {
      const masterArray = []
      for (let i = 0; i < multipleArrays[0].length; i++ ) {
         for (let j = 0; j < multipleArrays[0][i].data.tokens.nodes.length; j++ ) {
            masterArray.push(multipleArrays[0][i].data.tokens.nodes[j].token)
         }
      } return masterArray
   }

   const ownerFilter = (rawData) => {
      const filteredArray = []
         const filteredNFTs = rawData.filter((nft) => {
            if (nft.owner === currentUserAddress) {
               filteredArray.push(nft)
            }
            return filteredArray
         });
      setUserData(filteredArray)
   }

   const fetchData = async () => {
      console.log("fetching data")

      try {
         setLoading(true);

         const finalCallArray = generateCalls(numOfCallsRequired);
         console.log("Finalcallarray", finalCallArray)

         const finalPromises = generateQueries(finalCallArray, numOfCallsRequired);
         console.log("finalpromises", finalPromises)

         const promiseReturns = await runPromises(finalPromises);
         console.log("promiseReturns", promiseReturns)

         // const promiseResults = concatPromiseResultsRinkeby(promiseReturns)

         const promiseResults = concatPromiseResultsMainnet(promiseReturns)

         console.log("promiseResults: ", promiseResults);

         setRawData(promiseResults)

         ownerFilter(promiseResults)

         console.log("rawData", rawData)

      } catch(error) {
         console.error(error.message)
      }  finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchData();
      },
      []
   )

   useEffect(() => {
      if(!!rawData)
      ownerFilter(rawData);
      },
      [currentUserAddress]
   )

   return (
      <div className=" min-h-screen bg-[url('../public/assets/gallery_bg_cropped_smaller.png')] bg-repeat bg-center flex flex-row flex-wrap justify-center">

         <Header />

         <div className=" h-fit flex flex-row justify-center font-gothiccc p-6 sm:p-8 border-double border-[16px] border-[#e97d39] bg-[#726e48] text-[#e97d39] text-4xl sm:text-7xl mt-20 mb-5 text-center">
            G A L L E R Y
         </div>

         <Switch.Group>
            <div className="mb-5 w-full flex flex-row justify-center items-center">
               <Switch.Label className="mr-4 font-bold">FULL COLLECTION</Switch.Label>
               <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={`${enabled ? `bg-[#726e48]` : `bg-[#e97d39]`}
                     relative inline-flex h-[30px] w-[66px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                  <span className="sr-only">Use setting</span>
                  <span
                     aria-hidden="true"
                     className={`${enabled ? 'translate-x-9' : 'translate-x-0'}
                        pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
               </Switch>
               <Switch.Label className="ml-4 font-bold">MY COLLECTION</Switch.Label>
            </div>
         </Switch.Group>
         <div className="w-full flex flex-row justify-center text-[#202716] font-bold">
            <a 
               style={{ textDecoration: "none" }}
               href="https://zora.co/collections/0x7e6663E45Ae5689b313e6498D22B041f4283c88A"
            >
               <button className="text-center w-32 p-2 border-4 border-[#202716] bg-[#726e48] hover:bg-[#202716] hover:text-[#726e48] border-solid ">
                  ZORA
               </button>   
            </a>
            <a 
               style={{ textDecoration: "none" }}
               href="https://opensea.io/collection/gardens-of-felt-zine-delights"
            >
               <button className="text-center w-32 p-2 border-4 border-l-0 border-[#202716] bg-[#726e48] hover:bg-[#202716] hover:text-[#726e48] border-solid ">
                  OPENSEA
               </button>   
            </a>
         </div>

         <div className="flex flex-row flex-wrap justify-center">
            {
               loading ? "loading . . . " : 
               <>
               { enabled === false ? ( 
               <NFTCard  nfts={rawData} />
               ) : (
               <NFTCard  nfts={userData} />
               )}
               </>               
            }
         </div>
      </div>
   )
}