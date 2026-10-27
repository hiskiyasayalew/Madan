"use client";
import Head from "next/head";
import Header from "../components/ui/Header";
import ServicesMenuBar from "./ServicesMenuBar";
// FIXED: Changed function name from 'services' to 'Services'
export default function Services() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Poppins:wght@300;500;700&display=swap"
          rel="stylesheet"
        />
        <title>Our Services | Your Company Name</title>
        <meta name="description" content="Discover our comprehensive services designed to help you achieve your goals." />
      </Head>

      <main className="min-h-screen w-full flex flex-col">
        <Header />
        
        <main>
          
          
         <ServicesMenuBar/>
        </main>
      </main>
    </>
  );
}