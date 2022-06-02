import Link from "next/link";
import Footer from "../components/Footer";

const Heaven = () => {
   return (
      <div className='min-h-screen h-screen text-[#61CDFF]'>
         <main className="h-full flex flex-col flex-wrap items-center justify-center  ">
            <div className="flex flex-col flex-wrap items-center">
               <div className="text-6xl h-fit w-full flex flex-row justify-center " >
                  One of the Lucky Ones
               </div>
               <div className="text-3xl mt-60 h-fit w-full flex flex-row justify-center " >
                  Eternal Paradise Awaits
               </div>
               <button className="text-2xl mt-8 py-3 p-3 w-3/12 h-fit  flex flex-row justify-center justify-items-center border-2 border-solid border-[#61CDFF]" >
                  Mint
               </button>
               <div className="text-lg mt-10 flex flex-row flex-wrap justify-center ">
                  <div className="w-full text-center">
                  X / 100 MINTS REMAINING
                  </div>
                  <div className="mt-2 w-full text-center">
                  MAX 5 MINTS PER WALLET
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


export default Heaven;