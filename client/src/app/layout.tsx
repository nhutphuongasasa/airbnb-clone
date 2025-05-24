import type { Metadata } from "next";
import {Nunito} from 'next/font/google'
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
// import Modal from "@/components/Modals/Modal";
import Navbar from "@/components/Navbar";
import RegisterModal from "@/components/Modals/RegisterModal";
import ToasterProvider from "@/providers/ToasterProvider";
import LoginModal from "@/components/Modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "../components/Modals/RentModal";
import SearchModal from "@/components/Modals/SearchModal";


export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

const font = Nunito({
  subsets: ["latin"]
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser()

  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider/>
          <RentModal></RentModal>
          <RegisterModal/>
          <SearchModal></SearchModal>
          <LoginModal/>
        <Navbar currentUser={currentUser}/>
        </ClientOnly>
        <div className="pb-20 pt-28">
        {children}
        </div>
      </body>
    </html>
  );
}
