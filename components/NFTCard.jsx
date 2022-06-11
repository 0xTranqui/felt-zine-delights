
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components";
import { useAccount, useContractRead, useEnsName, etherscanBlockExplorers } from "wagmi";
import { linkedNFTContract } from "../public/constants";
import { Networks, NFTFetchConfiguration, Strategies, useNFT, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"

const zdkStrategyRinkeby = new Strategies.ZoraV2IndexerStrategy(
   Networks.RINKEBY
);

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
                  <div className=" flex flex-row flex-wrap justify-content">
                     <MediaConfiguration
                        networkId="4" // update this for mainnet
                        strategy={zdkStrategyRinkeby}
                        strings={{
                           CARD_OWNED_BY: "OWNED BY",
                           CARD_CREATED_BY: "CREATOR",
                           COLLECTED: "Collected byyy"
                           
                        }}
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
                              useEnsResolution: true,
                              showCreator: false,
                              showOwner: true,
                              useCollectionTag: true
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