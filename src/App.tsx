import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Github, Linkedin, Mail, Terminal, Cpu, Database, Network, Play, Image as ImageIcon, X, ThumbsUp } from 'lucide-react';
import { PROJECTS, VIDEOS, PROFILE, SKILLS, SOCIAL_LINKS, MODAL_TEXT, STATUS_TEXT } from './config';
import { getProjectLikes, likeProject, checkHasLiked, trackVisit, getVisitorStats, ADVICE_LIBRARY, AdviceMessage, addAdvice, getAdvices } from './cloudbase';
import { MessageSquare, Plus, Check, Video } from 'lucide-react';

function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Use raw motion values for position to ensure ZERO lag (no spring for position)
  // Only use spring for scale and rotate for organic transitions
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for touch devices only once
    const mql = window.matchMedia('(pointer: coarse)');
    setIsMobile(mql.matches);
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .cyber-btn, .cyber-dial, .cyber-power-btn, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen hidden md:block will-change-transform"
      style={{ 
        x: cursorX, // Direct mapping = ZERO LAG
        y: cursorY, // Direct mapping = ZERO LAG
        opacity: isVisible ? 1 : 0
      }}
      animate={{
        scale: isHovering ? 1.4 : 1,
        rotate: isHovering ? 45 : 0
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 400, damping: 25 },
        rotate: { type: "spring", stiffness: 400, damping: 25 },
        opacity: { duration: 0.15 }
      }}
    >
      <div className="absolute -top-4 -left-4 w-8 h-8">
        {/* Cyan Layer - Minimal static offset for stereoscopic effect without trailing lag */}
        <div className="absolute inset-0 border-[3px] border-cyan-400 translate-x-[-2px] translate-y-[2px] opacity-60 mix-blend-screen"></div>
        {/* Red Layer - Minimal static offset */}
        <div className="absolute inset-0 border-[3px] border-red-500 translate-x-[2px] translate-y-[-2px] opacity-60 mix-blend-screen"></div>
        {/* Core White Layer */}
        <div className="absolute inset-0 border-[3px] border-white opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.4)]"></div>
        {/* Center Target */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#4ade80]"></div>
      </div>
    </motion.div>
  );
}

const GlitchText = memo(({ text, className = "" }: { text: string; className?: string }) => {
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);

  useEffect(() => {
    // Only glitch sometimes, and only for brief periods
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const idx = Math.floor(Math.random() * text.length);
        setGlitchIndex(idx);
        setTimeout(() => setGlitchIndex(null), 100);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [text]);

  // Optimization: For long texts (e.g. descriptions), don't split by character to prevent DOM bloat
  if (text.length > 50) {
    return (
      <span className={`${className} ${glitchIndex !== null ? 'chromatic' : ''}`}>
        {text}
      </span>
    );
  }

  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className={i === glitchIndex ? 'char-glitch' : ''}
        >
          {char}
        </span>
      ))}
    </span>
  );
});



