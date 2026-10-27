"use client";
import Head from "next/head";
import Header from "../components/ui/Header";
import DonatePage from "./Donate";
import DonatePackages from "./DonatePackages";
import DonationForm from "./DonationForm";
import FooterSection from "../components/ui/Footer";
// FIXED: Changed function name from 'services' to 'Services'
export default function login() {
  return (
    <>
      

      <main className="min-h-screen w-full flex flex-col">
       
        
       <Header/>
        <DonatePage/>
        <DonatePackages/>
        <DonationForm/>
        <FooterSection/>
          
         
        </main>
      
    </>
  );
}