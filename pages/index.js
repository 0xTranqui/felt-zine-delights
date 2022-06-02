import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "next/head";
import Link from "next/link";

const Home = () => {
  return (
    <div className='min-h-screen h-screen'>
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
        <div className="flex flex-col flex-wrap items-center">
          <div className="text-6xl h-fit w-full flex flex-row justify-center " >
            Felt Zine Garden of Earthly Delights
          </div>
          <div className="text-3xl mt-60 h-fit w-full flex flex-row justify-center " >
            Look Both Ways Before You
          </div>
          <Link href="/decisions">
            <button className="text-2xl mt-8 py-3 p-3 w-fit h-fit  flex flex-row justify-center justify-items-center border-2 border-solid border-white" >
              ENTER
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};


export default Home;
