"use client";

import Header from "../components/ui/Header";
import NewsPage from "./newsPage";

export default function Page() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <Header />
      <NewsPage />
    </main>
  );
}