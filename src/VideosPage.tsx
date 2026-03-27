import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ArrowLeft, Monitor } from 'lucide-react';
import { VIDEOS, PROFILE } from './config';
import Cursor from './components/Cursor';

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <Cursor />
      <div className="min-h-screen bg-[#050505] text-zinc-300 font-mono overflow-x-hidden relative">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
        }}
      ></div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-800/50 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a 
              href="./index.html" 
              className="cyber-btn px-3 py-2 text-xs flex items-center gap-2 text-zinc-400 hover:text-[#4ade80] transition-colors"
            >
              <ArrowLeft size={14}/> RETURN_HOME
            </a>
            <div className="hidden md:block h-4 w-px bg-zinc-800"></div>
            <div className="hidden md:flex items-center gap-2 text-[#4ade80] text-sm font-bold tracking-widest">
              <Monitor size={16} />
              {PROFILE.siteName}
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#4ade80] bg-[#4ade80]/5 px-4 py-2 border border-[#4ade80]/20 rounded-sm tracking-widest">
            <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-ping"></div>
            STREAM_ACTIVE
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <header className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="text-[10px] text-zinc-600 tracking-[0.3em] mb-3">// CLASSIFIED_ACCESS_GRANTED</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-3">
              MEDIA_<span className="text-[#4ade80]">ARCHIVE</span>
            </h1>
            <p className="text-zinc-500 text-sm tracking-widest max-w-lg">
              [STATUS: ALL_FEEDS_DECRYPTED] // [CLEARANCE: LEVEL_5] // [CODEC: H.264_AVC]
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-[10px] text-zinc-600 tracking-widest">
            <div>TOTAL_FEEDS: {VIDEOS.length}</div>
            <div>BANDWIDTH: 1.2 GBPS</div>
          </div>
        </div>
        <div className="mt-8 h-px bg-gradient-to-r from-[#4ade80]/30 via-zinc-800/50 to-transparent"></div>
      </header>

      {/* Video Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {VIDEOS.map((video, index) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
              className="group"
              onClick={() => setActiveVideo(video.url)}
            >
              {/* Card Container */}
              <div className="cyber-module overflow-hidden hover:border-[#4ade80]/30 transition-all duration-500 flex flex-col h-full">
                
                {/* Header Bar */}
                <div className="bg-black/60 px-4 py-2.5 border-b border-zinc-800/50 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 tracking-widest">FEED_{video.id}</span>
                  <div className="flex items-center gap-2 text-[10px] tracking-widest">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-500/80">REC</span>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-110"
                  />
                  
                  {/* Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#4ade80]/5 border-2 border-[#4ade80]/20 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 backdrop-blur-sm
                      group-hover:border-[#4ade80]/50 group-hover:bg-[#4ade80]/10">
                      <Play size={28} className="text-[#4ade80] ml-1" />
                    </div>
                  </div>

                  {/* Corner Decorations */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-zinc-600/30 group-hover:border-[#4ade80]/40 transition-colors"></div>
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-zinc-600/30 group-hover:border-[#4ade80]/40 transition-colors"></div>
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-zinc-600/30 group-hover:border-[#4ade80]/40 transition-colors"></div>
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-zinc-600/30 group-hover:border-[#4ade80]/40 transition-colors"></div>

                  {/* Scanline */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)' }}
                  ></div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#4ade80] transition-colors duration-300">
                    {video.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                    {video.description}
                  </p>
                  <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    {video.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 border border-zinc-800/80 text-zinc-600 rounded-sm tracking-wider group-hover:border-[#4ade80]/20 group-hover:text-[#4ade80]/60 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-zinc-800/30 to-transparent group-hover:via-[#4ade80]/20 transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Fullscreen Video Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveVideo(null)}
          >
            <button 
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white border border-zinc-800 hover:border-[#4ade80]/40 rounded-sm transition-all z-10"
              onClick={() => setActiveVideo(null)}
            >
              <X size={20} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video 
                src={activeVideo}
                controls 
                autoPlay
                className="w-full max-h-[85vh] border border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
              />
              <div className="mt-4 text-center text-[10px] text-[#4ade80] tracking-[0.3em]">
                STREAM_PLAYBACK // DECRYPTED_FEED // [ESC_TO_EXIT]
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
