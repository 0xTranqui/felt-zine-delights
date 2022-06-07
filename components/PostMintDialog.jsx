import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from "@headlessui/react";
import Link from 'next/link';

export default function PostMintDialog({ txnLoadingStatus, txnSuccessStatus, txnHashLink, colorScheme }) {
   let [isOpen, setIsOpen] = useState(false)
   let [isRendered, setIsRendered] = useState("");

   function closeModal() {
   setIsOpen(false)
   }

   function openModal() {
   setIsOpen(true)
   }

   const localTxnHash = txnHashLink ? txnHashLink.transactionHash : ""

   const shortenedHash = (hash) => {
      let displayHash = hash?.substr(0,4) + "..." + hash?.substr(-4)
      return displayHash
   }

   useEffect(() => {
      setIsRendered(txnSuccessStatus)
      openModal();
      console.log("runnning use effect")
      },
      [txnSuccessStatus]
   )

   return (
      <>     
      { txnLoadingStatus == false && isRendered == "success" ? (    
         <div> 
            <button
               type="button"
               onClick={openModal}
               className={`border-[${colorScheme}] hover:bg-[${colorScheme}]
               mt-10 w-full sm:text-lg relative flex flex-row p-2 pl-3 bg-black border-2 border-solid  hover:text-black`}
            >
               YOUR MINT INFO
            </button>        
         <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
               <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
               >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
               </Transition.Child>

               <div className="fixed inset-0 overflow-y-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                     <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                     >
                     <Dialog.Panel className="w-fit transform overflow-hidden bg-black align-middletransition-all shadow-[0_0px_30px_10px_rgba(0,0,0,1)]" >
                        <div className="border-white border-4 border-solid max-w-xs my-2 overflow-hidden rounded-none shadow-lg">
                           <div className="px-6 py-4">
                              <div className="mb-5">
                                 MINT SUCCESSFUL
                              </div>
                              <div className="mb-5">
                              {"Transaction Link - "}
                                 <a 
                                    className={` hover:text-[${colorScheme}]`}
                                    style={{ textDecoration: "underline" }} href={"https://rinkeby.etherscan.io/tx/" + localTxnHash}
                                 >
                                    {shortenedHash(localTxnHash)}
                                 </a>
                              </div>
                              <div className="mb-5">
                                 <Link   href="/gallery">
                                    <a className={` hover:text-[${colorScheme}]`} style={{ textDecoration: "underline" }}>
                                       See Your Collection ➝ 
                                    </a>
                                 </Link>
                              </div>
                                 <button                                    
                                    className={` hover:bg-[${colorScheme}] 
                                    mt-5 px-4 py-2 text-white bg-black rounded-none borer-solid border-white border-4 hover:text-black`} 
                                    onClick={() => {
                                    closeModal()                          
                                    }}
                                 >
                                    Close
                                 </button>
                           </div>
                        </div>                        
                     </Dialog.Panel>
                     </Transition.Child>
                  </div>
               </div>
            </Dialog>
         </Transition>
         </div>  
         ) : (
            <>
            </>
         )}           
      </>
   )
}