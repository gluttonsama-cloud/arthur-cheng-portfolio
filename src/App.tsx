import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Github, Linkedin, Mail, Terminal, Cpu, Database, Network, Play, Image as ImageIcon, X } from 'lucide-react';
import { PROJECTS, PROFILE, SKILLS, SOCIAL_LINKS, MODAL_TEXT, STATUS_TEXT } from './config';

export default function App() {
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [channel, setChannel] = useState(0);
  const [isTuning, setIsTuning] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [mediaIndex, setMediaIndex] = useState(0);
  
  // High-performance cursor tracking (bypasses React state renders)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .cyber-btn, .cyber-dial, .cyber-power-btn')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    if (activeProject) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [activeProject]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const textNodes: Text[] = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (['script', 'style', 'input', 'textarea', 'button', 'a', 'video'].includes(tag)) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest('.crt-screen')) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.textContent && node.textContent.trim().length > 0) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
          }
        }
      );

      while (walker.nextNode()) {
        textNodes.push(walker.currentNode as Text);
      }

      if (textNodes.length === 0) return;

      const maxGlitches = 2;
      let glitchCount = 0;

      for (let i = 0; i < 3 && glitchCount < maxGlitches; i++) {
        const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
        const text = randomNode.textContent || '';
        if (text.length < 2) continue;

        const charIndex = Math.floor(Math.random() * text.length);
        const char = text[charIndex];
        if (char === ' ' || char === '\n') continue;

        const before = text.slice(0, charIndex);
        const after = text.slice(charIndex + 1);

        const span = document.createElement('span');
        span.className = 'char-glitch';
        span.textContent = char;

        const parent = randomNode.parentNode;
        if (!parent) continue;

        const fragment = document.createDocumentFragment();
        if (before) fragment.appendChild(document.createTextNode(before));
        fragment.appendChild(span);
        if (after) fragment.appendChild(document.createTextNode(after));

        parent.replaceChild(fragment, randomNode);
        glitchCount++;

        setTimeout(() => {
          if (span.parentNode) {
            const textContent = span.textContent || '';
            span.parentNode.replaceChild(document.createTextNode(textContent), span);
            span.parentNode?.normalize();
          }
        }, 400);
      }
    }, 2500 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Handle channel change with static noise effect
  const handleChannelChange = () => {
    if (!isPowerOn) return;
    
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

  const currentProject = PROJECTS[channel];
  const activeProjectData = PROJECTS.find(p => p.id === activeProject);

  return (
    <div className="font-sans text-zinc-400 min-h-screen flex flex-col relative">
      
      {/* Custom Stereoscopic Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen hidden md:block"
        style={{ 
          x: cursorXSpring, 
          y: cursorYSpring,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 45 : 0
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="absolute -top-4 -left-4 w-8 h-8">
          {/* Cyan Layer */}
          <div className="absolute inset-0 border-[3px] border-cyan-400 translate-x-[-3px] translate-y-[3px] opacity-70 mix-blend-screen"></div>
          {/* Red Layer */}
          <div className="absolute inset-0 border-[3px] border-red-500 translate-x-[3px] translate-y-[-3px] opacity-70 mix-blend-screen"></div>
          {/* Core White Layer */}
          <div className="absolute inset-0 border-[3px] border-white opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
          {/* Center Target */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#4ade80]"></div>
        </div>
      </motion.div>

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
      <AnimatePresence>
        {activeProjectData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 will-change-[opacity,transform]"
          >
            <div className="cyber-module w-full max-w-6xl h-full max-h-[90vh] flex flex-col relative overflow-hidden shadow-2xl shadow-[#4ade80]/5">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-[#050505]">
                <div className="font-pixel text-2xl text-[#4ade80] tracking-widest">
                  {MODAL_TEXT.fileTitle.replace('{title}', activeProjectData.title)}
                </div>
                <button 
                  onClick={closeProjectDetails}
                  className="cyber-btn p-2 text-red-500 border-red-900 hover:bg-red-900/30"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-hidden p-0 flex flex-col lg:flex-row">
                
                {/* Media Player Section */}
                <div className="flex-1 flex flex-col gap-0 p-4 lg:p-6 overflow-y-auto">
                  <div className="cyber-inset aspect-video relative overflow-hidden flex items-center justify-center bg-black">
                    {activeProjectData.media[mediaIndex].type === 'video' ? (
                      <video 
                        src={activeProjectData.media[mediaIndex].url} 
                        controls 
                        autoPlay 
                        muted 
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img 
                        src={activeProjectData.media[mediaIndex].url} 
                        alt={`${activeProjectData.title} media`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    )}
                    <div className="scanlines-tv pointer-events-none opacity-30"></div>
                  </div>

                  {activeProjectData.media.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-3 mt-3 max-h-20 lg:max-h-24">
                      {activeProjectData.media.map((m, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMediaIndex(idx)}
                          className={`cyber-btn relative w-20 h-12 lg:w-24 lg:h-14 flex-shrink-0 overflow-hidden ${mediaIndex === idx ? 'border-[#4ade80] opacity-100' : 'opacity-50 hover:opacity-75'}`}
                        >
                          {m.type === 'video' ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                              <Play size={14} className="text-zinc-500" />
                            </div>
                          ) : (
                            <img src={m.url} alt="thumbnail" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          )}
                          <div className="absolute bottom-0.5 right-0.5 bg-black/80 px-1 text-[7px] lg:text-[8px] font-mono text-zinc-400">
                            {m.type === 'video' ? 'VID' : 'IMG'}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-80 flex-shrink-0 flex flex-col font-mono p-4 lg:p-5 border-t lg:border-t-0 lg:border-l border-zinc-800 bg-[#080808] overflow-y-auto">
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 chromatic">{activeProjectData.title}</h2>
                  
                  <div className="space-y-2 text-xs lg:text-sm">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500">CLIENT</span>
                      <span className="text-zinc-300 text-right">{activeProjectData.client}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500">YEAR</span>
                      <span className="text-zinc-300 text-right">{activeProjectData.year}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-500">ROLE</span>
                      <span className="text-[#4ade80] text-right">{activeProjectData.role}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-zinc-500 block mb-2 text-xs lg:text-sm">MISSION_BRIEF</span>
                    <p className="text-zinc-300 leading-relaxed text-sm lg:text-base">
                      {activeProjectData.description}
                    </p>
                    <div className="mt-4 font-pixel text-[10px] lg:text-xs text-red-500 border border-red-900/50 bg-red-950/20 px-2 py-1.5 animate-pulse">
                      {MODAL_TEXT.additionalInfo}
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-zinc-500 block mb-2 text-xs lg:text-sm">TECH_STACK</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProjectData.tech.map((t, i) => (
                        <span key={i} className="bg-zinc-900 px-2 py-1 border border-zinc-700 text-[10px] lg:text-xs text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation / Status Bar */}
      <nav className="w-full border-b border-zinc-800 bg-[#09090b]/90 backdrop-blur sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-pixel text-xl md:text-2xl tracking-wider flex items-center gap-3 text-zinc-100">
            <Terminal size={24} className="text-[#4ade80]" />
            {PROFILE.siteName}
          </div>
          <div className="flex gap-4 font-mono text-xs tracking-widest">
            {PROFILE.navLinks.map((link) => (
              <a key={link.href} href={link.href} className="cyber-btn px-4 py-2 flex items-center gap-2">
                {link.href === '#viewport' && <Cpu size={14}/>}
                {link.href === '#databanks' && <Database size={14}/>}
                {link.href === '#uplink' && <Network size={14}/>}
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-12">
        
        {/* Hero Section (The Main Console) */}
        <section id="viewport" className="cyber-module w-full p-6 md:p-8 mt-4">
          
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
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 h-full flex flex-col text-[#4ade80] crt-text"
                  >
                    {/* Screen Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-[#4ade80]/30 pb-2">
                      <div className="text-xl md:text-2xl tracking-widest">SEC 0{currentProject.id}</div>
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
                        {currentProject.description}
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
                          ACCESS_ARCHIVE
                        </button>
                      </div>
                    </div>
                  </motion.div>
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
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Controls: Power & Vents */}
              <div className="flex flex-row lg:flex-col items-center gap-8 w-full justify-center mt-0 lg:mt-12">
                
                {/* Power Toggle */}
                <div className="flex flex-col items-center gap-3">
                  <div className="text-zinc-500 font-mono tracking-widest text-[10px]">SYS_PWR</div>
                  <div 
                    className={`cyber-power-btn ${isPowerOn ? 'is-on' : ''}`}
                    onClick={handlePowerToggle}
                  ></div>
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
                {PROFILE.bioPrimary}
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-70">
                {PROFILE.bioSecondary}
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
