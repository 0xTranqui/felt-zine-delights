
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components";
import { useAccount, useContractRead, useEnsName, etherscanBlockExplorers } from "wagmi";
import { linkedNFTContract } from "../public/constants";
import { Networks, NFTFetchConfiguration, Strategies, useNFT, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"

const zdkStrategyMainnet = new Strategies.ZDKFetchStrategy(
   Networks.MAINNET
)

const NFTCard = ({ nfts }) => {

   return (
      <>
         {
            nfts && nfts.length > 0
            ?
            nfts.map((nft, index) => {
               return (
                  <div key={nft.tokenId} className="flex flex-row flex-wrap justify-content">
                     <MediaConfiguration
                        networkId="1"
                        
                        strategy={zdkStrategyMainnet}
                        strings={{
                           CARD_OWNED_BY: "OWNED BY",
                           CARD_CREATED_BY: "MINTED BY",
                           COLLECTED: "Collected byyy"
                           
                        }}
                        style={{
                           theme: {
                              previewCard: {
                                 background: "#726e48",                
                              },
                              bodyFont: {
                                 color: "white"
                              },
                              titleFont: {
                                 color: "white"
                              },
                              headerFont: {
                                 color: "orange"
                              },
                              linkColor: {
                                 color: "#e97d39"
                              },
                              borderStyle: "6px #202716 solid",
                              placeHolderColor: "black",
                              useEnsResolution: true,                           
                           },                        
                        }}
                     >
                        <NFTPreview
                           
                           contract={linkedNFTContract}
                           id={nft.tokenId}
                           showBids={false}
                           showPerpetual={false}

                           
                        />
                     </MediaConfiguration>
                  </div>
               )
            }
            ) : (
               <div>
                  {"::: NO RESULTS :::"}
               </div>
            )
         }
      </>
   )

}

export default NFTCard