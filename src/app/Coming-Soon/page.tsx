"use client";
import Head from "next/head";
import Header from "../components/ui/Header";
import ComingSoon from "./ComingSoon";

// FIXED: Changed function name from 'services' to 'Services'
export default function Signup() {
  return (
    <>
      

      <main className="min-h-screen w-full flex flex-col">
       
        
    <Header/>          
          <ComingSoon />
         
        </main>
      
    </>
  );
}