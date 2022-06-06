import Header from "../components/Header"
import { NFTPreview } from "@zoralabs/nft-components"
import { Networks, NFTFetchConfiguration, Strategies, useNFTMetadata, MediaFetchAgent } from "@zoralabs/nft-hooks"

// const zdkStrategy = new Strategies.ZDKFetchStrategy();

const letsgetthisbread = () => {
   blah = useNFTMetadata()
}

const Gallery = () => {
   
   return (
      <div>
         <Header />
         <div>
            This is the Gallery
         </div>
         {/* <NFTFetchConfiguration strategy={zdkStrategy} network={Networks.RINKEBY}>
         </NFTFetchConfiguration> */}
         {/* <NFTPreview
            contract="0x210ff4C1cD54158a3402095E0BA8cF2121E28295"
            id="1"
         /> */}
      </div>
   )
}

export default Gallery