const AdviceWall = ({ advices }: { advices: AdviceMessage[] }) => {
  const renderAdvice = (advice: AdviceMessage) => {
    const template = ADVICE_LIBRARY.templates[advice.templateIdx];
    const subject = ADVICE_LIBRARY.subjects[advice.subjectIdx];
    const verb = advice.verbIdx !== undefined ? ADVICE_LIBRARY.verbs[advice.verbIdx] : "";
    const descriptor = advice.descriptorIdx !== undefined ? ADVICE_LIBRARY.descriptors[advice.descriptorIdx] : "";

    return template
      .replace("{subject}", `<span class="text-white font-bold">${subject}</span>`)
      .replace("{verb}", `<span class="text-[#4ade80]">${verb}</span>`)
      .replace("{descriptor}", `<span class="text-white/80 italic">${descriptor}</span>`);
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto pr-2 custom-scrollbar">
      {advices.length === 0 ? (
        <div className="text-zinc-600 font-mono text-xs italic">AWAITING_SIGNAL_INPUT...</div>
      ) : (
        advices.map((advice, i) => (
          <motion.div 
            key={advice._id || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-2 border-zinc-800 pl-4 py-2 bg-black/20"
          >
            <div 
              className="text-sm md:text-base font-mono leading-relaxed text-zinc-400"
              dangerouslySetInnerHTML={{ __html: renderAdvice(advice) }}
            />
            <div className="text-[10px] text-zinc-600 mt-1 uppercase tracking-tighter">
              [TIMESTAMP: {advice.createdAt ? new Date(advice.createdAt).toLocaleTimeString() : 'RECENT'}]
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

const MediaArchive = ({ onSelectVideo }: { onSelectVideo: (url: string) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {VIDEOS.map((video) => (
        <motion.div 
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-module group overflow-hidden flex flex-col h-full border-zinc-800/50 hover:border-[#4ade80]/30 transition-all duration-500"
        >
          {/* Video Preview Header */}
          <div className="bg-black/40 px-4 py-2 border-b border-zinc-800/50 flex justify-between items-center font-mono text-[10px] tracking-widest text-zinc-500">
            <span>FEED_ID: {video.id}</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              LIVE_STREAM
            </div>
          </div>

          {/* Thumbnail Container */}
          <div 
            className="aspect-video relative overflow-hidden group/thumb cursor-none"
            onClick={() => onSelectVideo(video.url)}
          >
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/40 flex items-center justify-center backdrop-blur-sm">
                <Play size={32} className="text-[#4ade80] ml-1" />
              </div>
            </div>

            {/* Static Scanline Overlay */}
            <div className="scanlines-tv pointer-events-none opacity-10"></div>
          </div>

          {/* Content Area */}
          <div className="p-5 flex-1 flex flex-col gap-3">
            <h3 className="font-mono text-lg font-bold text-white tracking-tight chromatic group-hover:text-[#4ade80] transition-colors">
              {video.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 font-mono opacity-80 group-hover:opacity-100">
              {video.description}
            </p>
            <div className="mt-auto pt-4 flex flex-wrap gap-2">
              {video.tags.map((tag, i) => (
                <span key={i} className="text-[10px] font-mono px-2 py-0.5 border border-zinc-800 text-zinc-500 rounded-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="h-1 bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [channel, setChannel] = useState(0);
  const [isTuning, setIsTuning] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeSection, setActiveSection] = useState<'main' | 'media'>('main');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  
  // Like system states
  const [likesCount, setLikesCount] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [advices, setAdvices] = useState<AdviceMessage[]>([]);
  const [showAdviceForm, setShowAdviceForm] = useState(false);
  const [newAdvice, setNewAdvice] = useState<Omit<AdviceMessage, '_id' | 'createdAt'>>({
    templateIdx: 0,
    subjectIdx: 0,
    verbIdx: 0,
    descriptorIdx: 0
  });
  const [isSubmittingAdvice, setIsSubmittingAdvice] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Check if user has turned on the power before
    const hasVisited = localStorage.getItem('sys_power_init');
    if (hasVisited) {
      setIsFirstVisit(false);
    }
    // Initial visit track and stats load
    trackVisit();
    getVisitorStats().then(setTotalVisits);
    getAdvices().then(setAdvices);
    
    // Refresh stats every 2 minutes for server stability
    const interval = setInterval(() => {
        getVisitorStats().then(setTotalVisits);
        getAdvices().then(setAdvices);
    }, 120000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeProject && thumbnailRef.current) {
      const activeButton = thumbnailRef.current.children[mediaIndex] as HTMLElement;
      if (activeButton) {
        const container = thumbnailRef.current;
        const scrollLeft = activeButton.offsetLeft - container.offsetWidth / 2 + activeButton.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [mediaIndex, activeProject]);
  
  useEffect(() => {
    if (activeProject) {
      document.body.classList.add('modal-open');
      
      // Fetch likes data
      setLikesCount(null);
      setHasLiked(false);
      
      Promise.all([
        getProjectLikes(activeProject),
        checkHasLiked(activeProject)
      ]).then(([count, liked]) => {
        setLikesCount(count);
        setHasLiked(liked);
      });
      
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [activeProject]);

  const handleLike = async () => {
    if (!activeProject || hasLiked || isLiking) return;
    
    setIsLiking(true);
    const success = await likeProject(activeProject);
    if (success) {
      setHasLiked(true);
      setLikesCount((prev) => (prev !== null ? prev + 1 : 1));
    }
    setIsLiking(false);
  };

  // (Glitch effect removed for performance optimization)

  // Handle channel change with static noise effect
  const handleChannelChange = () => {
    if (!isPowerOn) return;
    
    // Dismiss hint after interaction
    if (isFirstVisit) {
      setIsFirstVisit(false);
    }
    
    setIsTuning(true);
    setChannel((prev) => (prev + 1) % PROJECTS.length);
    
    // Play a short static effect
    setTimeout(() => {
      setIsTuning(false);
    }, 400);
  };

  const handlePowerToggle = () => {
    if (!isPowerOn) {
      setIsPowerOn(true);
      setIsTuning(true);
      setTimeout(() => setIsTuning(false), 600);
      
      // Update first visit status in storage, but keep hints active for this session
      if (isFirstVisit) {
        localStorage.setItem('sys_power_init', 'true');
      }
    } else {
      setIsPowerOn(false);
      setIsTuning(false);
      setActiveProject(null);
    }
  };

  const openProjectDetails = () => {
    if (!isPowerOn) return;
    setActiveProject(currentProject.id);
    setMediaIndex(0);
  };

  const closeProjectDetails = () => {
    setActiveProject(null);
  };

  const nextMedia = () => {
    if (!activeProjectData) return;
    setMediaIndex((prev) => (prev + 1) % activeProjectData.media.length);
  };

  const prevMedia = () => {
    if (!activeProjectData) return;
    setMediaIndex((prev) => (prev - 1 + activeProjectData.media.length) % activeProjectData.media.length);
  };

  const selectMedia = (idx: number) => {
    if (idx === mediaIndex) return;
    setMediaIndex(idx);
  };

  const currentProject = PROJECTS[channel];
  const activeProjectData = PROJECTS.find(p => p.id === activeProject);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePostAdvice = async () => {
    setIsSubmittingAdvice(true);
    const success = await addAdvice(newAdvice);
    if (success) {
      setShowAdviceForm(false);
      const updated = await getAdvices();
      setAdvices(updated);
    }
    setIsSubmittingAdvice(false);
  };

  return (
    <div className="font-sans text-zinc-400 min-h-screen flex flex-col relative" style={{ cursor: 'none' }}>
      
      {/* Custom Stereoscopic Cursor */}
      <Cursor />

      {/* Cyber Grid Background */}
      <div className="cyber-grid-wrapper">
        <div className="cyber-grid"></div>
      </div>
      
      {/* Glitch Overlay Elements */}
      <div className="glitch-overlay"></div>
      <div className="glitch-slice glitch-slice-1"></div>
      <div className="glitch-slice glitch-slice-2"></div>
      <div className="glitch-slice glitch-slice-3"></div>

      {/* Project Details Modal (Sub-page) */}
      <AnimatePresence mode="wait">
        {activeProjectData && (
            <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 md:p-8 bg-black/95"
          >
            <div className="cyber-module w-full h-full sm:h-auto max-w-6xl min-h-0 sm:min-h-[500px] sm:max-h-[94vh] flex flex-col relative overflow-hidden shadow-2xl shadow-[#4ade80]/10 border-[#4ade80]/20 transform-gpu">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-zinc-800 bg-[#050505] relative z-20">
                <div className="font-pixel text-lg md:text-2xl text-[#4ade80] tracking-widest flex items-center gap-4">
                  <GlitchText text={MODAL_TEXT.fileTitle.replace('{title}', activeProjectData.title)} />
                </div>
                <button 
                  onClick={closeProjectDetails}
                  className="cyber-btn p-2 md:p-3 text-red-500 border-red-900 hover:bg-red-900/30 transition-colors"
                >
                  <X size={20} className="md:w-6 md:h-6" />
                </button>
              </div>

              {/* Modal Content */}
                <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden p-0 flex flex-col lg:flex-row relative z-10 custom-scrollbar">
                  
                  {/* Media Player Section */}
                  <div className="flex-none lg:flex-1 lg:min-h-0 flex flex-col gap-0 p-4 md:p-6 lg:p-10 lg:pb-12 lg:overflow-y-auto custom-scrollbar">
                    <div className="cyber-inset aspect-video md:aspect-video relative overflow-hidden flex items-center justify-center bg-[#020202] group border-[#4ade80]/10 shrink-0">
                    {/* Media Display Bezel Internal Accent */}
                    <div className="absolute inset-2 border border-zinc-900/30 pointer-events-none z-10"></div>
                    <div className="absolute top-4 left-4 w-6 h-[1px] bg-[#4ade80]/40 z-10"></div>
                    <div className="absolute top-4 left-4 w-[1px] h-6 bg-[#4ade80]/40 z-10"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-[1px] bg-[#4ade80]/40 z-10"></div>
                    <div className="absolute bottom-4 right-4 w-[1px] h-6 bg-[#4ade80]/40 z-10"></div>

                    {/* Zoom Toggle Button */}
                    <button 
                      onClick={() => setIsZoomed(true)}
                      className="absolute bottom-4 left-4 z-40 p-2 bg-black/60 border border-zinc-800 text-zinc-500 hover:text-[#4ade80] hover:border-[#4ade80] transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center rounded-sm"
                      title="点击放大查看"
                    >
                      <Terminal size={18} />
                    </button>

                    {/* Navigation Arrows */}
                    {activeProjectData.media.length > 1 && (
                      <>
                        <button 
                          onClick={prevMedia}
                          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/60 border border-zinc-800 text-zinc-400 hover:text-[#4ade80] hover:border-[#4ade80] transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center rounded-sm"
                        >
                          <Play size={24} className="rotate-180" />
                        </button>
                        <button 
                          onClick={nextMedia}
                          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/60 border border-zinc-800 text-zinc-400 hover:text-[#4ade80] hover:border-[#4ade80] transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center rounded-sm"
                        >
                          <Play size={24} />
                        </button>
                      </>
                    )}

                    {activeProjectData.media[mediaIndex].type === 'video' ? (
                      <video 
                        key={activeProjectData.media[mediaIndex].url}
                        src={activeProjectData.media[mediaIndex].url} 
                        controls 
                        autoPlay 
                        muted 
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain relative z-0 cursor-zoom-in"
                        onDoubleClick={() => setIsZoomed(true)}
                      />
                    ) : (
                      <img 
                        src={activeProjectData.media[mediaIndex].url} 
                        alt={`${activeProjectData.title} media`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain relative z-0 cursor-zoom-in"
                        onDoubleClick={() => setIsZoomed(true)}
                      />
                    )}
                    <div className="scanlines-tv pointer-events-none opacity-20"></div>
                    
                    {/* Media Index Overlay */}
                    <div className="absolute top-4 right-4 font-mono text-[10px] text-[#4ade80]/80 bg-black/60 px-3 py-1 z-20 border border-[#4ade80]/30 tracking-widest pointer-events-none">
                      BLOCK_0{mediaIndex + 1}/{activeProjectData.media.length}
                    </div>
                  </div>

                  {activeProjectData.media.length > 1 && (
                    <div className="relative group/tray mt-8">
                      {/* Left Navigation Button */}
                      <button 
                        onClick={() => scrollThumbnails('left')}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/80 border border-zinc-800 text-[#4ade80] hover:scale-110 transition-all opacity-0 group-hover/tray:opacity-100 hidden md:block rounded-full shadow-lg shadow-[#4ade80]/10"
                      >
                        <Play size={16} className="rotate-180" />
                      </button>

                      {/* Right Navigation Button */}
                      <button 
                        onClick={() => scrollThumbnails('right')}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/80 border border-zinc-800 text-[#4ade80] hover:scale-110 transition-all opacity-0 group-hover/tray:opacity-100 hidden md:block rounded-full shadow-lg shadow-[#4ade80]/10"
                      >
                        <Play size={16} />
                      </button>

                      <div 
                        ref={thumbnailRef}
                        className="flex gap-4 overflow-x-auto py-4 no-scrollbar relative z-30 smooth-scroll"
                      >
                        {activeProjectData.media.map((m, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectMedia(idx)}
                            className={`relative w-28 h-18 md:w-36 md:h-22 flex-shrink-0 overflow-hidden border-2 transition-all duration-300 transform rounded-sm ${mediaIndex === idx ? 'border-[#4ade80] scale-105 shadow-[0_0_15px_rgba(74,222,128,0.3)] z-10' : 'border-zinc-800 opacity-20 hover:opacity-100 hover:border-zinc-600'}`}
                          >
                            {m.type === 'video' ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                                <Play size={20} className="text-[#4ade80]/30" />
                              </div>
                            ) : (
                              <img src={m.url} alt="thumbnail" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            )}
                            <div className={`absolute top-0 left-0 px-1.5 py-0.5 text-[8px] font-mono font-bold ${mediaIndex === idx ? 'bg-[#4ade80] text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                              0{idx + 1}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Thumbnail Pagination Dots */}
                      <div className="mt-4 flex justify-center items-center gap-2">
                        {activeProjectData.media.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => selectMedia(idx)}
                            className={`transition-all duration-300 rounded-full ${
                              mediaIndex === idx 
                                ? 'w-4 h-1.5 bg-[#4ade80] shadow-[0_0_8px_#4ade80]' 
                                : 'w-1.5 h-1.5 bg-zinc-800 hover:bg-zinc-600'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-96 flex-none lg:flex-shrink-0 flex flex-col font-mono p-6 lg:p-8 lg:pb-16 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-[#080808]/50 lg:overflow-y-auto custom-scrollbar">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 chromatic tracking-tight flex items-center justify-between gap-4">
                    {activeProjectData.title}
                    
                    {/* Add Like Button next to Title */}
                    <button 
                      onClick={handleLike}
                      disabled={hasLiked || isLiking}
                      className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border border-zinc-700/50 bg-black/40 text-xs md:text-sm transition-all shadow-[0_4px_10px_rgba(0,0,0,0.5)] cursor-none ${hasLiked ? 'text-[#4ade80] border-[#4ade80]/50 shadow-[inset_0_0_10px_rgba(74,222,128,0.1)]' : 'text-zinc-400 hover:text-[#4ade80] hover:border-[#4ade80]/50'}`}
                      title="系统点赞"
                    >
                      <ThumbsUp size={16} className={hasLiked ? 'fill-[#4ade80]/20' : ''} />
                      <span className="font-mono">
                        {isLiking ? 'SYNCING...' : (likesCount !== null ? likesCount : '--')}
                      </span>
                    </button>
                  </h2>
                  
                  <div className="space-y-3 text-xs lg:text-sm mb-8">
                    <div className="flex justify-between border-b border-zinc-800/50 pb-2.5">
                      <span className="text-zinc-500">CLIENT</span>
                      <span className="text-zinc-200 text-right">{activeProjectData.client}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-2.5">
                      <span className="text-zinc-500">TIMESTAMP</span>
                      <span className="text-zinc-200 text-right">{activeProjectData.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/50 pb-2.5">
                      <span className="text-zinc-500">ACCESS_LEVEL</span>
                      <span className="text-[#4ade80] text-right font-bold uppercase">{activeProjectData.role}</span>
                    </div>
                  </div>

                  <div className="mb-8">
                    <span className="text-zinc-500 block mb-3 text-xs tracking-widest uppercase border-l-2 border-[#4ade80] pl-2">Mission_Brief</span>
                    <p className="text-zinc-300 leading-relaxed text-sm lg:text-base selection:bg-[#4ade80] selection:text-black">
                      <GlitchText text={activeProjectData.description} />
                    </p>
                    <div className="mt-6 font-pixel text-[10px] text-red-500/80 border border-red-900/30 bg-red-950/10 px-3 py-2 animate-pulse flex items-center gap-2">
                      <Terminal size={12} />
                      <GlitchText text={MODAL_TEXT.additionalInfo} />
                    </div>
                  </div>

                  <div className="mb-10">
                    <span className="text-zinc-500 block mb-3 text-xs tracking-widest uppercase border-l-2 border-zinc-700 pl-2">Hardware_Stack</span>
                    <div className="flex flex-wrap gap-2.5">
                      {activeProjectData.tech.map((t, i) => (
                        <span key={i} className="bg-zinc-900/50 px-2.5 py-1.5 border border-zinc-800 text-[10px] lg:text-xs text-[#4ade80]/90 shadow-[inset_0_0_8px_rgba(74,222,128,0.05)] hover:border-[#4ade80]/40 transition-all cursor-default">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Modal Sidebar Footer Decoration */}
                  <div className="mt-auto pt-10 flex flex-col gap-3">
                    <div className="h-[1px] w-full bg-gradient-to-right from-[#4ade80]/20 to-transparent"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-ping"></div>
                      <span className="text-[9px] tracking-[0.3em] text-zinc-600 font-mono uppercase">System_Link_Encrypted // End_Of_File</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Lightbox / Zoom Overlay */}
            <AnimatePresence>
              {isZoomed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsZoomed(false)}
                  className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                    className="absolute top-8 right-8 z-[210] p-4 bg-zinc-900 border border-zinc-700 text-white hover:text-[#4ade80] rounded-full transition-all"
                  >
                    <X size={32} />
                  </button>

                  <div 
                    className="max-w-7xl max-h-screen relative flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {activeProjectData ? (
                      activeProjectData.media[mediaIndex].type === 'video' ? (
                        <video 
                          src={activeProjectData.media[mediaIndex].url} 
                          controls 
                          autoPlay 
                          className="max-w-full max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800"
                        />
                      ) : (
                        <img 
                          src={activeProjectData.media[mediaIndex].url} 
                          alt="Zoomed view"
                          className="max-w-full max-h-[85vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800"
                        />
                      )
                    ) : (
                      currentVideoUrl && (
                        <video 
                          src={currentVideoUrl} 
                          controls 
                          autoPlay 
                          className="max-w-full max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-zinc-800"
                        />
                      )
                    )}
                    
                    <div className="absolute -bottom-12 left-0 right-0 text-center font-mono text-[#4ade80] text-sm tracking-widest">
                      FILE::{activeProjectData ? activeProjectData.title.toUpperCase() : 'MEDIA_STREAM'}_{activeProjectData ? mediaIndex + 1 : '01'}.DAT // [FULL_RESOLUTION_UPLINK]
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation / Status Bar */}
      <nav className="w-full border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-pixel text-xl md:text-2xl tracking-wider flex items-center gap-3 text-zinc-100">
            <Terminal size={24} className="text-[#4ade80]" />
            {PROFILE.siteName}
            {/* Live Data Stream Status */}
            <div className="hidden sm:flex items-center gap-4 ml-2 md:ml-6 pl-2 md:pl-6 border-l border-zinc-800 font-mono text-[9px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-[#4ade80] rounded-full animate-ping"></div>
                <span className="text-zinc-500 hidden md:inline">NODES:</span>
                <span className="text-[#4ade80]">ONLINE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 hidden md:inline">ACCESS:</span>
                <span className="text-white">{totalVisits !== null ? String(totalVisits).padStart(6, '0') : '...'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 font-mono text-xs tracking-widest">
            {PROFILE.navLinks.map((link) => (
              <button 
                key={link.href} 
                onClick={() => {
                  if (link.href === '#media') {
                    setActiveSection('media');
                  } else {
                    setActiveSection('main');
                    // Use standard anchor scrolling if already in main
                    if (activeSection === 'main') {
                      window.location.hash = link.href;
                    }
                  }
                }}
                className={`cyber-btn px-4 py-2 flex items-center gap-2 ${
                  (link.href === '#media' && activeSection === 'media') || 
                  (link.href !== '#media' && activeSection === 'main' && (typeof window !== 'undefined' && window.location.hash === link.href))
                    ? 'text-[#4ade80] border-[#4ade80]/50' : ''
                }`}
              >
                {link.href === '#viewport' && <Cpu size={14}/>}
                {link.href === '#media' && <Video size={14}/>}
                {link.href === '#databanks' && <Database size={14}/>}
                {link.href === '#uplink' && <Network size={14}/>}
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8 md:gap-12">
        
        {activeSection === 'main' ? (
          <>
            {/* Hero Section (The Main Console) */}
        <section id="viewport" className="cyber-module w-full p-4 md:p-8 mt-4">
          
          <div className="flex justify-between items-center mb-6 font-mono text-xs tracking-widest border-b border-zinc-800 pb-4 relative z-10">
            <div className="text-zinc-400 font-bold">PRIMARY_DISPLAY_UNIT</div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isPowerOn ? 'bg-[#4ade80] shadow-[0_0_8px_#4ade80]' : 'bg-zinc-700'}`}></div> PWR</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div> NET</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            
            {/* Left: CRT Screen Area */}
            <div className="screen-bezel flex-1 aspect-[4/3] relative flex flex-col">
              <div className="crt-screen w-full h-full relative p-6 md:p-10">
                <div className="scanlines-tv"></div>
                
                {isPowerOn && isTuning && (
                  <div className="tv-static"></div>
                )}
                {isPowerOn && !isTuning && (
                  <motion.div 
                    key={currentProject.id} // Added key here for animation on project change
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 h-full flex flex-col text-[#4ade80] crt-text"
                  >
                    {/* Screen Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-[#4ade80]/30 pb-2">
                      <div className="text-xl md:text-2xl tracking-widest"><GlitchText text={`SEC 0${currentProject.id}`} /></div>
                      <div className="text-xl md:text-2xl tracking-widest uppercase animate-pulse">REC &gt;</div>
                    </div>

                    {/* Screen Content */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter chromatic">
                        {currentProject.title}
                      </h1>
                      
                      <div className="grid grid-cols-2 gap-4 md:gap-8 mb-6 text-lg md:text-xl">
                        <div>
                          <span className="opacity-60 block mb-1 text-sm">CLIENT_ID</span>
                          <span>{currentProject.client}</span>
                        </div>
                        <div>
                          <span className="opacity-60 block mb-1 text-sm">TIMESTAMP</span>
                          <span>{currentProject.year}</span>
                        </div>
                      </div>

                      <p className="text-lg md:text-2xl leading-relaxed mb-8 max-w-2xl opacity-90">
                        <GlitchText text={currentProject.description} />
                      </p>

                      <div className="mt-auto flex justify-between items-end">
                        <div>
                          <span className="opacity-60 block mb-2 text-sm">LOADED_MODULES</span>
                          <div className="flex flex-wrap gap-3 text-base md:text-lg">
                            {currentProject.tech.map((t, i) => (
                              <span key={i} className="bg-[#4ade80]/10 px-2 py-1 border border-[#4ade80]/30">[{t}]</span>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={openProjectDetails}
                          className="cyber-btn px-6 py-3 text-[#4ade80] border-[#4ade80] font-bold tracking-widest hover:bg-[#4ade80]/20"
                        >
                          读取档案
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
                {!isPowerOn && (
                  <div className="relative z-10 h-full flex flex-col items-center justify-center font-mono opacity-50 tracking-[0.2em] transform scale-0 md:scale-100 transition-all duration-1000 crt-text">
                    <div className="text-xs mb-2 cyber-text px-4 py-1 border border-zinc-800"><GlitchText text="SYSTEM OFFLINE" /></div>
                    <div className="text-[10px] text-zinc-600"><GlitchText text={STATUS_TEXT.awaitingConnection} /></div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Control Panel */}
            <div className="w-full lg:w-48 flex flex-row lg:flex-col justify-around lg:justify-between py-6 items-center cyber-inset p-4">
              
              {/* Top Controls: Dials */}
              <div className="flex flex-row lg:flex-col items-center gap-8 w-full justify-center">
                
                {/* Data Selector Dial */}
                <div className="flex flex-col items-center">
                  <div className="text-zinc-500 font-mono tracking-widest mb-4 text-[10px]">DATA_SEQ</div>
                  
                  <div className="relative">
                    {/* Channel Labels */}
                    <div className="absolute -inset-10 pointer-events-none">
                      {PROJECTS.map((_, i) => {
                        const angle = (i * (360 / PROJECTS.length)) - 90;
                        const x = Math.cos(angle * Math.PI / 180) * 48;
                        const y = Math.sin(angle * Math.PI / 180) * 48;
                        return (
                          <div 
                            key={i} 
                            className={`absolute w-4 h-4 flex items-center justify-center font-mono font-bold text-[10px] transition-colors duration-300 ${channel === i && isPowerOn ? 'text-[#4ade80] drop-shadow-[0_0_4px_#4ade80]' : 'text-zinc-600'}`}
                            style={{ 
                              left: '50%', top: '50%',
                              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                            }}
                          >
                            0{i + 1}
                          </div>
                        );
                      })}
                    </div>

                    {/* The Dial */}
                    <div 
                      className="cyber-dial"
                      onClick={handleChannelChange}
                      style={{ transform: `rotate(${channel * (360 / PROJECTS.length)}deg)` }}
                    >
                      <div className="dial-indicator"></div>
                      {isFirstVisit && (
                        <div className="guide-hint" style={{ animationDelay: '0.8s' }}>旋转切换</div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Controls: Power & Vents */}
              <div className="flex flex-row lg:flex-col items-center gap-8 w-full justify-center mt-0 lg:mt-12">
                
                {/* Power Toggle */}
                <div className="flex flex-col items-center gap-3">
                  <div className="text-zinc-500 font-mono tracking-widest text-[10px]">SYS_PWR</div>
                  <div className="relative">
                    <div 
                      className={`cyber-power-btn ${isPowerOn ? 'is-on' : ''}`}
                      onClick={handlePowerToggle}
                    ></div>
                    {!isPowerOn && isFirstVisit && (
                      <div className="guide-hint">启动电源</div>
                    )}
                  </div>
                </div>

                {/* Speaker Vents */}
                <div className="cyber-vents hidden lg:flex">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="vent-slit"></div>
                  ))}
                </div>
                
              </div>

            </div>

          </div>
        </section>

        {/* About Section (Databanks) */}
        <section id="databanks" className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Module */}
          <div className="cyber-module md:col-span-2 p-6 md:p-8">
            <h2 className="font-pixel text-xl md:text-2xl mb-6 tracking-wider text-zinc-100 flex items-center gap-3 relative z-10">
              <Database size={24} className="text-[#4ade80]"/>
              USER_PROFILE
            </h2>
            <div className="cyber-inset p-6 md:p-8 relative z-10">
              <p className="text-base md:text-lg leading-relaxed mb-6 text-zinc-300">
                <GlitchText text={PROFILE.bioPrimary} />
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-70">
                <GlitchText text={PROFILE.bioSecondary} />
              </p>
            </div>
          </div>

          {/* Competencies Module */}
          <div className="cyber-module p-6 md:p-8">
            <h2 className="font-pixel text-xl md:text-2xl mb-6 tracking-wider text-zinc-100 flex items-center gap-3 relative z-10">
              <Cpu size={24} className="text-[#4ade80]"/>
              SKILLS
            </h2>
            <div className="cyber-inset p-6 relative z-10 h-[calc(100%-4rem)]">
              <ul className="space-y-4 font-mono text-sm md:text-base text-zinc-300">
                {SKILLS.map((skill, i) => (
                  <li key={i} className="flex items-center gap-3"><span className="text-[#4ade80] font-bold">&gt;</span> {skill}</li>
                ))}
              </ul>
            </div>
          </div>

        </section>


        {/* Advice Section (Comm Link) */}
        <section id="communications" className="cyber-module p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-start gap-4 mb-6 relative z-10">
            <h2 className="font-pixel text-xl md:text-2xl tracking-wider text-zinc-100 flex items-center gap-3">
              <MessageSquare size={24} className="text-[#4ade80]"/>
              MESSAGE_LOG.DAT
            </h2>
            <button 
              onClick={() => setShowAdviceForm(true)}
              className="cyber-btn px-4 py-2 text-xs text-[#4ade80] border-[#4ade80] flex items-center gap-2 hover:bg-[#4ade80]/10 shrink-0 self-end sm:self-auto"
            >
              <Plus size={14} /> TRANSMIT_MSG
            </button>
          </div>
          
          <div className="cyber-inset p-6 md:p-8 relative z-10 h-80">
            <AdviceWall advices={advices} />
          </div>
        </section>
          </>
        ) : (
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full flex flex-col gap-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white chromatic mb-2 uppercase tracking-tighter">MEDIA_ARCHIVE</h2>
                <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
                  [STATUS: ENCRYPTED_STREAM_DECRYPTED] // [LOCATION: LOCAL_DATACENTER]
                </p>
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] text-[#4ade80] bg-[#4ade80]/5 px-4 py-2 border border-[#4ade80]/20 rounded-sm">
                <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-ping"></div>
                UPLINK_STABLE // 1.2 GBPS
              </div>
            </div>

            <MediaArchive onSelectVideo={(url) => {
              setCurrentVideoUrl(url);
              setIsZoomed(true);
            }} />
          </motion.section>
        )}

        {/* Advice Post Modal */}
        <AnimatePresence>
          {showAdviceForm && (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
             >
               <div className="cyber-module w-full max-w-[95%] sm:max-w-lg p-5 md:p-8 border-[#4ade80]/30 my-auto">
                <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                  <h3 className="font-pixel text-lg text-white uppercase tracking-widest">Compose_Message</h3>
                  <button onClick={() => setShowAdviceForm(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
                </div>

                <div className="space-y-6">
                  {/* Template Selection */}
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-mono mb-2">MSG_TEMPLATE</label>
                    <select 
                      className="w-full bg-black border border-zinc-800 text-zinc-300 p-2 font-mono text-sm focus:border-[#4ade80] outline-none"
                      value={newAdvice.templateIdx}
                      onChange={(e) => setNewAdvice({...newAdvice, templateIdx: parseInt(e.target.value)})}
                    >
                      {ADVICE_LIBRARY.templates.map((t, i) => (
                        <option key={i} value={i}>{t.replace("{subject}", "___").replace("{verb}", "___").replace("{descriptor}", "___")}</option>
                      ))}
                    </select>
                  </div>

                  {/* Word Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {(newAdvice.templateIdx === 0 || newAdvice.templateIdx === 1 || newAdvice.templateIdx === 2 || newAdvice.templateIdx === 4) && (
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-mono mb-2">SUBJECT</label>
                        <select 
                          className="w-full bg-black border border-zinc-800 text-zinc-300 p-2 font-mono text-xs focus:border-[#4ade80] outline-none"
                          value={newAdvice.subjectIdx}
                          onChange={(e) => setNewAdvice({...newAdvice, subjectIdx: parseInt(e.target.value)})}
                        >
                          {ADVICE_LIBRARY.subjects.map((s, i) => <option key={i} value={i}>{s}</option>)}
                        </select>
                      </div>
                    )}

                    {(newAdvice.templateIdx === 0 || newAdvice.templateIdx === 1 || newAdvice.templateIdx === 3) && (
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-mono mb-2">VERB / STATE</label>
                        <select 
                          className="w-full bg-black border border-zinc-800 text-zinc-300 p-2 font-mono text-xs focus:border-[#4ade80] outline-none"
                          value={newAdvice.verbIdx}
                          onChange={(e) => setNewAdvice({...newAdvice, verbIdx: parseInt(e.target.value)})}
                        >
                          {ADVICE_LIBRARY.verbs.map((v, i) => <option key={i} value={i}>{v}</option>)}
                        </select>
                      </div>
                    )}

                    {(newAdvice.templateIdx === 0 || newAdvice.templateIdx === 2 || newAdvice.templateIdx === 3) && (
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-mono mb-2">OBJ / DESC</label>
                        <select 
                          className="w-full bg-black border border-zinc-800 text-zinc-300 p-2 font-mono text-xs focus:border-[#4ade80] outline-none"
                          value={newAdvice.descriptorIdx}
                          onChange={(e) => setNewAdvice({...newAdvice, descriptorIdx: parseInt(e.target.value)})}
                        >
                          {ADVICE_LIBRARY.descriptors.map((d, i) => <option key={i} value={i}>{d}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-[#4ade80]/5 border border-[#4ade80]/20 font-mono text-sm">
                    <span className="text-zinc-500 block mb-2 text-[10px]">PREVIEW_UPLINK &gt;</span>
                    <div className="text-white lowercase">
                        {ADVICE_LIBRARY.templates[newAdvice.templateIdx]
                          .replace("{subject}", ADVICE_LIBRARY.subjects[newAdvice.subjectIdx])
                          .replace("{verb}", (newAdvice.verbIdx !== undefined ? ADVICE_LIBRARY.verbs[newAdvice.verbIdx] : ""))
                          .replace("{descriptor}", (newAdvice.descriptorIdx !== undefined ? ADVICE_LIBRARY.descriptors[newAdvice.descriptorIdx] : ""))
                        }
                    </div>
                  </div>

                  <button 
                    onClick={handlePostAdvice}
                    disabled={isSubmittingAdvice}
                    className="w-full py-3 bg-[#4ade80] text-black font-pixel text-sm tracking-widest hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmittingAdvice ? "UPLOADING..." : <><Check size={18}/> POST_MESSAGE</>}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact / Footer (Uplink) */}
        <footer id="uplink" className="cyber-module w-full p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            
            <div>
              <div className="font-pixel text-xl md:text-2xl mb-3 text-zinc-100 flex items-center gap-3">
                <Network size={24} className="text-[#4ade80]"/>
                {STATUS_TEXT.connectionTitle}
              </div>
              <div className="font-mono opacity-60 text-xs tracking-widest">{STATUS_TEXT.awaitingConnection}</div>
            </div>

            <div className="cyber-inset p-4 flex gap-6">
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="cyber-btn p-3">
                <Github size={24} />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="cyber-btn p-3">
                <Linkedin size={24} />
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="cyber-btn p-3">
                <Mail size={24} />
              </a>
            </div>

          </div>
        </footer>

      </main>
    </div>
  );
}
