import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Header() {
   return (
      <div className="fixed top-0 right-0">
         <ConnectButton accountStatus="address" showBalance={false}  />
      </div>
   )
}