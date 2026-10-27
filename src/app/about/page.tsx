
  "use client";
  import Head from "next/head";
  import Header from "../components/ui/Header";
 import AboutHeroSection from "./AboutHero";
//  import AboutCloudTransition from "./About-Clo
  // import AboutIntro from "./About-Intro";
  
  import AboutVerticalFinal from "./AboutVerticalFinal";
   import AboutFinalSection from "./AboutFinalSection";
   import AboutConclusion from "./About-Conclusion";
   import AboutFinale from "./About-Finale";
   import Soundscape from "./About-Harmony";
   import AlbumsList from "./About-AlbumList";
   import AboutLeaders from "./About-Leaders";
  import Footer from "../components/ui/Footer";

  export default function About() {
    return (
      <>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&family=Poppins:wght@300;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>

        {/* Whole page wrapper */}
        <main className="min-h-screen w-full flex flex-col">
          <Header />

          {/* Hero takes full screen */}
            <main>
        <AboutHeroSection />
        
    
        {/* <AboutHorizontal /> */}
       
        <AboutVerticalFinal/>
        
        <AboutFinalSection/>
        
        <AboutConclusion/>
        <Soundscape/>
        <AlbumsList/>
        <AboutLeaders/>
        <AboutFinale/>
        {/* <AboutVertical/> */}
      {/* <AboutVertical2/>
      <AboutVertical3/> */}
      {/* <AboutVertical4/> */}
      {/* <AboutVertical5/> */}
      <Footer/>
      </main>

          {/* Intro takes another screen */}
          {/* <AboutIntro /> */}

          {/* Extra section to test scrolling */}
        
        </main>
      </>
    );
  }
