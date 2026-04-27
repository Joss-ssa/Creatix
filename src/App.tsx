/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Footprints, Sun, Sparkles, ArrowRight, CheckCircle2, HelpCircle, X, Maximize, Minimize, Compass, SlidersHorizontal, Castle, Leaf, Play, Square, Smile, Settings2 } from 'lucide-react';
import { Game2D } from './components/Game2D';
import { ReflectionsModal } from './components/ReflectionsModal';
import { HelpModal } from './components/HelpModal';

// --- Constants & Content ---

const THEME_PHRASES = [
  "La creatividad no es un talento, es una forma de operar.",
  "Atraviesa la niebla, la claridad te espera al otro lado.",
  "Cada bloqueo es solo un descanso antes del siguiente salto.",
  "Permítete crear algo imperfecto hoy."
];

const NIEBLA_PHRASES = [
  "No sabes por dónde empezar.",
  "Todo lo que haces te parece malo.",
  "Sientes que no eres lo suficientemente bueno.",
  "Te comparas con otros y pierdes confianza.",
  "Tienes miedo de equivocarte.",
  "Te sientes cansado, sin energía para crear.",
  "Te quedas mirando la hoja en blanco.",
  "Quieres hacerlo perfecto… y por eso no haces nada.",
  "Sientes que ya no tienes ideas.",
  "Dudas de todo lo que haces."
];

const EXPLORACION_ACTIONS = [
  "Cambia de actividad por un momento.",
  "Haz algo sin pensar en el resultado.",
  "Dibuja lo primero que se te ocurra.",
  "Escribe sin parar durante 1 minuto.",
  "Sal a caminar (aunque sea mentalmente).",
  "Escucha algo nuevo.",
  "Mira algo que nunca verías normalmente.",
  "Haz algo mal a propósito.",
  "Permítete descansar 5 minutos.",
  "Recuerda por qué empezaste."
];

const CLARIDAD_EXERCISES = [
  "Crea sin pensar si está bien o mal.",
  "Convierte una idea absurda en algo posible.",
  "Mezcla dos ideas que no tengan nada que ver.",
  "Haz una versión exagerada de algo simple.",
  "Crea algo solo por diversión.",
  "Confía en lo que estás haciendo.",
  "Termina algo, aunque no sea perfecto.",
  "Tu proceso también vale."
];

type Stage = 'NIEBLA' | 'EXPLORACION' | 'CLARIDAD';
type AppState = 'START_MENU' | 'STAGE_INTRO' | 'PLAYING' | 'CARD_VIEW' | 'END_SCREEN';

// --- Main Application ---

