import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Header() {
   return (
      <div className="fixed top-3 right-3">
         <ConnectButton accountStatus="address" showBalance={false}  />
      </div>
   )
}