
import { NFTPreview, MediaConfiguration } from "@zoralabs/nft-components";
import { linkedNFTContract } from "../public/constants";
import { Networks, Strategies } from "@zoralabs/nft-hooks"

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
                                 color: "white"
                              },
                              linkColor: {
                                 color: "#e97d39"
                              },
                              borderStyle: "5px #202716 solid",
                              defaultBorderRadius: "0px",
                              placeHolderColor: "#202716",
                              useEnsResolution: true,                           
                           },                        
                        }}
                     >
                        <NFTPreview
                           href={`https://zora.co/collections/0x7e6663E45Ae5689b313e6498D22B041f4283c88A/${nft.tokenId}`}
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