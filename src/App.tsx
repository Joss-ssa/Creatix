/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Footprints, Sun, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Game2D } from './components/Game2D';

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
type AppState = 'START_MENU' | 'STAGE_INTRO' | 'PLAYING' | 'CARD_VIEW';

// --- Main Application ---

export default function App() {
  const [appState, setAppState] = useState<AppState>('START_MENU');
  const [stage, setStage] = useState<Stage>('NIEBLA');
  const [currentPhrase, setCurrentPhrase] = useState<string>("");
  const [introPhrase, setIntroPhrase] = useState("");
  
  // New states for the requested flow
  const [phraseSelectedForStage, setPhraseSelectedForStage] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showControlsMenu, setShowControlsMenu] = useState(false);
  const [showMHint, setShowMHint] = useState(false);
  const [hasShownControlsForStage, setHasShownControlsForStage] = useState(false);

  useEffect(() => {
    setIntroPhrase(THEME_PHRASES[Math.floor(Math.random() * THEME_PHRASES.length)]);
  }, []);

  // Controls menu timer
  useEffect(() => {
    if (appState === 'PLAYING' && !hasShownControlsForStage) {
      setShowControlsMenu(true);
      setShowMHint(false);
      const timer = setTimeout(() => {
        setShowControlsMenu(false);
        setShowMHint(true);
        setHasShownControlsForStage(true);
      }, 10000);
      return () => clearTimeout(timer);
    } else if (appState === 'PLAYING' && hasShownControlsForStage) {
      if (!showControlsMenu) {
        setShowMHint(true);
      }
    } else {
      setShowControlsMenu(false);
      setShowMHint(false);
    }
  }, [appState, hasShownControlsForStage]);

  // Reset hasShownControlsForStage when stage changes
  useEffect(() => {
    setHasShownControlsForStage(false);
  }, [stage]);

  // M key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm' && appState === 'PLAYING') {
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const handlePhraseSelect = (phrase: string) => {
    setCurrentPhrase(phrase);
    setAppState('CARD_VIEW');
  };

  const handleAcceptPhrase = () => {
    setPhraseSelectedForStage(true);
    setAppState('PLAYING');
  };

  const handleEnterTunnel = () => {
    if (stage === 'NIEBLA') {
      setStage('EXPLORACION');
    } else if (stage === 'EXPLORACION') {
      setStage('CLARIDAD');
    } else {
      setStage('CLARIDAD');
    }
    // Reset states for the new stage
    setPhraseSelectedForStage(false);
    setCurrentPhrase("");
    setTimeLeft(300);
    setIsTimerRunning(false);
    setAppState('STAGE_INTRO');
  };

  const currentPhrasesList = 
    stage === 'NIEBLA' ? NIEBLA_PHRASES : 
    stage === 'EXPLORACION' ? EXPLORACION_ACTIONS : 
    CLARIDAD_EXERCISES;

  return (
    <div className="min-h-screen w-full bg-sky-100 font-sans selection:bg-sky-200 overflow-hidden relative">
      
      {(appState === 'PLAYING' || appState === 'CARD_VIEW') && (
        <Game2D 
          key={stage}
          stage={stage} 
          appState={appState}
          onPhraseSelect={handlePhraseSelect} 
          phrases={currentPhrasesList}
          hasSelectedPhrase={phraseSelectedForStage}
          selectedPhrase={currentPhrase}
          onEnterTunnel={handleEnterTunnel}
        />
      )}

      {/* Top Doors Menu */}
      {appState === 'PLAYING' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 max-w-[90%] overflow-x-auto pb-2 scrollbar-hide pointer-events-none">
          {currentPhrasesList.map((phrase, idx) => {
            const isSelected = phraseSelectedForStage && currentPhrase === phrase;
            return (
              <div 
                key={idx}
                className={`flex-shrink-0 px-3 py-1.5 rounded-md border text-xs font-bold transition-all duration-500 max-w-[150px] truncate ${
                  isSelected 
                    ? 'bg-[#FFD700] border-[#FFD700] text-[#2A1408] shadow-[0_0_15px_rgba(255,215,0,0.8)]' 
                    : 'bg-[#1a1a1a]/80 border-[#333] text-[#FFD700] shadow-[0_0_5px_rgba(255,215,0,0.3)]'
                }`}
                title={phrase}
              >
                {phrase}
              </div>
            );
          })}
        </div>
      )}

      {/* Controls Menu Overlay */}
      {showControlsMenu && appState === 'PLAYING' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-black/80 border-2 border-[#FFD700] rounded-xl p-8 text-white text-center shadow-[0_0_40px_rgba(255,215,0,0.4)] backdrop-blur-md">
          <h3 className="text-2xl font-extrabold text-[#FFD700] mb-6 uppercase tracking-widest" style={{ fontFamily: '"Playfair Display", serif' }}>Controles</h3>
          <div className="flex flex-col gap-4 text-lg font-medium">
            <p><span className="font-bold text-[#FDE68A] inline-block w-24 text-right mr-3">[W][A][S][D]</span> Moverse</p>
            <p><span className="font-bold text-[#FDE68A] inline-block w-24 text-right mr-3">[Ratón]</span> Mirar</p>
            <p><span className="font-bold text-[#FDE68A] inline-block w-24 text-right mr-3">[E]</span> Interactuar</p>
          </div>
          <button 
            onClick={() => { 
              setShowControlsMenu(false); 
              setShowMHint(true); 
              setHasShownControlsForStage(true);
            }}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-extrabold rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.5)] uppercase tracking-wider text-sm"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* M Hint Overlay */}
      {showMHint && appState === 'PLAYING' && (
        <div className="absolute bottom-8 right-8 z-30 bg-black/60 border border-[#FFD700]/50 rounded-lg px-5 py-3 text-white text-sm shadow-[0_0_15px_rgba(255,215,0,0.2)] backdrop-blur-sm">
          Presiona <span className="font-bold text-[#FFD700] text-base mx-1">M</span> para activar el menú
        </div>
      )}

      <AnimatePresence mode="wait">
        {appState === 'START_MENU' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-2xl w-full p-12 pt-24 rounded-t-[200px] rounded-b-2xl bg-gradient-to-b from-[#8B5A2B] via-[#4A2810] to-[#2A1408] border-4 border-[#FFD700] shadow-[0_0_60px_rgba(255,215,0,0.5)] flex flex-col items-center text-center gap-8 relative overflow-hidden"
            >
              {/* Inner decorative border */}
              <div className="absolute inset-5 border-2 border-[#FFD700]/60 rounded-t-[180px] rounded-b-xl pointer-events-none shadow-[inset_0_0_20px_rgba(255,215,0,0.3)]"></div>
              <div className="absolute inset-8 border border-[#FFD700]/30 rounded-t-[160px] rounded-b-lg pointer-events-none"></div>

              <div className="p-5 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-full text-[#2A1408] shadow-[0_0_30px_rgba(255,215,0,0.8)] relative z-10">
                <Sparkles className="w-12 h-12" />
              </div>
              <h1 className="text-6xl font-extrabold text-[#FFD700] tracking-widest drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] uppercase relative z-10" style={{ fontFamily: '"Playfair Display", serif' }}>
                Creatix
              </h1>
              <p className="text-2xl text-[#FDE68A] font-serif italic leading-relaxed px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10">
                "{introPhrase}"
              </p>
              <button
                onClick={() => setAppState('STAGE_INTRO')}
                className="mt-6 px-10 py-4 rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-extrabold text-lg hover:from-[#FFD700] hover:to-[#FFF8DC] transition-all shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:shadow-[0_0_40px_rgba(255,215,0,0.9)] active:scale-95 flex items-center justify-center gap-3 relative z-10 uppercase tracking-wider"
              >
                <span>Comenzar Viaje</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}

        {appState === 'STAGE_INTRO' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              key="stage-intro"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-md w-full p-10 pt-16 rounded-t-[150px] rounded-b-2xl bg-gradient-to-b from-[#8B5A2B] via-[#4A2810] to-[#2A1408] border-4 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.5)] flex flex-col items-center text-center gap-6 relative overflow-hidden"
            >
              {/* Inner decorative border */}
              <div className="absolute inset-4 border-2 border-[#FFD700]/60 rounded-t-[134px] rounded-b-xl pointer-events-none shadow-[inset_0_0_15px_rgba(255,215,0,0.3)]"></div>

              <div className="p-5 rounded-full bg-gradient-to-br from-[#FFD700] to-[#B8860B] text-[#2A1408] shadow-[0_0_20px_rgba(255,215,0,0.8)] relative z-10">
                {stage === 'NIEBLA' && <Cloud className="w-10 h-10" />}
                {stage === 'EXPLORACION' && <Footprints className="w-10 h-10" />}
                {stage === 'CLARIDAD' && <Sun className="w-10 h-10" />}
              </div>
              <div className="relative z-10">
                <h2 className="text-sm font-bold tracking-widest uppercase text-[#FDE68A] mb-1 drop-shadow-md">Nivel Actual</h2>
                <h3 className="text-4xl font-extrabold text-[#FFD700] capitalize drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" style={{ fontFamily: '"Playfair Display", serif' }}>{stage}</h3>
              </div>

              <p className="text-lg text-[#FDE68A] leading-relaxed px-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10 font-serif">
                {stage === 'NIEBLA' && "Estás en la niebla. Lee un arco para entender cómo te sientes y abrir el túnel."}
                {stage === 'EXPLORACION' && "La niebla se disipa. Encuentra una acción, tómate tu tiempo y cruza el túnel."}
                {stage === 'CLARIDAD' && "El camino está claro. Disfruta de la creatividad."}
              </p>

              <button
                onClick={() => setAppState('PLAYING')}
                className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-extrabold text-base hover:from-[#FFD700] hover:to-[#FFF8DC] transition-all shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:shadow-[0_0_30px_rgba(255,215,0,0.8)] active:scale-95 flex items-center justify-center gap-2 relative z-10 uppercase tracking-wider"
              >
                <span>Entendido</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}

        {appState === 'CARD_VIEW' && (
          <div className="absolute inset-0 flex items-center justify-center z-20 p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              key="card-view"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="max-w-md w-full p-10 pt-16 rounded-t-[150px] rounded-b-2xl bg-gradient-to-b from-[#8B5A2B] via-[#4A2810] to-[#2A1408] border-4 border-[#FFD700] shadow-[0_0_50px_rgba(255,215,0,0.5)] flex flex-col items-center text-center gap-6 relative overflow-hidden"
            >
              {/* Inner decorative border */}
              <div className="absolute inset-4 border-2 border-[#FFD700]/60 rounded-t-[134px] rounded-b-xl pointer-events-none shadow-[inset_0_0_15px_rgba(255,215,0,0.3)]"></div>

              <p className="text-2xl font-medium leading-relaxed font-serif italic text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.6)] relative z-10 mt-4">
                "{currentPhrase}"
              </p>

              {stage === 'EXPLORACION' && (
                <div className="w-full bg-[#3D2314]/80 rounded-2xl p-6 border border-[#FFD700]/40 mt-2 relative z-10 shadow-inner">
                  <h4 className="text-[#FDE68A] font-bold mb-2 uppercase tracking-widest text-xs drop-shadow-md">Tiempo sugerido</h4>
                  <div className="text-5xl font-mono font-bold text-[#FFD700] mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5A2B] to-[#B8860B] text-[#FFF8DC] font-bold hover:from-[#B8860B] hover:to-[#FFD700] hover:text-[#2A1408] transition-colors text-sm border border-[#FFD700]/50 uppercase tracking-wider shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                  >
                    {isTimerRunning ? 'Pausar' : 'Iniciar Cronómetro'}
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3 w-full mt-4 relative z-10">
                <button
                  onClick={handleAcceptPhrase}
                  className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-extrabold text-lg hover:from-[#FFD700] hover:to-[#FFF8DC] transition-all shadow-[0_0_20px_rgba(255,215,0,0.6)] hover:shadow-[0_0_40px_rgba(255,215,0,0.9)] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  <span>{stage === 'EXPLORACION' ? 'Estoy listo' : 'Así me siento'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setAppState('PLAYING')}
                  className="w-full px-8 py-4 rounded-full bg-[#3D2314] text-[#FDE68A] font-bold text-lg hover:bg-[#4A2810] transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 border border-[#FFD700]/30 uppercase tracking-wider"
                >
                  <span>Cerrar</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
