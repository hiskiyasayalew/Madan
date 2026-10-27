import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Crown, Loader2 } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

interface ChurchLeader {
  id: string;
  name: string;
  title: string;
  image_url: string;
  order: number;
  is_active: boolean;
}

const AboutLeaders = () => {
  const [leaders, setLeaders] = useState<ChurchLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from('leader_cards')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });

      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      console.error('Error fetching leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-['Montserrat']">{t.aboutLeaders.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full bg-black py-20 md:py-32 overflow-hidden font-['Montserrat']">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] rounded-full bg-orange-500/5 blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-amber-500/5 blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#F7952008_1px,transparent_1px),linear-gradient(to_bottom,#F7952008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            {t.aboutLeaders.title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500">
              {t.aboutLeaders.titleHighlight}
            </span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base leading-relaxed">
            {t.aboutLeaders.description}
          </p>
        </motion.div>

        {/* Leaders Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {leaders.map((leader) => (
            <motion.div
              key={leader.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative bg-gradient-to-b from-gray-900/80 to-black/80 rounded-2xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10">
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={leader.image_url || '/default-leader.jpg'}
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-leader.jpg';
                    }}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Crown Icon for Senior Leader (order 1) */}
                  {leader.order === 1 && (
                    <div className="absolute top-4 right-4 bg-orange-500/20 backdrop-blur-md rounded-full p-2 border border-orange-500/30">
                      
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                    {leader.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">
                    {leader.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* If no leaders are found */}
        {leaders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-['Montserrat']">{t.aboutLeaders.noLeaders}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
};

export default AboutLeaders;