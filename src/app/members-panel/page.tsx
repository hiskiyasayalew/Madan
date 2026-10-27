"use client";

import Header from "../components/ui/Header";
import MembersPanel from "./MembersPanel";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      {/* <Header /> */}
      <MembersPanel />
    </main>
  );
}