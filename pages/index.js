import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "next/head";
import Link from "next/link";
import { useAccount } from "wagmi";

// import pastoralBackground from "../public/pastoralBackground.jpeg"

const Home = () => {

// get account hook
const { data: account, isError: accountError, isLoading: accountLoading } = useAccount(); 
const currentUserAddress = account ? account.address.toString() : ""
console.log("currentuseraddress", currentUserAddress);

  return (
    <div className="bg-[url('../public/pastoralBackground.jpeg')]  min-h-screen h-screen">
      <Head>
        <meta name="description" content="a Felt Zine X tranqui.eth collab" />
        <meta name="og:title" content="Felt Zine Garden of Earthly Delights" />
        {/* <meta
          property="og:image"
          content="https://findersfeefinder.xyz/finders_fee_img.png"
        />
        <meta name="twitter:card" content="summary_large_image"
        />
        <meta name="twitter:description" content="created by tranqui.eth"
        />

        <meta name="twitter:title" content="Finders Fee Finder"
        />

        <meta name="twitter:image" content="https://findersfeefinder.xyz/finders_fee_img.png"
        />           
        <link rel="icon" href="https://findersfeefinder.xyz/finders_fee_img.png" />
        <link rel="apple-touch-icon" href="https://findersfeefinder.xyz/finders_fee_img.png" /> */}
      </Head>    
      <Header />
      <main className="h-full flex flex-col flex-wrap items-center justify-center  ">
        <div className="mt-10 flex flex-col flex-wrap items-center">
          <div className=" text-center mb-10 py-8 px-4 border-[20px] border-double border-[#1a1b0a] bg-[#93814f] text-[#1a1b0a] font-bold font-gothiccc text-7xl h-fit w-full flex flex-row justify-center items-center" >
            Garden of Felt Zine Delights
          </div>
          <div className=" py-8 border-[16px] border-double border-[#1a1b0a] mt-20 bg-[#93814f] text-[#1a1b0a] h-fit w-7/12 flex flex-row flex-wrap justify-center ">
            <div className=" text-center font-gothiccc font-bold text-5xl w-fit flex flex-row justify-center " >
              Connect Wallet to Enter
            </div>
            <div className="basis-full h-0"></div>
            <Link href="/decisions">
              { currentUserAddress === "" ? (
              <button disabled={true}  className="rounded-3xl font-bold text-2xl mt-5 py-3 p-3 w-fit h-fit  flex flex-row justify-center justify-items-center border-[4px] border-solid border-[#1a1b0a] text-[#1a1b0a] bg-[#93814f]" >
                D I S A B L E D
              </button>
              ) : (
              <button   className="rounded-3xl font-bold text-2xl mt-5 py-3 p-3 w-fit h-fit  flex flex-row justify-center justify-items-center border-[4px] border-solid  border-[#1a1b0a] bg-[#1a1b0a] text-[#93814f] hover:text-[#b5572b]" >
                E N T E R
              </button>
              )}        
            </Link>
          </div>  
        </div>
      </main>
      <Footer />
    </div>
  );
};




export default Home;
