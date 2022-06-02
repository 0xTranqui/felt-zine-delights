import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

const Decisions = () => {
   return (
      <div className='min-h-screen h-screen'>
         <Header />
         <main className=" h-full flex flex-col flex-wrap  ">
            <div className="text-6xl text-[#F4E200]  absolute w-1/2 inset-x-1/4 top-40 text-center ">
               THE CHOICE IS YOURS
            </div>
            <div className="bg-[#61CDFF] h-full   flex flex-col flex-wrap justify-center items-center">
               <div className="text-4xl h-fit w-full flex flex-row justify-center " >
                  {"DONT LOOK RIGHT →"}
               </div>
               <Link href="/heaven">
                  <button className="text-3xl mt-8 py-3 p-3 w-3/12 h-fit  flex flex-row justify-center justify-items-center border-2 border-solid border-white hover:bg-white hover:text-[#61CDFF]" >
                     Heaven
                  </button>
               </Link>
            </div>
            <div className="bg-[#FF3333] text-black h-full  flex flex-col flex-wrap justify-center items-center">
               <div className="text-4xl h-fit w-full flex flex-row justify-center " >
                  {"← DONT LOOK LEFT"}
               </div>
               <Link href="/hell">
                  <button className="text-3xl mt-8 py-3 p-3 w-3/12 h-fit  flex flex-row justify-center justify-items-center border-2 border-solid border-black hover:bg-black hover:text-[#FF3333]" >
                     Hell
                  </button>
               </Link>
            </div>
         </main>
         <Footer />
      </div>
   );
};


export default Decisions;