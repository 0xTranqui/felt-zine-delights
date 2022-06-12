import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "next/head";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";

const Home = () => {
  const [userAddress, setUserAddress] = useState("");

// get account hook
const { data: account, isError: accountError, isLoading: accountLoading } = useAccount();

const getCurrentUserAddress = () => {
  const currentUserAddress = account ? account.address.toString() : ""
  setUserAddress(currentUserAddress);
  console.log("Current user address: ", currentUserAddress)
} 

useEffect(() => {
  getCurrentUserAddress(),
  [account]
})

  return (
    <div className="text-[#1a1b0a] bg-[url('../public/assets/main-image-edited-sized-down.jpg')] bg-repeat  min-h-screen h-screen">
      <Head>
        <meta name="description" content="FELT ZINE FELT ZINE FELT ZINE" />
        <meta name="og:title" content="Garden of Felt Zine Delights" />
      </Head>    
      <Header />
      <main className="h-full flex flex-col flex-wrap items-center justify-center  ">
        <div className="mt-0 sm:mt-10 flex flex-col flex-wrap items-center">
          <div className=" text-center mb-10 py-8 px-4 border-[20px] border-double border-[#1a1b0a] bg-[#93814f] text-[#1a1b0a] font-bold font-gothiccc text-5xl sm:text-7xl h-fit w-fit flex flex-row justify-center items-center" >
            Gardens of Felt Zine Delights
          </div>
          <div className=" py-8 border-[16px] border-double border-[#1a1b0a] mt-5 sm:mt-20 bg-[#93814f] text-[#1a1b0a] h-fit w-7/12 flex flex-row flex-wrap justify-center ">
            <div className="mx-2 sm:mx-0 text-center font-gothiccc font-bold text-3xl sm:text-5xl w-fit flex flex-row justify-center " >
              Connect Wallet to Enter
            </div>
            <div className="basis-full h-0"></div>
            <Link href="/decisions">
              { userAddress === "" ? (
              <button disabled={true}  className="rounded-3xl font-bold text-xl sm:text-2xl mt-5 py-3 p-3 w-fit h-fit  flex flex-row justify-center justify-items-center border-[4px] border-solid border-[#1a1b0a] text-[#1a1b0a] bg-[#93814f]" >
                C L O S E D
              </button>
              ) : (
              <button  disabled={false} className="rounded-3xl font-bold text-xl sm:text-2xl mt-5 py-3 p-3 w-fit h-fit  flex flex-row justify-center justify-items-center border-[4px] border-solid  border-[#1a1b0a] bg-[#1a1b0a] text-[#93814f] hover:text-[#b5572b]" >
                E N T E R
              </button>
              )}        
            </Link>
          </div> 
        </div>
        <Footer/>
      </main>
    </div>
  );
};

export default Home;
