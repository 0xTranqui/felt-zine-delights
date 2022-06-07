import Header from "../components/Header"
import { useContractRead } from "wagmi"
import { MediaThumbnail, NFTPreview, MediaConfiguration } from "@zoralabs/nft-components"
import { Networks, NFTFetchConfiguration, Strategies, useNFT, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"
import { linkedNFTContract } from "../public/constants"
import * as ERC721Drop_abi from "@zoralabs/nft-drop-contracts/dist/artifacts/ERC721Drop.sol/ERC721Drop.json"
import { BigNumber } from "ethers"
import { useState, useEffect } from 'react'
import { createClient } from "urql"
import NFTCard from "../components/nftCard"
import Link from "next/link"
import Footer from "../components/Footer"

const zdkStrategy = new Strategies.ZoraV2IndexerStrategy(
   Networks.RINKEBY
);

const APIURL = "https://indexer-dev-rinkeby.zora.co/v1/graphql"
// list of diff APIs
// rinkeby legacy: https://indexer-dev-rinkeby.zora.co/v1/graphql
// new mainnet: 

const client = createClient({
   url: APIURL
})


export default function Gallery() {
   const [nftsMinted, setNFTsMinted] = useState();
   const [loading, setLoading] = useState(false);
   const [rawData, setRawData] = useState();

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

   const whatsThis = (id) => {
      /// wasnt working cuz i needed to update the fetch config to the old indexer
      const bruh = useNFT(
         "0x8D7c80bBF27d8c96414238ed1F87B8726a1B3eDF",
         id
      )
      console.log(bruh)
      return 
   }

   const generateCalls = (numCalls) => {
      const callArray = [];
   
      for (let i = 0; i < numCalls; i++ ) {
      let call = ` 
      query {
         Token(
            where: 
            {
               address: {_eq:"0x8D7c80bBF27d8c96414238ed1F87B8726a1B3eDF" } 
            }
            limit: 100
            offset: ${i * 100}
         ) {
            tokenId
            owner
         }
      }`
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
   
   const concatPromiseResults = (multipleArrays) => {
      const masterArray = []
      for (let i = 0; i < multipleArrays[0].length; i++ ) {
         for (let j = 0; j < multipleArrays[0][i].data.Token.length; j++ ) {
            masterArray.push(multipleArrays[0][i].data.Token[j])
         }
      } return masterArray
   }

   const fetchData = async () => {
      console.log("fetching data")

      try {
         setLoading(true);

         const finalCallArray = generateCalls(numOfCallsRequired);

         const finalPromises = generateQueries(finalCallArray, numOfCallsRequired);

         const promiseReturns = await runPromises(finalPromises);

         const promiseResults = concatPromiseResults(promiseReturns)

         console.log("promiseResults: ", promiseResults);

         setRawData(promiseResults)

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

   return (
      <div className="flex flex-row flex-wrap justify-center">
         <Header />
         <div className="text-6xl mt-20 mb-10">
            DELIGHTFUL GALLERY
         </div>
         <div className="flex flex-row flex-wrap justify-center">
            {loading ? "loading . . . " : <NFTCard  nfts={rawData} />}
         </div>
         <div className="mt-10 mb-5 hover:text-red-500">
            <Link href="/">
               <a>
                  ← BACK TO THE BEGINNING
               </a>
            </Link>
         </div>
      </div>
   )
}





         {/* {loading ? "loading . . . " :
         <MediaConfiguration
            networkId="4"
            strategy={zdkStrategy}
            // strings={{
            //    CARD_OWNED_BY: "OWNED BY",
            //    CARD_CREATED_BY: "CREATOR",
            //    COLLECTED: "Collected byyy"
               
            // }}
            style={{
               theme: {
                  previewCard: {
                     background: "black",                   
                  },
                  bodyFont: {
                     color: "red"
                  },
                  titleFont: {
                     color: "white"
                  },
                  headerFont: {
                     color: "orange"
                  },
                  linkColor: {
                     color: "blue"
                  },
                  borderStyle: "4px red solid",
                  placeHolderColor: "black",
               },                        
            }}
         >
            <NFTPreview

               contract={linkedNFTContract}
               id={"2"}
               showBids={false}
               showPerpetual={false}
            />
         </MediaConfiguration>
         } */}