export default function App() {
  const [appState, setAppState] = useState<AppState>('START_MENU');
  const [nieblaMenuTab, setNieblaMenuTab] = useState<'intro' | 'controles' | 'emociones'>('intro');
  const [exploracionMenuTab, setExploracionMenuTab] = useState<'intro' | 'controles' | 'acciones' | 'reflexiones'>('intro');
  const [claridadMenuTab, setClaridadMenuTab] = useState<'intro' | 'controles' | 'ejercicios' | 'ayuda'>('intro');
  const [stage, setStage] = useState<Stage>('NIEBLA');
  const [currentPhrase, setCurrentPhrase] = useState<string>("");
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([]);
  const [introPhrase, setIntroPhrase] = useState("");
  
  // New states for the requested flow
  const [phraseSelectedForStage, setPhraseSelectedForStage] = useState(false);
  const [phraseTimers, setPhraseTimers] = useState<Record<string, number>>({});
  const [phraseTimerRunning, setPhraseTimerRunning] = useState<Record<string, boolean>>({});
  const [showMHint, setShowMHint] = useState(false);
  const [hasShownControlsForStage, setHasShownControlsForStage] = useState(false);
  const [showReflectionsModal, setShowReflectionsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    setIntroPhrase(THEME_PHRASES[Math.floor(Math.random() * THEME_PHRASES.length)]);
  }, []);

  // Global keydown for 'P' in Phase 2 and 'C' in Phase 3
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (appState === 'PLAYING') {
        if (stage === 'EXPLORACION' && e.key.toLowerCase() === 'p' && !showReflectionsModal) {
          setShowReflectionsModal(true);
          document.exitPointerLock();
        }
        if (stage === 'CLARIDAD' && e.key.toLowerCase() === 'c' && !showHelpModal) {
          setShowHelpModal(true);
          document.exitPointerLock();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [appState, stage, showReflectionsModal, showHelpModal]);

  // Determine whether to show M hint
  useEffect(() => {
    if (appState === 'PLAYING') {
      setShowMHint(true);
    } else {
      setShowMHint(false);
    }
  }, [appState]);

  // M key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && appState === 'PLAYING') {
        if (stage === 'NIEBLA') {
          setNieblaMenuTab('controles');
          setAppState('STAGE_INTRO');
        } else if (stage === 'EXPLORACION') {
          setExploracionMenuTab('controles');
          setAppState('STAGE_INTRO');
        } else if (stage === 'CLARIDAD') {
          setClaridadMenuTab('controles');
          setAppState('STAGE_INTRO');
        } else {
          setShowControlsMenu(prev => {
            const next = !prev;
            if (next) {
              setShowMHint(false);
            } else {
              setShowMHint(true);
              setHasShownControlsForStage(true); // Mark as shown if manually closed
            }
            return next;
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState]);

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseTimers(prev => {
        let changed = false;
        const next = { ...prev };
        Object.keys(phraseTimerRunning).forEach(phrase => {
          if (phraseTimerRunning[phrase]) {
            const current = next[phrase] !== undefined ? next[phrase] : 300;
            if (current > 0) {
              next[phrase] = current - 1;
              changed = true;
            }
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phraseTimerRunning]);

  const handlePhraseSelect = (phrase: string) => {
    setCurrentPhrase(phrase);
    setAppState('CARD_VIEW');
  };

  const handleAcceptPhrase = () => {
    setSelectedPhrases(prev => {
      if (!prev.includes(currentPhrase)) {
        return [...prev, currentPhrase];
      }
      return prev;
    });
    setPhraseSelectedForStage(true);
    setAppState('PLAYING');
  };

  const handleEnterTunnel = () => {
    if (stage === 'NIEBLA') {
      setStage('EXPLORACION');
    } else if (stage === 'EXPLORACION') {
      setStage('CLARIDAD');
    } else {
      setAppState('END_SCREEN');
      document.exitPointerLock();
      return;
    }
    // Reset states for the new stage
    setPhraseSelectedForStage(false);
    setCurrentPhrase("");
    setSelectedPhrases([]);
    setPhraseTimers({});
    setPhraseTimerRunning({});
    setAppState('STAGE_INTRO');
  };

  const currentPhrasesList = 
    stage === 'NIEBLA' ? NIEBLA_PHRASES : 
    stage === 'EXPLORACION' ? EXPLORACION_ACTIONS : 
    CLARIDAD_EXERCISES;

  const currentTimeLeft = currentPhrase && phraseTimers[currentPhrase] !== undefined ? phraseTimers[currentPhrase] : 300;
  const currentIsRunning = currentPhrase ? !!phraseTimerRunning[currentPhrase] : false;

  return (
    <div className="min-h-screen w-full bg-black font-sans selection:bg-sky-200 overflow-hidden relative">
      
      {/* Fullscreen Tab for Mobile */}
      {isMobile && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#2A1408]/80 border-x-2 border-b-2 border-[#FFD700] text-[#FFD700] px-6 py-2 rounded-b-xl shadow-[0_4px_15px_rgba(255,215,0,0.3)] flex items-center justify-center z-50 backdrop-blur-sm active:bg-[#4A2810] transition-colors"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
        </button>
      )}

      <Game2D 
        key={stage}
        stage={stage} 
        appState={appState}
        onPhraseSelect={handlePhraseSelect} 
        phrases={currentPhrasesList}
        hasSelectedPhrase={phraseSelectedForStage}
        selectedPhrases={selectedPhrases}
        onEnterTunnel={handleEnterTunnel}
        isMobile={isMobile}
        onOpenMenu={() => {
          if (stage === 'NIEBLA') {
            setNieblaMenuTab('controles');
            setAppState('STAGE_INTRO');
          } else if (stage === 'EXPLORACION') {
            setExploracionMenuTab('controles');
            setAppState('STAGE_INTRO');
          } else if (stage === 'CLARIDAD') {
            setClaridadMenuTab('controles');
            setAppState('STAGE_INTRO');
          } else {
            setShowControlsMenu(true);
          }
        }}
        onOpenReflections={() => setShowReflectionsModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
      />

      {/* EXPLORACION Active Overlay */}
      {selectedPhrases.length > 0 && appState === 'PLAYING' && stage === 'EXPLORACION' && (
        <div className={`absolute left-0 top-0 bottom-0 z-20 flex flex-col bg-[#191522] border-r border-[#3D1C34] shadow-[20px_0_40px_rgba(0,0,0,0.8)] ${isMobile ? 'w-full px-6 py-10' : 'w-[280px] py-12 px-8'} overflow-y-auto custom-scrollbar`}>
          <div className="flex flex-col items-center mb-12 w-full mt-8">
            <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} rounded-full bg-[#2C1625] border border-[#FF9CB1]/30 flex items-center justify-center mb-6 shadow-inner`}>
              <Footprints className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-[#FF9CB1] fill-current`} />
            </div>
            <h2 className="text-[28px] font-bold text-[#FF9CB1] tracking-wide" style={{ fontFamily: '"Inter", sans-serif' }}>Acciones</h2>
            <p className="text-[11px] text-[#FFE5EC]/60 font-semibold tracking-[0.2em] uppercase mt-2">A TOMAR</p>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 w-full">
            {selectedPhrases.map((phrase, idx) => (
              <div key={idx} className="bg-[#2A1629] rounded p-5 flex gap-4 w-full items-start">
                <span className="text-[#FF9CB1] font-bold text-[15px]">{idx + 1}.</span>
                <p className="text-[#FF9CB1] text-[15px] leading-relaxed font-medium">{phrase}</p>
              </div>
            ))}
          </div>
        </div>
      )}





      {/* Niebla Emociones Sidebar HUD */}
      {appState === 'PLAYING' && stage === 'NIEBLA' && selectedPhrases.length > 0 && (
        <div className={`absolute top-0 left-0 bottom-0 ${isMobile ? 'w-[220px]' : 'w-[280px]'} bg-[#16201C] border-r border-[#24352B] z-20 flex flex-col pt-16 shadow-[20px_0_40px_rgba(0,0,0,0.4)] transition-all duration-300`}>
          <div className="flex flex-col items-center mb-10 px-6">
            <div className={`rounded-full bg-[#355946] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(53,89,70,0.5)] border border-[#48755D] ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
              <Leaf className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-[#A1C6B2] fill-current`} />
            </div>
            <h2 className="text-[#FFFFFF] text-lg font-medium tracking-wide">Emociones</h2>
            <p className="text-[#A1C6B2] text-xs font-bold tracking-widest uppercase mt-1">Identificadas</p>
          </div>
          <div className="flex flex-col w-full overflow-y-auto custom-scrollbar flex-1 pb-8">
            {selectedPhrases.map((phrase, idx) => (
              <div key={idx} className="flex px-6 py-4 bg-[#253E32] border-l-[4px] border-[#80E5A7] border-b border-[#16201C] hover:bg-[#2A4537] transition-colors">
                <div className="w-6 shrink-0 text-[#80E5A7] font-bold text-[13px] mt-[1px]">{idx + 1}.</div>
                <div className="text-[#80E5A7] text-[13px] leading-snug font-medium pr-2">{phrase}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* M Hint Overlay */}
      {showMHint && appState === 'PLAYING' && !isMobile && (
        <div className="absolute bottom-8 right-8 z-30 flex flex-col gap-3 items-end">
          <div className={`bg-black/60 border rounded-lg px-5 py-3 text-white text-sm backdrop-blur-sm ${stage === 'NIEBLA' ? 'border-[#8BE8B9]/50 shadow-[0_0_15px_rgba(139,232,185,0.2)]' : stage === 'EXPLORACION' ? 'border-[#FF9CB1]/50 shadow-[0_0_15px_rgba(255,156,177,0.2)]' : 'border-[#FFA800]/50 shadow-[0_0_15px_rgba(255,168,0,0.2)]'}`}>
            Presiona <span className={`font-bold text-base mx-1 ${stage === 'NIEBLA' ? 'text-[#8BE8B9]' : stage === 'EXPLORACION' ? 'text-[#FF9CB1]' : 'text-[#FFA800]'}`}>M</span> para activar el menú
          </div>
          {stage === 'EXPLORACION' && (
            <div className="bg-black/60 border border-[#FF9CB1]/50 rounded-lg px-5 py-3 text-white text-sm shadow-[0_0_15px_rgba(255,156,177,0.2)] backdrop-blur-sm">
              Presiona <span className="font-bold text-[#FF9CB1] text-base mx-1">P</span> para reflexionar
            </div>
          )}
          {stage === 'CLARIDAD' && (
            <div className="flex flex-col items-end gap-2">
              <div className="bg-black/60 border border-[#FFA800]/50 rounded-lg px-5 py-3 text-white text-sm shadow-[0_0_15px_rgba(255,168,0,0.2)] backdrop-blur-sm">
                Presiona <span className="font-bold text-[#FFA800] text-base mx-1">C</span> para ayuda creativa
              </div>
              <button 
                onClick={() => {
                  setShowHelpModal(true);
                  document.exitPointerLock();
                }}
                className="bg-gradient-to-r from-[#D98A00] to-[#FFA800] text-[#3E2900] font-bold rounded-lg px-5 py-3 text-sm shadow-[0_0_15px_rgba(255,168,0,0.5)] flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <HelpCircle className="w-5 h-5" />
                Ayuda Creativa
              </button>
            </div>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {appState === 'START_MENU' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
            {/* Dark Forest Background Image specific to Start Menu */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop")',
                filter: 'brightness(0.3) contrast(1.1) grayscale(0.2)'
              }}
            ></div>
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`${isMobile ? 'px-6 py-12' : 'px-16 py-24'} max-w-[600px] w-full rounded-2xl bg-[#0B0F0C]/40 backdrop-blur-xl border border-white/5 flex flex-col items-center text-center relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]`}
            >
              <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-[#8BE8B9] tracking-[0.15em] mb-8 drop-shadow-[0_0_20px_rgba(139,232,185,0.4)]`} style={{ fontFamily: '"Inter", sans-serif' }}>
                CREATIX
              </h1>
              
              <div className="w-12 h-[1px] bg-white/10 mb-10"></div>
              
              <p className={`${isMobile ? 'text-sm' : 'text-[15px]'} text-[#D1D5DB] font-light leading-relaxed mb-16 max-w-[320px]`}>
                Atraviesa la niebla, la claridad te espera al otro lado.
              </p>
              
              <button
                onClick={() => setAppState('STAGE_INTRO')}
                className="px-8 py-3.5 rounded-full bg-[#111A15]/80 text-[#8BE8B9] text-[11px] font-semibold tracking-[0.2em] uppercase border border-[#8BE8B9]/30 hover:bg-[#8BE8B9]/15 hover:shadow-[0_0_25px_rgba(139,232,185,0.25)] hover:border-[#8BE8B9]/60 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md"
              >
                <span>COMENZAR EL VIAJE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}

        {appState === 'STAGE_INTRO' && (
          <>
            {stage === 'NIEBLA' ? (
              <div className="absolute inset-0 z-20 flex bg-[#0A100D]">
                {/* Background Image specific to Niebla menu */}
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
                  style={{ 
                    backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop")',
                    filter: 'sepia(1) hue-rotate(110deg) saturate(1.5) brightness(0.4) contrast(1.1)'
                  }}
                ></div>

                {/* Sidebar (Desktop only) */}
                {!isMobile && (
                  <div className="relative z-10 w-[280px] h-full bg-[#050B08]/95 border-r border-[#0F1E16] flex flex-col py-10 flex-shrink-0">
                    <div className="px-8 mb-14">
                      <h2 className="text-[#34D399] text-xl font-bold tracking-wide uppercase">Creatividad</h2>
                      <p className="text-[#34D399]/60 text-[11px] uppercase tracking-wider font-light mt-1">Modo Inmersivo</p>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-4 px-8 py-4 w-full text-[#34D399]/40 hover:text-[#34D399]/70 cursor-pointer transition-colors">
                         <Compass className="w-5 h-5" />
                         <span className="font-medium text-[13px] tracking-wide">Exploración</span>
                      </div>
                      <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${nieblaMenuTab === 'intro' ? 'bg-[#0B2A1E] text-[#34D399]' : 'text-[#34D399]/40 hover:text-[#34D399]/70'}`}
                        onClick={() => setNieblaMenuTab('intro')}
                      >
                         <Cloud className={`w-5 h-5 ${nieblaMenuTab === 'intro' ? 'fill-current' : ''}`} />
                         <span className="font-medium text-[13px] tracking-wide">Niebla</span>
                      </div>
                      <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${nieblaMenuTab === 'controles' ? 'bg-[#0B2A1E] text-[#34D399]' : 'text-[#34D399]/40 hover:text-[#34D399]/70'}`}
                        onClick={() => setNieblaMenuTab('controles')}
                      >
                         <SlidersHorizontal className={`w-5 h-5 ${nieblaMenuTab === 'controles' ? 'text-[#34D399]' : ''}`} />
                         <span className="font-medium text-[13px] tracking-wide">Controles</span>
                      </div>
                      <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${nieblaMenuTab === 'emociones' ? 'bg-[#0B2A1E] text-[#34D399]' : 'text-[#34D399]/40 hover:text-[#34D399]/70'}`}
                        onClick={() => setNieblaMenuTab('emociones')}
                      >
                         <Leaf className={`w-5 h-5 ${nieblaMenuTab === 'emociones' ? 'fill-current' : ''}`} />
                         <span className="font-medium text-[13px] tracking-wide">Emociones</span>
                      </div>
                      <div className="flex items-center gap-4 px-8 py-4 w-full text-[#34D399]/40 hover:text-[#34D399]/70 cursor-pointer transition-colors">
                         <Castle className="w-5 h-5" />
                         <span className="font-medium text-[13px] tracking-wide">Santuario</span>
                      </div>
                    </div>
                    <div className="px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0B2A1E] flex items-center justify-center text-[#34D399]">
                        <span className="text-xs">&Psi;</span>
                      </div>
                      <span className="text-[#34D399]/60 text-xs tracking-wide">Espíritu del Bosque</span>
                    </div>
                  </div>
                )}

                {/* Main Content Area */}
                <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                  <AnimatePresence mode="wait">
                    {nieblaMenuTab === 'intro' && (
                      <motion.div
                        key="niebla-intro"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-[440px] aspect-square max-h-[440px] rounded-2xl bg-[#0F1E16]/80 backdrop-blur-xl border border-[#1B3024] flex flex-col items-center justify-center text-center px-10 py-8 relative shadow-[0_0_80px_rgba(0,0,0,0.6)]"
                      >
                        <Cloud className="w-16 h-16 text-[#8BE8B9] mb-8 drop-shadow-[0_0_15px_rgba(139,232,185,0.3)] fill-current" />
                        <h2 className="text-3xl font-bold text-white tracking-[0.2em] mb-6">NIEBLA</h2>
                        <p className="text-[#A3B3AA] text-[15px] leading-relaxed max-w-[300px] font-light mb-12">
                          Estás en la niebla. Lee un arco para entender cómo te sientes y así poder abrir el túnel.
                        </p>
                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="px-10 py-3.5 rounded-full bg-[#2A5A43] text-[#8BE8B9] text-xs font-semibold tracking-wide hover:bg-[#326B50] hover:text-white transition-colors"
                        >
                          ENTENDIDO
                        </button>
                      </motion.div>
                    )}
                    
                    {nieblaMenuTab === 'controles' && (
                      <motion.div
                        key="niebla-controles"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-[480px] rounded-2xl bg-[#0F1E16]/80 backdrop-blur-xl border border-[#1B3024] flex flex-col items-center p-10 relative shadow-[0_0_80px_rgba(0,0,0,0.6)]"
                      >
                        <h2 className="text-3xl font-bold text-[#8BE8B9] tracking-[0.25em] mb-8 drop-shadow-[0_0_10px_rgba(139,232,185,0.4)]">CONTROLES</h2>
                        <div className="w-full h-px bg-[#1B3024] mb-8"></div>
                        
                        <div className="w-full flex flex-col gap-5 mb-10">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#1B3024] bg-[#0A100D] flex items-center justify-center text-[#D1D5DB] text-sm font-bold">W</div>
                            <span className="text-[#A3B3AA] text-[15px]">Adelante</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#1B3024] bg-[#0A100D] flex items-center justify-center text-[#D1D5DB] text-sm font-bold">S</div>
                            <span className="text-[#A3B3AA] text-[15px]">Atrás</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#1B3024] bg-[#0A100D] flex items-center justify-center text-[#D1D5DB] text-sm font-bold">A</div>
                            <span className="text-[#A3B3AA] text-[15px]">Izquierda</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#1B3024] bg-[#0A100D] flex items-center justify-center text-[#D1D5DB] text-sm font-bold">D</div>
                            <span className="text-[#A3B3AA] text-[15px]">Derecha</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#1B3024] bg-[#0A100D] flex items-center justify-center text-[#8BE8B9]">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"></rect><path d="M12 2v6"></path></svg>
                            </div>
                            <span className="text-[#A3B3AA] text-[15px]">Mirar</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#1B3024] bg-[#0A100D] flex items-center justify-center text-[#D1D5DB] text-sm font-bold">E</div>
                            <span className="text-[#A3B3AA] text-[15px]">Interactuar</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="w-full py-4 rounded bg-transparent border border-[#2A5A43] text-[#8BE8B9] text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#1B3024] transition-colors"
                        >
                          CERRAR
                        </button>
                      </motion.div>
                    )}

                    {nieblaMenuTab === 'emociones' && (
                      <motion.div
                        key="niebla-emociones"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-[480px] min-h-[480px] rounded-2xl bg-[#0F1E16]/80 backdrop-blur-xl border border-[#1B3024] flex flex-col items-center p-10 relative shadow-[0_0_80px_rgba(0,0,0,0.6)]"
                      >
                        <Leaf className="w-12 h-12 text-[#8BE8B9] mb-6 drop-shadow-[0_0_15px_rgba(139,232,185,0.3)] fill-current" />
                        <h2 className="text-2xl font-bold text-white tracking-[0.1em] mb-8 text-center">EMOCIONES IDENTIFICADAS</h2>
                        <div className="w-full h-px bg-[#1B3024] mb-8"></div>
                        
                        <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar mb-8">
                          {selectedPhrases.length > 0 ? (
                            selectedPhrases.map((phrase, idx) => (
                              <div key={idx} className="w-full bg-[#0A100D] border border-[#1B3024] rounded-lg p-4">
                                <p className="text-[#A3B3AA] text-sm italic">"{phrase}"</p>
                              </div>
                            ))
                          ) : (
                            <div className="flex-1 flex items-center justify-center">
                              <p className="text-[#A3B3AA]/50 text-sm text-center">Aún no has identificado ninguna emoción en la niebla.</p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="w-full py-4 rounded bg-transparent border border-[#2A5A43] text-[#8BE8B9] text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#1B3024] transition-colors mt-auto"
                        >
                          CERRAR
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : stage === 'EXPLORACION' ? (
              <div className="absolute inset-0 flex z-30 bg-black/40 backdrop-blur-sm">
                {/* Left Sidebar Menu for EXPLORACION */}
                {(!isMobile || exploracionMenuTab === 'intro') && (
                  <div className={`${isMobile ? 'w-full' : 'w-[280px]'} h-full bg-[#191522]/95 border-r border-[#3D1C34] flex flex-col py-8 shadow-[20px_0_40px_rgba(0,0,0,0.8)] z-20`}>
                    <div className="px-8 mb-12">
                      <h2 className="text-[#FF9CB1] text-xl font-bold tracking-wide uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>Creatividad</h2>
                      <p className="text-[#FFE5EC]/60 text-[11px] uppercase tracking-wider font-light mt-1">Exploración</p>
                    </div>

                    <div className="flex flex-col flex-1 gap-2">
                       <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${exploracionMenuTab === 'intro' ? 'bg-[#2C1625] text-[#FF9CB1] border-l-2 border-[#FF9CB1]' : 'text-[#FFE5EC]/60 hover:text-[#FF9CB1] hover:bg-[#2A1629]'}`}
                        onClick={() => setExploracionMenuTab('intro')}
                      >
                         <Compass className={`w-5 h-5 ${exploracionMenuTab === 'intro' ? 'text-[#FF9CB1]' : ''}`} />
                         <span className="font-medium text-[13px] tracking-wide">Inicio</span>
                      </div>
                      <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${exploracionMenuTab === 'acciones' ? 'bg-[#2C1625] text-[#FF9CB1] border-l-2 border-[#FF9CB1]' : 'text-[#FFE5EC]/60 hover:text-[#FF9CB1] hover:bg-[#2A1629]'}`}
                        onClick={() => setExploracionMenuTab('acciones')}
                      >
                         <Footprints className={`w-5 h-5 ${exploracionMenuTab === 'acciones' ? 'fill-current' : ''}`} />
                         <span className="font-medium text-[13px] tracking-wide">Acciones</span>
                      </div>
                      <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${exploracionMenuTab === 'controles' ? 'bg-[#2C1625] text-[#FF9CB1] border-l-2 border-[#FF9CB1]' : 'text-[#FFE5EC]/60 hover:text-[#FF9CB1] hover:bg-[#2A1629]'}`}
                        onClick={() => setExploracionMenuTab('controles')}
                      >
                         <SlidersHorizontal className={`w-5 h-5 ${exploracionMenuTab === 'controles' ? 'text-[#FF9CB1]' : ''}`} />
                         <span className="font-medium text-[13px] tracking-wide">Controles</span>
                      </div>
                      <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${exploracionMenuTab === 'reflexiones' ? 'bg-[#2C1625] text-[#FF9CB1] border-l-2 border-[#FF9CB1]' : 'text-[#FFE5EC]/60 hover:text-[#FF9CB1] hover:bg-[#2A1629]'}`}
                        onClick={() => setExploracionMenuTab('reflexiones')}
                      >
                         <Sparkles className={`w-5 h-5 ${exploracionMenuTab === 'reflexiones' ? 'text-[#FF9CB1]' : ''}`} />
                         <span className="font-medium text-[13px] tracking-wide">Reflexiones</span>
                      </div>
                    </div>
                    <div className="px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2C1625] flex items-center justify-center text-[#FF9CB1] border border-[#FF9CB1]/30">
                        <span className="text-xs font-serif italic">R</span>
                      </div>
                      <span className="text-[#FFE5EC]/60 text-xs tracking-wide">Reflexión Interior</span>
                    </div>
                  </div>
                )}

                {/* Main Content Area */}
                <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                  <AnimatePresence mode="wait">
                    {exploracionMenuTab === 'intro' && (
                      <motion.div
                        key="stage-intro-exploracion"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-[440px] rounded-3xl bg-[#191522]/90 backdrop-blur-xl border border-[#3D1C34] flex flex-col items-center text-center p-10 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2C1625] to-[#2A1629] border border-[#FFB3C6] shadow-[0_0_30px_rgba(255,156,177,0.15)] flex items-center justify-center mb-8 relative">
                          <div className="absolute inset-0 rounded-full border border-[#FF9CB1]/20 blur-[1px]"></div>
                          <Compass className="w-7 h-7 text-[#FF9CB1] drop-shadow-[0_0_10px_rgba(255,156,177,0.8)]" fill="currentColor" />
                        </div>
                        
                        <h2 className="text-[28px] font-bold text-[#FF9CB1] mb-6 tracking-wide" style={{ fontFamily: '"Playfair Display", serif' }}>
                          Camino Revelado
                        </h2>
                        
                        <p className="text-[#FFE5EC] text-[15px] leading-[1.7] font-light max-w-[340px] mb-12 opacity-90">
                          La densa niebla se disipa lentamente. Ante ti se revela un arco ancestral. Cruza el túnel luminoso para adentrarte en la siguiente fase de tu exploración.
                        </p>

                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="px-10 py-3.5 rounded-full bg-gradient-to-r from-[#FFB3C6] to-[#FF9CB1] text-[#2C1625] text-[11px] font-extrabold tracking-[0.2em] uppercase hover:shadow-[0_0_20px_rgba(255,156,177,0.4)] transition-all duration-300"
                        >
                          ENTENDIDO
                        </button>
                      </motion.div>
                    )}

                    {exploracionMenuTab === 'controles' && (
                      <motion.div
                        key="exploracion-controles"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-[480px] rounded-2xl bg-[#191522]/90 backdrop-blur-xl border border-[#3D1C34] flex flex-col items-center p-10 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                      >
                        <h2 className="text-3xl font-extrabold text-[#FF9CB1] tracking-[0.25em] mb-8 drop-shadow-[0_0_10px_rgba(255,156,177,0.4)]" style={{ fontFamily: '"Playfair Display", serif' }}>CONTROLES</h2>
                        <div className="w-full h-px bg-[#3D1C34] mb-8"></div>
                        
                        <div className="w-full flex flex-col gap-5 mb-10">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#FFB3C6] bg-[#2C1625] flex items-center justify-center text-[#FFE5EC] text-sm font-bold">W</div>
                            <span className="text-[#FF9CB1] text-[15px]">Adelante</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#FFB3C6] bg-[#2C1625] flex items-center justify-center text-[#FFE5EC] text-sm font-bold">S</div>
                            <span className="text-[#FF9CB1] text-[15px]">Atrás</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#FFB3C6] bg-[#2C1625] flex items-center justify-center text-[#FFE5EC] text-sm font-bold">A</div>
                            <span className="text-[#FF9CB1] text-[15px]">Izquierda</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#FFB3C6] bg-[#2C1625] flex items-center justify-center text-[#FFE5EC] text-sm font-bold">D</div>
                            <span className="text-[#FF9CB1] text-[15px]">Derecha</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#FFB3C6] bg-[#2C1625] flex items-center justify-center text-[#FF9CB1]">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="7"></rect><path d="M12 2v6"></path></svg>
                            </div>
                            <span className="text-[#FF9CB1] text-[15px]">Mirar</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded border border-[#FFB3C6] bg-[#2C1625] flex items-center justify-center text-[#FFE5EC] text-sm font-bold">E</div>
                            <span className="text-[#FF9CB1] text-[15px]">Interactuar</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="w-full py-4 rounded bg-transparent border border-[#FFB3C6] text-[#FF9CB1] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#2C1625] transition-colors"
                        >
                          CERRAR
                        </button>
                      </motion.div>
                    )}

                    {exploracionMenuTab === 'acciones' && (
                      <motion.div
                        key="exploracion-acciones"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-[480px] min-h-[480px] rounded-2xl bg-[#191522]/90 backdrop-blur-xl border border-[#3D1C34] flex flex-col items-center p-10 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                      >
                        <Footprints className="w-12 h-12 text-[#FF9CB1] mb-6 drop-shadow-[0_0_15px_rgba(255,156,177,0.3)] fill-current" />
                        <h2 className="text-2xl font-extrabold text-[#FF9CB1] tracking-[0.1em] mb-8 text-center uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>Acciones Elegidas</h2>
                        <div className="w-full h-px bg-[#3D1C34] mb-8"></div>
                        
                        <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar mb-8">
                          {selectedPhrases.length > 0 ? (
                            selectedPhrases.map((phrase, idx) => (
                              <div key={idx} className="w-full bg-[#2A1629] border border-[#FFB3C6] rounded-lg p-4">
                                <p className="text-[#FFE5EC] text-sm italic">"{phrase}"</p>
                              </div>
                            ))
                          ) : (
                            <div className="flex-1 flex items-center justify-center flex-col gap-4">
                              <p className="text-[#FFE5EC]/50 text-sm text-center">Aún no has elegido ninguna acción en este camino.</p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="w-full py-4 rounded bg-transparent border border-[#FFB3C6] text-[#FF9CB1] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#2C1625] transition-colors mt-auto"
                        >
                          CERRAR
                        </button>
                      </motion.div>
                    )}

                    {exploracionMenuTab === 'reflexiones' && (
                      <motion.div
                        key="exploracion-reflexiones"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-[480px] min-h-[480px] rounded-2xl bg-[#191522]/90 backdrop-blur-xl border border-[#3D1C34] flex flex-col items-center p-10 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
                      >
                        <Sparkles className="w-12 h-12 text-[#FF9CB1] mb-6 drop-shadow-[0_0_15px_rgba(255,156,177,0.3)]" />
                        <h2 className="text-2xl font-extrabold text-[#FF9CB1] tracking-[0.1em] mb-4 text-center uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>Reflexiones</h2>
                        <p className="text-[#FFE5EC]/80 text-sm text-center mb-8">Tómate un momento para analizar las acciones y emociones que has experimentado en tu camino.</p>
                        <div className="w-full h-px bg-[#3D1C34] mb-8"></div>
                        
                        <div className="flex-1 flex flex-col items-center justify-center mb-8">
                          <button
                            onClick={() => {
                              setAppState('PLAYING');
                              setShowReflectionsModal(true);
                            }}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FFB3C6] to-[#FF9CB1] text-[#2C1625] font-extrabold tracking-wider uppercase hover:shadow-[0_0_25px_rgba(255,156,177,0.6)] transform hover:scale-105 transition-all flex items-center gap-3"
                          >
                            <Sparkles className="w-5 h-5" />
                            Comenzar Reflexión
                          </button>
                        </div>

                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="w-full py-4 rounded bg-transparent border border-[#FFB3C6] text-[#FF9CB1] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#2C1625] transition-colors mt-auto"
                        >
                          VOLVER AL JUEGO
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : stage === 'CLARIDAD' ? (
              <div className="absolute inset-0 flex z-30 bg-black/40 backdrop-blur-sm">
                {/* Left Sidebar Menu for CLARIDAD */}
                {(!isMobile || claridadMenuTab === 'intro') && (
                  <div className={`${isMobile ? 'w-full' : 'w-[280px]'} h-full bg-[#1C1A14]/95 border-r border-[#3E2900] flex flex-col py-8 shadow-[20px_0_40px_rgba(0,0,0,0.8)] z-20`}>
                    <div className="px-8 mb-12">
                      <h2 className="text-[#FFA800] text-xl font-bold tracking-wide uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>Creatividad</h2>
                      <p className="text-[#E2E2D5]/60 text-[11px] uppercase tracking-wider font-light mt-1">Claridad</p>
                    </div>

                    <div className="flex flex-col flex-1 gap-2">
                       <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${claridadMenuTab === 'intro' ? 'bg-[#3E2900]/50 text-[#FFA800] border-l-2 border-[#FFA800]' : 'text-[#E2E2D5]/60 hover:text-[#FFA800] hover:bg-[#3E2900]/30'}`}
                        onClick={() => setClaridadMenuTab('intro')}
                      >
                         <Sun className={`w-5 h-5 ${claridadMenuTab === 'intro' ? 'text-[#FFA800]' : ''}`} />
                         <span className="text-sm font-medium tracking-wide">Inicio</span>
                       </div>
                       
                       <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${claridadMenuTab === 'ejercicios' ? 'bg-[#3E2900]/50 text-[#FFA800] border-l-2 border-[#FFA800]' : 'text-[#E2E2D5]/60 hover:text-[#FFA800] hover:bg-[#3E2900]/30'}`}
                        onClick={() => setClaridadMenuTab('ejercicios')}
                      >
                         <Footprints className={`w-5 h-5 ${claridadMenuTab === 'ejercicios' ? 'text-[#FFA800]' : ''}`} />
                         <span className="text-sm font-medium tracking-wide">Acciones</span>
                       </div>
                       
                       <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${claridadMenuTab === 'controles' ? 'bg-[#3E2900]/50 text-[#FFA800] border-l-2 border-[#FFA800]' : 'text-[#E2E2D5]/60 hover:text-[#FFA800] hover:bg-[#3E2900]/30'}`}
                        onClick={() => setClaridadMenuTab('controles')}
                      >
                         <Settings2 className={`w-5 h-5 ${claridadMenuTab === 'controles' ? 'text-[#FFA800]' : ''}`} />
                         <span className="text-sm font-medium tracking-wide">Controles</span>
                       </div>
                    </div>

                    <div className="mt-auto pt-8">
                       <div 
                        className={`flex items-center gap-4 px-8 py-4 w-full cursor-pointer transition-colors ${claridadMenuTab === 'ayuda' ? 'bg-[#3E2900]/50 text-[#FFA800] border-l-2 border-[#FFA800]' : 'text-[#E2E2D5]/60 hover:text-[#FFA800] hover:bg-[#3E2900]/30'}`}
                        onClick={() => setClaridadMenuTab('ayuda')}
                      >
                         <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold leading-none ${claridadMenuTab === 'ayuda' ? 'border-[#FFA800] text-[#FFA800]' : 'border-[#E2E2D5]/30 text-[#E2E2D5]/60'}`}>
                           R
                         </div>
                         <span className="text-sm font-medium tracking-wide">Reflexión Interior</span>
                       </div>
                    </div>
                  </div>
                )}

                {/* Right Content Area for CLARIDAD */}
                <div className="flex-1 flex items-center justify-center relative p-8">
                  <AnimatePresence mode="wait">
                    {claridadMenuTab === 'intro' && (
                      <motion.div
                        key="claridad-intro"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-[480px] rounded-2xl bg-[#1C1A14] border border-[#FFA200]/50 shadow-[0_0_40px_rgba(255,162,0,0.15)] flex flex-col items-center text-center px-10 py-12 relative overflow-hidden"
                      >
                        <div className="mb-6 w-16 h-16 rounded-full bg-[#242C1B] border border-[#78A840] shadow-[0_0_25px_rgba(120,168,64,0.3)] flex items-center justify-center">
                          <Footprints className="w-8 h-8 text-[#86B84A] fill-current" />
                        </div>
                        
                        <h2 className="text-[32px] font-bold text-[#FFA800] uppercase tracking-wide mb-6" style={{ fontFamily: '"Inter", sans-serif' }}>
                          CLARIDAD
                        </h2>

                        <p className="text-[16px] text-[#E2E2D5] leading-[1.6] max-w-[320px] font-light mb-12">
                          El camino está claro. ¡Disfruta de la creatividad y haz cosas nuevas con todo lo que has aprendido!
                        </p>

                        <button
                          onClick={() => setAppState('PLAYING')}
                          className="w-full max-w-[340px] py-4 rounded-full bg-[#FFAB00] text-[#3E2900] text-[13px] font-bold tracking-[0.1em] uppercase hover:bg-[#EAA000] hover:shadow-[0_0_20px_rgba(255,171,0,0.3)] transition-all duration-300"
                        >
                          ENTENDIDO
                        </button>
                      </motion.div>
                    )}

                    {claridadMenuTab === 'controles' && (
                      <motion.div
                        key="claridad-controles"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-[480px] flex flex-col"
                      >
                        <div className="bg-[#1C1A14]/90 border border-[#FFA800]/40 rounded-[20px] shadow-[0_0_50px_rgba(255,168,0,0.15)] backdrop-blur-xl relative overflow-hidden flex flex-col p-8">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-[#FFA800] opacity-40 blur-[2px]"></div>
                          
                          <h2 className="text-[32px] font-extrabold text-[#FFA800] uppercase tracking-widest text-center mb-10 drop-shadow-[0_0_15px_rgba(255,168,0,0.4)]" style={{ fontFamily: '"Inter", sans-serif' }}>CONTROLES</h2>

                          <div className="flex flex-col gap-4 mb-10 w-full">
                            {[
                              { label: 'Avanzar', key: 'W' },
                              { label: 'Retroceder', key: 'S' },
                              { label: 'Izquierda', key: 'A' },
                              { label: 'Derecha', key: 'D' },
                              { label: 'Interactuar', key: 'E' },
                              { label: 'Mirar / Apuntar', key: 'Mouse' }
                            ].map((ctrl, i) => (
                              <div key={i} className="flex items-center justify-between bg-[#110D0A]/60 border border-[#3E2900] rounded-xl p-5 shadow-inner">
                                <span className="text-[#E2E2D5] text-[16px] font-medium tracking-wide">{ctrl.label}</span>
                                <div className="border border-[#FFA800]/30 bg-[#2C190A]/80 text-[#FFA800] text-xs font-bold tracking-wider px-3.5 py-1.5 rounded">
                                  {ctrl.key}
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => setAppState('PLAYING')}
                            className="w-full py-4 rounded-full border border-[#FFA800]/50 text-[#FFA800] text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-[#FFA800]/10 transition-colors flex items-center justify-center gap-2 mx-auto max-w-[200px]"
                          >
                            <span className="font-light text-lg pb-[2px]">&times;</span> CERRAR
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {claridadMenuTab === 'ejercicios' && (
                      <motion.div
                        key="claridad-ejercicios"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-[500px] h-[500px] bg-[#1C1A14]/95 border border-[#3E2900] rounded-2xl p-8 flex flex-col shadow-[0_0_40px_rgba(255,162,0,0.15)]"
                      >
                         <Footprints className="w-12 h-12 text-[#FFA800] mb-6 drop-shadow-[0_0_15px_rgba(255,168,0,0.3)] fill-current" />
                         <h2 className="text-2xl font-bold text-white tracking-[0.1em] mb-8 text-center uppercase">Acciones</h2>
                         <div className="w-full h-px bg-[#3E2900] mb-8"></div>
                         
                         <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar mb-8">
                           {selectedPhrases.length > 0 ? (
                             selectedPhrases.map((phrase, idx) => (
                               <div key={idx} className="w-full bg-[#110D0A] border border-[#3E2900] rounded-lg p-4 flex gap-4 items-start">
                                 <span className="text-[#FFA800] font-bold text-[15px]">{idx + 1}.</span>
                                 <p className="text-[#E2E2D5] text-[15px] leading-relaxed font-medium">{phrase}</p>
                               </div>
                             ))
                           ) : (
                             <div className="flex-1 flex items-center justify-center">
                               <p className="text-[#E2E2D5]/50 text-sm text-center">Aún no has completado acciones en la claridad.</p>
                             </div>
                           )}
                         </div>

                         <button
                           onClick={() => setAppState('PLAYING')}
                           className="w-full py-4 rounded-[20px] bg-transparent border border-[#FFA800] text-[#FFA800] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#FFA800]/10 transition-colors mt-auto"
                         >
                           CERRAR
                         </button>
                      </motion.div>
                    )}

                    {claridadMenuTab === 'ayuda' && (
                      <motion.div
                        key="claridad-ayuda"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-[500px] p-8 bg-[#1C1A14]/95 border border-[#3E2900] rounded-xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,162,0,0.15)]"
                      >
                         <h3 className="text-xl font-bold tracking-widest uppercase mb-4 text-[#FFA800]" style={{ fontFamily: '"Playfair Display", serif' }}>
                           Reflexión Interior
                         </h3>
                         <p className="text-[#E2E2D5] text-center mb-8 px-4 text-sm leading-relaxed">
                           Estás en el claro abierto. Utiliza este espacio para reflexionar, buscar inspiración o crear libremente. 
                           Presiona <span className="text-[#FFA800] font-bold">C</span> en cualquier momento para obtener una chispa de inspiración.
                         </p>
                         <button
                           onClick={() => setAppState('PLAYING')}
                           className="w-full py-3 bg-[#FFA800] hover:bg-[#FFA800]/80 text-[#3E2900] font-bold tracking-wider text-sm rounded shadow-[0_0_15px_rgba(255,168,0,0.4)] transition-all"
                         >
                           CONTINUAR
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
          </>
        )}

        {appState === 'CARD_VIEW' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-4 bg-black/60 backdrop-blur-sm">
            {stage === 'NIEBLA' ? (
              <motion.div
                key="card-view-niebla"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-[400px] rounded-[32px] bg-gradient-to-b from-[#557360] to-[#24312A] border border-white/5 flex flex-col items-center text-center px-8 py-10 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
              >
                <Leaf className="w-10 h-10 text-[#8BE8B9] mb-6 fill-current opacity-90" />
                
                <h3 className="text-2xl font-bold text-[#F3F4F6] mb-12 px-2 leading-snug tracking-wide" style={{ fontFamily: '"Inter", sans-serif' }}>
                  "{currentPhrase}"
                </h3>
                
                <div className="flex flex-col gap-4 w-full">
                  <button
                    onClick={handleAcceptPhrase}
                    className="w-full py-3.5 rounded-full bg-[#8BE8B9] text-[#1B3024] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#A3FAE1] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(139,232,185,0.4)]"
                  >
                    <span>ASÍ ME SIENTO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setAppState('PLAYING')}
                    className="w-full py-3.5 rounded-full bg-transparent border border-[#4E6B5A] text-[#8BE8B9] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#2A3A32] transition-colors"
                  >
                    CERRAR
                  </button>
                </div>
              </motion.div>
            ) : stage === 'EXPLORACION' ? (
              <motion.div
                key="card-view-exploracion"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-[340px] rounded-3xl bg-[#191522]/95 backdrop-blur-xl border border-white/5 flex flex-col items-center px-6 py-8 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
              >
                <div className="w-full flex justify-end mb-8">
                  <button 
                    onClick={() => setAppState('PLAYING')}
                    className="text-white/60 hover:text-white text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 transition-colors"
                  >
                    CERRAR <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center px-2 w-full mb-8">
                   <p className="text-[#FF9CB1]/70 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Acción Elegida</p>
                   <p className="text-[#FFF0F4] text-[15px] font-medium leading-relaxed italic drop-shadow-md">"{currentPhrase}"</p>
                </div>

                <div className="w-48 h-48 rounded-full border-[3px] border-[#FF9CB1] shadow-[0_0_25px_rgba(255,156,177,0.3),inset_0_0_25px_rgba(255,156,177,0.3)] flex items-center justify-center mb-10 relative">
                  <div className="absolute inset-0 rounded-full border border-[#FF9CB1]/20 blur-[2px]"></div>
                  <div className="text-[56px] font-bold text-[#FF9CB1] tracking-tighter drop-shadow-md" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {Math.floor(currentTimeLeft / 60)}:{(currentTimeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                  <button
                    onClick={() => setPhraseTimerRunning(prev => ({ ...prev, [currentPhrase]: !currentIsRunning }))}
                    className="w-full py-4 rounded-full bg-[#FFB3C6] text-[#4A1625] text-[11px] font-extrabold tracking-[0.15em] uppercase hover:bg-[#FFC4D4] hover:shadow-[0_0_20px_rgba(255,179,198,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {!currentIsRunning && <Play className="w-4 h-4 fill-current cursor-pointer" />}
                    {currentIsRunning && <Square className="w-4 h-4 fill-current cursor-pointer" />}
                    <span>{currentIsRunning ? 'PAUSAR CRONÓMETRO' : 'INICIAR CRONÓMETRO'}</span>
                  </button>
                  <button
                    onClick={() => {
                        setPhraseTimers(prev => ({...prev, [currentPhrase]: 300}));
                        setPhraseTimerRunning(prev => ({...prev, [currentPhrase]: false}));
                    }}
                    className="w-full py-1 rounded-full bg-transparent text-[#FF9CB1]/70 text-[10px] font-bold tracking-[0.15em] uppercase hover:text-[#FFB3C6] transition-colors"
                  >
                    REINICIAR CRONÓMETRO
                  </button>
                  
                  <button
                    onClick={() => {
                      setAppState('PLAYING');
                      setShowReflectionsModal(true);
                    }}
                    className="w-full py-2 rounded-full bg-transparent text-white/50 text-[10px] font-bold tracking-[0.15em] uppercase hover:text-white transition-colors flex items-center justify-center gap-2 mb-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> ABRIR REFLEXIONES
                  </button>

                  <button
                    onClick={handleAcceptPhrase}
                    className="w-full py-4 rounded-full bg-transparent border-2 border-[#DFFF00] text-[#DFFF00] text-[11px] font-extrabold tracking-[0.15em] uppercase hover:bg-[#DFFF00] hover:text-[#2A3300] hover:shadow-[0_0_15px_rgba(223,255,0,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ENTENDIDO</span> 
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="card-view"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`${isMobile ? 'p-4 pt-10 max-w-xs' : 'p-10 pt-16 max-w-md'} w-full rounded-t-[150px] rounded-b-2xl bg-gradient-to-b from-[#8B5A2B] via-[#4A2810] to-[#2A1408] border-4 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.5)] flex flex-col items-center text-center ${isMobile ? 'gap-4' : 'gap-6'} relative overflow-hidden`}
              >
                {isMobile && (
                  <button
                    onClick={() => setAppState('PLAYING')}
                    className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#2A1408] border-x-2 border-b-2 border-[#FFD700] text-[#FFD700] px-6 py-1.5 rounded-b-xl shadow-md flex items-center justify-center z-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {/* Inner decorative border */}
                <div className="absolute inset-4 border-2 border-[#FFD700]/60 rounded-t-[134px] rounded-b-xl pointer-events-none shadow-[inset_0_0_15px_rgba(255,215,0,0.3)]"></div>

                <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-medium leading-relaxed font-serif italic text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.6)] relative z-10 mt-4`}>
                  "{currentPhrase}"
                </p>

                <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-3'} w-full mt-4 relative z-10`}>
                  <button
                    onClick={handleAcceptPhrase}
                    className={`w-full ${isMobile ? 'px-4 py-3 text-sm' : 'px-8 py-4 text-lg'} rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-extrabold hover:from-[#FFD700] hover:to-[#FFF8DC] transition-all shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:shadow-[0_0_40px_rgba(255,215,0,0.9)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider`}
                  >
                    <span>{stage === 'CLARIDAD' ? 'Vamos a crear' : 'Así me siento'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setAppState('PLAYING')}
                    className={`w-full ${isMobile ? 'px-4 py-3 text-sm' : 'px-8 py-4 text-lg'} rounded-full bg-[#3D2314] text-[#FDE68A] font-bold hover:bg-[#4A2810] transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 border border-[#FFD700]/30 uppercase tracking-wider`}
                  >
                    <span>Cerrar</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
        {appState === 'END_SCREEN' && (
          <div className="absolute inset-0 flex items-center justify-center z-50 p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${isMobile ? 'p-6' : 'p-12'} max-w-xl w-full rounded-2xl bg-gradient-to-b from-[#8B5A2B] via-[#4A2810] to-[#2A1408] border-4 border-[#FFD700] shadow-[0_0_80px_rgba(255,215,0,0.6)] flex flex-col items-center text-center gap-6`}
            >
              <Sparkles className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} text-[#FFD700]`} />
              <h2 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-extrabold text-[#FFD700] font-serif`}>¡Haz encontrado la luz!</h2>
              <p className={`${isMobile ? 'text-base' : 'text-xl'} text-[#FDE68A] leading-relaxed font-serif`}>
                Has creado nuevas ideas y tienes la capacidad de hacerlas realidad.
              </p>
              <button
                onClick={() => {
                  setStage('NIEBLA');
                  setPhraseSelectedForStage(false);
                  setCurrentPhrase("");
                  setSelectedPhrases([]);
                  setPhraseTimers({});
                  setPhraseTimerRunning({});
                  setAppState('START_MENU');
                }}
                className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-extrabold text-lg hover:from-[#FFD700] hover:to-[#FFF8DC] transition-all shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:shadow-[0_0_40px_rgba(255,215,0,0.8)] active:scale-95 uppercase tracking-wider"
              >
                Volver al Inicio
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showReflectionsModal && (
        <ReflectionsModal onClose={() => setShowReflectionsModal(false)} />
      )}

      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
}
