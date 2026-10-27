"use client";
import Head from "next/head";
import Header from "../components/ui/Header";
import ArchivePage from "./archivePage";

// FIXED: Changed function name from 'services' to 'Services'
export default function Signup() {
  return (
    <>
      

      <main className="min-h-screen w-full flex flex-col">
       
        
    <Header/>          
          <ArchivePage />
         
        </main>
      
    </>
  );
}