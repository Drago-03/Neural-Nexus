"use client"; 

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';


interface Partner {
  name: string;
  logo: string; 
  description: string;
}


interface PartnerCardProps {
  partner: Partner;
  index: number; 
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, index }) => {
  return (
    <motion.div
   
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} // Ensures initial animation only plays once
      transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered entry animation

    
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 flex flex-col items-left text-left relative overflow-hidden group"
    >
      {/* GLOW EFFECT ELEMENT */}
  
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-blue-500/30 rounded-xl"
        // Keyframe animation for the glow
        animate={{
          opacity: [0, 0.4, 0.2, 0] 
        }}
        transition={{
          duration: 2, 
          repeat: Infinity, 
          repeatDelay: 3, 
          ease: "easeInOut", 
          delay: index * 0.2 
        }}
      />
      
  
      <div className="relative z-10 flex flex-col items-left">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={120} 
          height={120}
          className="object-contain mb-4 filter grayscale group-hover:grayscale-0 transition-all duration-300"
        />
        <h3 className="text-xl font-semibold mb-2 text-white">{partner.name}</h3>
        <p className="text-gray-300 text-sm">{partner.description}</p>
      </div>
    </motion.div>
     
  );
  console.log("Rendering PartnerTabs component");
};

export default PartnerCard;