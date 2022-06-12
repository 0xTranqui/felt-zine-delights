import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

const Decisions = () => {
   return (
      <div className='min-h-screen h-screen'>
         <Header />
         <main className=" h-full flex flex-col flex-wrap  ">
            <div className="p-6 border-double border-[20px] border-white bg-black text-white font-gothiccc text-6xl fixed w-9/12 sm:w-6/12 inset-x-12 sm:inset-x-1/4 top-20 text-center ">
               The Choice is Yours 
            </div>
            <div className="bg-[url('../public/heaven_decision.png')] bg-cover h-full w-6/12 flex flex-col flex-wrap justify-center items-center">
               <Link href="/heaven">
                  <button className="bg-black border-white text-white hover:bg-[#40bedc] border-solid border-8 rounded-3xl text-4xl mt-32 sm:mt-8 py-3 p-3 min-w-fit w-3/12 h-fit  flex flex-row justify-center justify-items-center " >
                     Heaven
                  </button>
               </Link>
            </div>
            <div className="bg-[url('../public/hell_decision.png')] bg-cover text-black h-full w-6/12 flex flex-col flex-wrap justify-center items-center">
               <Link href="/hell">
                  <button className="bg-black border-white text-white hover:text-white hover:bg-[#c23d05] border-solid border-8 rounded-3xl  text-4xl mt-32 sm:mt-8 py-3 p-3 min-w-fit w-3/12 h-fit  flex flex-row justify-center justify-items-center " >
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