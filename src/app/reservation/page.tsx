"use client";


import Reservation from "./Reservation"; 

export default function Page() { // ✅ capitalized
  return (
    <main className="min-h-screen w-full flex flex-col">
      <Reservation/>
      
    </main>
  );
}