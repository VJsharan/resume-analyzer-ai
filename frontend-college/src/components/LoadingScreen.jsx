import React from 'react';
import { motion } from 'framer-motion';
import scanGif from '../assets/resume-scan.gif';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="relative max-w-md w-full aspect-square"
      >
        <img 
          src={scanGif} 
          alt="Scanning Resume" 
          className="w-full h-full object-contain mix-blend-multiply"
        />
        <div className="absolute bottom-10 left-0 right-0 text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Analyzing Profile...</h2>
          <p className="text-slate-500 animate-pulse">Matching skills with industry standards</p>
        </div>
      </motion.div>
    </div>
  );
}
