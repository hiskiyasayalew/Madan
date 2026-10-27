"use client";

import React from "react";
import { motion } from "framer-motion";

const FindUs = () => {
  // Replace these with your actual image paths
  const images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069",
  ];

  return (
    <section className="bg-[#000000] w-full py-12 px-4 md:px-10 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADING */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-4xl lg:text-3xl font-black font-normal tracking-tighter text-white mb-8 uppercase"
        >
        find us
        </motion.h2>

        {/* MAP CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[300px] md:h-[500px] rounded-sm overflow-hidden mb-4"
        >
          {/* Grayscale Google Map Iframe */}
         <iframe
          title="Madan Church Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.8396495155284!2d38.75403939999999!3d8.986898799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b859a478b4e99%3A0x8393f9d6487553d9!2sMadan%20Church!5e0!3m2!1sen!2set!4v1781188455053!5m2!1sen!2set"
          className="w-full h-full grayscale contrast-125"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

          {/* GREEN GOOGLE MAPS BUTTON */}
          <div className="absolute bottom-6 left-6">
           <a
            href="https://maps.app.goo.gl/FkLgyALKkXDHfYqt6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#a3cc39] hover:bg-[#b8e04a] transition-colors text-black text-xs md:text-sm font-bold px-4 py-2 rounded-sm shadow-md"
          >
            Open in Google Maps
          </a>
          </div>
        </motion.div>

      

      </div>
    </section>
  );
};

export default FindUs;