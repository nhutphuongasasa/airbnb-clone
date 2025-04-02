import type { Metadata } from "next";
import {Nunito} from 'next/font/google'
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
import Modal from "@/components/Modals/Modal";
import Navbar from "@/components/Navbar";
import RegisterModal from "@/components/Modals/RegisterModal";
import ToasterProvider from "@/providers/ToasterProvider";


export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

const font = Nunito({
  subsets: ["latin"]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider/>
          <RegisterModal/>
          {/* <Modal actionLabel="Submit" title="Hello World" isOpen={true}/> */}
        <Navbar/>
        </ClientOnly>
        {children}
      </body>
    </html>
  );
}
