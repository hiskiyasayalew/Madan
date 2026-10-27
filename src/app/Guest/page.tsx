"use client";
import Head from "next/head";
import Header from "../components/ui/Header";
import GuestHousePage from "./GuestHousePage";
import GuestHouseLayoutSection from "./GuestHouseParagraphSection";
import GuestHouseLayout from "./GuestHouseLayout";
import GuestHousePackages from "./GuestHousePackages";
import GuestHouseFinalReserveSection from "./GuestHouseFinalReserveSection";
export default function Guest() {
  return (
    <>
      <Header />
      <GuestHousePage />
      <GuestHouseLayoutSection/>
      <GuestHouseLayout/>
      <GuestHousePackages/>
      <GuestHouseFinalReserveSection/>
    </>
  );
}