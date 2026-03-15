/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Timer, AlertCircle, Lightbulb, Quote, Siren, ArrowLeft, Loader2, Wand2, Palette, RefreshCw, PenTool, Shapes, Brush, Pencil, Hexagon, Circle, Triangle, Star, Cloud, Moon, Sun, Zap, Snowflake, Flame, Droplet, Wind, Mountain, Trees, Building, Car, Rocket, Plane, Cpu, Database, Globe, Anchor, Music, Camera, Video, Gamepad, Coffee, Ghost, Skull } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

const IconMap: Record<string, any> = {
  Sparkles, Timer, AlertCircle, Lightbulb, Quote, Siren, ArrowLeft, Loader2, Wand2, Palette, RefreshCw, PenTool, Shapes, Brush, Pencil, Hexagon, Circle, Triangle, Star, Cloud, Moon, Sun, Zap, Snowflake, Flame, Droplet, Wind, Mountain, Trees, Building, Car, Rocket, Plane, Cpu, Database, Globe, Anchor, Music, Camera, Video, Gamepad, Coffee, Ghost, Skull
};

const objects = [
  { name: 'gato', article: 'un', diff: 1, en: 'cat' },
  { name: 'robot', article: 'un', diff: 2, en: 'robot' },
  { name: 'ciudad', article: 'una', diff: 2, en: 'city' },
  { name: 'árbol', article: 'un', diff: 1, en: 'tree' },
  { name: 'dragón', article: 'un', diff: 2, en: 'dragon' },
  { name: 'bicicleta', article: 'una', diff: 2, en: 'bicycle' },
  { name: 'casa', article: 'una', diff: 1, en: 'house' },
  { name: 'monstruo', article: 'un', diff: 2, en: 'monster' }
];

const styles = [
  { name: 'minimalista', diff: 1, en: 'minimalist' },
  { name: 'cartoon', diff: 1, en: 'cartoon' },
  { name: 'surrealista', diff: 2, en: 'surrealist' },
  { name: 'pixel art', diff: 2, en: 'pixel art' },
  { name: 'retro', diff: 1, en: 'retro' },
  { name: 'futurista', diff: 2, en: 'futuristic' }
];

const restrictions = [
  { name: 'usando solo dos colores', diff: 1 },
  { name: 'usando solo líneas rectas', diff: 2 },
  { name: 'sin levantar el lápiz', diff: 2 },
  { name: 'sin borrar', diff: 1 },
  { name: 'usando solo círculos', diff: 2 }
];

const quotes = [
  "El primer trazo es el más valiente.",
  "No busques la perfección, busca la expresión.",
  "Tu creatividad no tiene límites.",
  "Deja que tu imaginación te guíe.",
  "Cada error es una nueva idea.",
  "Dibuja lo que sientes, no lo que ves.",
  "El arte es libertad absoluta.",
  "Hazlo a tu manera, esa es la regla.",
  "Empieza con una línea y mira a dónde te lleva."
];

const enhanceImagePrompt = (prompt: string) => {
  return `${prompt}, highly detailed, strictly no humans, no people, nobody, empty scene, focused entirely on the concept, masterpiece, 4k resolution`;
};

const FloatingBackground = ({ isFullScreen = true, variant = 'light', customGradient, customIcons, customColors }: { isFullScreen?: boolean, variant?: 'light' | 'dark' | 'panic', customGradient?: string, customIcons?: string[], customColors?: string[] }) => {
  const defaultIcons = [PenTool, Palette, Shapes, Sparkles, Brush, Pencil, Hexagon, Circle, Triangle];
  
  // Memoize the random values so they don't change on every render, but DO change when icons/colors change
  const elements = useMemo(() => {
    const icons = customIcons && customIcons.length > 0 ? customIcons.map(name => IconMap[name] || Sparkles) : defaultIcons;
    return Array.from({ length: isFullScreen ? 24 : 15 }).map((_, i) => ({
      Icon: icons[i % icons.length],
      color: customColors && customColors.length > 0 ? customColors[i % customColors.length] : undefined,
      size: Math.random() * (isFullScreen ? 120 : 60) + (isFullScreen ? 40 : 20),
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      moveX: Math.random() * 100 - 50,
      moveY: Math.random() * 100 - 50,
      duration: Math.random() * 50 + 40,
    }));
  }, [isFullScreen, customIcons, customColors]);

  const gradientClass = customGradient ? '' : variant === 'light' ? 'animate-subtle-gradient-light' : variant === 'dark' ? 'animate-subtle-gradient-dark' : 'animate-subtle-gradient-panic';
  const iconClass = variant === 'light' 
    ? 'opacity-[0.2] text-[#0F766E]' 
    : variant === 'dark' 
      ? 'opacity-[0.25] text-white' 
      : customGradient 
        ? 'opacity-[0.25] text-current' 
        : 'opacity-[0.15] text-rose-500';
  const positionClass = isFullScreen ? 'fixed inset-0' : 'absolute inset-0';

  return (
    <div className={`${positionClass} overflow-hidden pointer-events-none z-0`}>
      <style>{`
        @keyframes subtle-gradient {
          0% { background-position: 0% 0%; }
          20% { background-position: 100% 50%; }
          40% { background-position: 50% 100%; }
          60% { background-position: 0% 50%; }
          80% { background-position: 50% 0%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes wave-gradient {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 100%; }
          50% { background-position: 0% 100%; }
          75% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }
        .animate-subtle-gradient-light {
          background: linear-gradient(120deg, #34D399, #10B981, #059669, #047857);
          background-size: 400% 400%;
          animation: subtle-gradient 15s ease-in-out infinite;
        }
        .animate-subtle-gradient-dark {
          background: linear-gradient(120deg, #10B981, #059669, #047857, #064E3B);
          background-size: 400% 400%;
          animation: subtle-gradient 15s ease-in-out infinite;
        }
        .animate-subtle-gradient-panic {
          background: linear-gradient(120deg, #FCA5A5, #EF4444, #DC2626, #991B1B);
          background-size: 400% 400%;
          animation: subtle-gradient 15s ease-in-out infinite;
        }
      `}</style>
      <div 
        className={`absolute inset-0 ${gradientClass} opacity-100`} 
        style={customGradient ? { 
          background: customGradient, 
          backgroundSize: '400% 400%', 
          animation: 'subtle-gradient 20s ease-in-out infinite' 
        } : undefined}
      />
      <div className={`absolute inset-0 ${iconClass}`}>
        {elements.map((el, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ 
              left: `${el.startX}%`, 
              top: `${el.startY}%`,
              color: el.color || undefined
            }}
            animate={{
              x: [0, el.moveX, 0],
              y: [0, el.moveY, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: el.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <el.Icon size={el.size} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  // Random Mode State
  const [challenge, setChallenge] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Difícil' | null>(null);
  const [seed, setSeed] = useState<number>(Math.random());
  const [imagePrompt, setImagePrompt] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);

  // Panic Mode State
  const [mode, setMode] = useState<'random' | 'panic'>('random');
  const [panicInput, setPanicInput] = useState('');
  const [panicData, setPanicData] = useState<{
    ideas: { text: string; imagePrompts: string[] }[];
    colors: { hex: string; name: string; reason: string }[];
    theme: {
      bgGradient: string;
      textColor: string;
      cardBg: string;
      cardTextColor: string;
      textureOpacity: number;
    };
    backgroundIcons?: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingColors, setIsGeneratingColors] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [imageSeedOffset, setImageSeedOffset] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => (time !== null ? time - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const generateChallenge = () => {
    setIsGenerating(true);
    setImageSeedOffset(0);
    
    // Simulate a slight delay for the loading state to be visible
    setTimeout(() => {
      const randomObject = objects[Math.floor(Math.random() * objects.length)];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      const randomRestriction = restrictions[Math.floor(Math.random() * restrictions.length)];

      const totalDiff = randomObject.diff + randomStyle.diff + randomRestriction.diff;
      const isHard = totalDiff >= 5;
      const time = isHard ? 60 : 30;

      const newChallenge = `Dibuja ${randomObject.article} ${randomObject.name} en estilo ${randomStyle.name} ${randomRestriction.name}.`;
      
      setChallenge(newChallenge);
      setTimeLeft(time);
      setIsActive(true);
      setDifficulty(isHard ? 'Difícil' : 'Fácil');
      setSeed(Math.random());
      setImagePrompt(`${randomStyle.en} ${randomObject.en}`);
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setIsGenerating(false);
    }, 600);
  };

  const handlePanicSubmit = async () => {
    if (!panicInput.trim()) return;
    setIsGenerating(true);
    setImageSeedOffset(0);
    setErrorMsg(null);
    try {
      const availableIconsList = Object.keys(IconMap).join(', ');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `El usuario quiere dibujar: "${panicInput}". Genera un JSON con: 1) 'ideas': un arreglo de 3 ideas sueltas, creativas y cortas ESCRITAS EN ESPAÑOL. Cada idea debe tener 'text' (la idea en español) y 'imagePrompts' (un arreglo de 4 descripciones MUY detalladas en inglés para generar imágenes con IA. DEBEN excluir personas explícitamente, ej: "cyberpunk city street, neon lights, highly detailed, empty streets"). 2) 'colors': un arreglo de 5 colores sugeridos, cada uno con 'hex' (código hexadecimal de 6 caracteres con el #, ej. "#FF5733"), 'name' (nombre creativo en español) y 'reason' (por qué usarlo, en español). 3) 'theme': un objeto para estilizar la interfaz basado en la vibra de la idea. Debe incluir: 'bgGradient' (un CSS linear-gradient que incluya tonos MUY oscuros y tonos MUY claros del color base, creando un contraste ALTAMENTE notorio y estético que simule el movimiento del agua al animarse, SIN usar color blanco), 'textColor' (color hexadecimal para el texto principal que contraste perfectamente con el bgGradient), 'cardBg' (color CSS para el fondo de las tarjetas, ej. 'rgba(255,255,255,0.8)' para temas claros o 'rgba(0,0,0,0.6)' para temas oscuros), 'cardTextColor' (color hexadecimal para el texto dentro de las tarjetas), y 'textureOpacity' (un número entre 0.05 y 0.3 para la opacidad de la textura de fondo). 4) 'backgroundIcons': un arreglo de 3 a 5 nombres de iconos que mejor representen la idea, ELEGIDOS ESTRICTAMENTE de esta lista: ${availableIconsList}.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ideas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['text', 'imagePrompts']
                }
              },
              colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING },
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['hex', 'name', 'reason']
                }
              },
              theme: {
                type: Type.OBJECT,
                properties: {
                  bgGradient: { type: Type.STRING },
                  textColor: { type: Type.STRING },
                  cardBg: { type: Type.STRING },
                  cardTextColor: { type: Type.STRING },
                  textureOpacity: { type: Type.NUMBER }
                },
                required: ['bgGradient', 'textColor', 'cardBg', 'cardTextColor', 'textureOpacity']
              },
              backgroundIcons: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['ideas', 'colors', 'theme', 'backgroundIcons']
          }
        }
      });
      let text = '';
      try {
        text = response.text || '{}';
      } catch (e) {
        throw new Error("La IA no pudo generar una respuesta. Intenta con otra idea.");
      }
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const data = JSON.parse(text);
      if (!data.ideas || !data.colors || !data.theme) {
        throw new Error("La respuesta de la IA fue incompleta.");
      }
      setPanicData(data);
      setSeed(Math.random());
    } catch (error: any) {
      console.error("Error generating panic ideas:", error);
      setErrorMsg(error.message || "Error desconocido al generar ideas");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateColors = async () => {
    if (!panicInput.trim() || !panicData) return;
    setIsGeneratingColors(true);
    setErrorMsg(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `El usuario quiere dibujar: "${panicInput}". Genera un JSON con: 1) 'colors': un arreglo de 5 NUEVOS colores sugeridos (diferentes a los anteriores), cada uno con 'hex' (código hexadecimal de 6 caracteres con el #, ej. "#FF5733"), 'name' (nombre creativo en español) y 'reason' (por qué usarlo, en español). 2) 'theme': un objeto para estilizar la interfaz con los NUEVOS colores. Debe incluir: 'bgGradient' (CSS linear-gradient que incluya tonos MUY oscuros y tonos MUY claros del color base, creando un contraste ALTAMENTE notorio y estético que simule el movimiento del agua al animarse, SIN usar color blanco), 'textColor' (hexadecimal que contraste), 'cardBg' (rgba para las tarjetas), 'cardTextColor' (hexadecimal para el texto de las tarjetas), y 'textureOpacity' (número entre 0.05 y 0.3).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING },
                    name: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['hex', 'name', 'reason']
                }
              },
              theme: {
                type: Type.OBJECT,
                properties: {
                  bgGradient: { type: Type.STRING },
                  textColor: { type: Type.STRING },
                  cardBg: { type: Type.STRING },
                  cardTextColor: { type: Type.STRING },
                  textureOpacity: { type: Type.NUMBER }
                },
                required: ['bgGradient', 'textColor', 'cardBg', 'cardTextColor', 'textureOpacity']
              }
            },
            required: ['colors', 'theme']
          }
        }
      });
      let text = '';
      try {
        text = response.text || '{}';
      } catch (e) {
        throw new Error("La IA no pudo generar nuevos colores.");
      }
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const data = JSON.parse(text);
      if (data.colors && data.theme) {
        setPanicData({ ...panicData, colors: data.colors, theme: data.theme });
      } else {
        throw new Error("La respuesta de la IA fue incompleta.");
      }
    } catch (error: any) {
      console.error("Error generating new colors:", error);
      setErrorMsg(error.message || "Error al generar nuevos colores");
    } finally {
      setIsGeneratingColors(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isTimeUp = timeLeft === 0;
  const isTimeRunningOut = timeLeft !== null && timeLeft <= 10 && timeLeft > 0;

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start p-4 md:p-6 font-sans overflow-x-hidden transition-all duration-1000 relative"
      style={mode === 'panic' && panicData?.theme ? {
        color: panicData.theme.textColor
      } : {
        color: '#1e293b'
      }}
    >
      {mode === 'random' && <FloatingBackground variant="light" />}
      {mode === 'panic' && <FloatingBackground variant="panic" customGradient={panicData?.theme?.bgGradient} customIcons={panicData?.backgroundIcons} customColors={panicData?.colors?.map(c => c.hex)} />}
      
      {/* Texture Overlay */}
      {mode === 'panic' && panicData && panicData.ideas[0] && (
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-1000"
          style={{
            backgroundImage: `url(https://image.pollinations.ai/prompt/${encodeURIComponent(enhanceImagePrompt(panicData.ideas[0]?.imagePrompts?.[0] || 'art'))}?width=1920&height=1080&nologo=true&seed=${Math.floor(seed * 1000)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: panicData.theme.textureOpacity,
            filter: 'blur(4px)'
          }}
        />
      )}
      <div className={`w-full text-center space-y-6 relative z-10 transition-all duration-500 ${mode === 'panic' ? 'max-w-4xl' : 'max-w-3xl'}`}>
        
        <AnimatePresence mode="wait">
          {mode === 'random' ? (
            <motion.div 
              key="random"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Header - Styled like the top section of the "After" image */}
              <div className="w-full text-white rounded-[40px] p-10 md:p-14 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden flex flex-col justify-between min-h-[300px] text-left">
                <FloatingBackground isFullScreen={false} variant="dark" />
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2A7D7A]/40 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 z-0" />
                
                <div className="relative z-10 flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-display font-medium text-emerald-50 tracking-wide text-sm">Creatix App</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-5 h-5 text-emerald-200" />
                  </div>
                </div>

                <div className="relative z-10 mt-12">
                  <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-7xl font-display font-bold tracking-tight mb-2"
                  >
                    Creatix
                  </motion.h1>
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-3xl font-display font-semibold text-teal-50 mb-4"
                  >
                    Tu chispa creativa
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-teal-100 text-lg md:text-xl max-w-[350px] font-medium opacity-90 leading-relaxed"
                  >
                    Genera ideas aleatorias o usa el botón de pánico para superar el bloqueo.
                  </motion.p>
                </div>
              </div>

              {/* Challenge Display */}
              <div className="w-full mb-8 text-left">
                <AnimatePresence mode="wait">
                  {challenge ? (
                    <motion.div
                      key={challenge}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 1.05, y: -20 }}
                      transition={{ duration: 0.3, type: 'spring', bounce: 0.2 }}
                      className="relative w-full rounded-[44px] p-[4px] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                    >
                      <div className="absolute inset-0 animate-subtle-gradient-light bg-[length:400%_400%]"></div>
                      <div className="bg-white p-8 md:p-12 rounded-[40px] w-full relative overflow-hidden h-full">
                        <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-[24px] bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <Lightbulb className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-display font-bold text-slate-800">Tu Reto</h3>
                            <span className={`text-sm font-bold uppercase tracking-wider ${
                              difficulty === 'Difícil' 
                                ? 'text-rose-500' 
                                : 'text-emerald-500'
                            }`}>
                              Nivel {difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {isTimeUp ? (
                            <span className="text-rose-500 font-bold text-lg flex items-center gap-2">
                              <AlertCircle className="w-6 h-6" /> Agotado
                            </span>
                          ) : (
                            <span className={`font-mono text-3xl font-bold transition-colors duration-300 ${
                              isTimeRunningOut ? 'text-rose-500 animate-pulse' : 'text-slate-800'
                            }`}>
                              {timeLeft !== null && formatTime(timeLeft)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-3xl md:text-4xl font-display font-bold leading-tight text-slate-800 mb-8">
                        "{challenge}"
                      </p>

                      {quote && (
                        <div className="mb-8 flex items-start gap-3 text-slate-400 bg-slate-50 p-6 rounded-[24px]">
                          <Quote className="w-6 h-6 mt-0.5 shrink-0 opacity-40" />
                          <p className="text-lg font-medium italic">
                            {quote}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={() => setChallenge(null)}
                          className="px-4 py-2 rounded-full font-medium text-slate-400 hover:text-slate-600 transition-colors text-sm"
                        >
                          Limpiar
                        </button>
                        <button
                          onClick={generateChallenge}
                          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-md text-sm"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Generar otro</span>
                        </button>
                      </div>
                      
                      {/* Progress Bar Background */}
                      {!isTimeUp && timeLeft !== null && (
                        <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
                          <motion.div 
                            className={`h-full ${isTimeRunningOut ? 'bg-rose-500' : 'bg-[#1A5D5A]'}`}
                            initial={{ width: '100%' }}
                            animate={{ width: `${(timeLeft / (difficulty === 'Difícil' ? 60 : 30)) * 100}%` }}
                            transition={{ duration: 1, ease: 'linear' }}
                          />
                        </div>
                      )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-full rounded-[44px] p-[4px] overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                    >
                      <div className="absolute inset-0 animate-subtle-gradient-light bg-[length:400%_400%]"></div>
                      <div className="bg-white text-slate-400 text-xl rounded-[40px] p-14 w-full flex flex-col items-center gap-6 text-center relative h-full">
                        <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-300 mb-2">
                          <Timer className="w-10 h-10" />
                        </div>
                        <p className="font-medium">Presiona el botón para obtener tu primer reto</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons - Styled like the categories/services in the "After" image */}
              <div className="w-full mb-10 text-left">
                <div className="flex justify-between items-center mb-6 px-4">
                  <h2 className="text-3xl font-display font-bold text-slate-800">Acciones Rápidas</h2>
                  <span className="text-lg font-display font-bold text-[#1A5D5A] cursor-pointer hover:underline">Ver todo</span>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-6 w-full"
                >
                  <button
                    onClick={generateChallenge}
                    disabled={isGenerating}
                    className="group relative w-full rounded-[36px] p-[4px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all active:scale-[0.98] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] disabled:opacity-50 disabled:active:scale-100 text-white"
                  >
                    <div className="absolute inset-0 animate-subtle-gradient-light bg-[length:400%_400%]"></div>
                    <div className="flex items-center justify-between p-8 bg-green-900 rounded-[32px] relative h-full w-full overflow-hidden">
                      <FloatingBackground isFullScreen={false} variant="dark" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 z-0" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500/50 rounded-full blur-xl translate-y-1/3 -translate-x-1/4 z-0" />
                      
                      <div className="flex items-center gap-6 text-left relative z-10">
                        <div className="w-20 h-20 rounded-[28px] bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                          {isGenerating ? <Loader2 className="w-10 h-10 animate-spin" /> : <Sparkles className="w-10 h-10" />}
                        </div>
                        <div>
                          <h3 className="text-2xl font-display font-bold text-white mb-1">
                            {isGenerating ? 'Generando...' : (challenge ? 'Otro reto' : 'Generar reto')}
                          </h3>
                          <p className="text-lg text-green-50 font-medium opacity-90">
                            Idea aleatoria para dibujar
                          </p>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-green-900 transition-colors shrink-0 relative z-10">
                        <ArrowLeft className="w-7 h-7 rotate-180" />
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setMode('panic')}
                    className="group relative w-full rounded-[36px] p-[4px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all active:scale-[0.98] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-white"
                  >
                    <div className="absolute inset-0 animate-subtle-gradient-panic bg-[length:400%_400%]"></div>
                    <div className="flex items-center justify-between p-8 bg-red-900 rounded-[32px] relative h-full w-full overflow-hidden">
                      <FloatingBackground isFullScreen={false} variant="dark" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 z-0" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/50 rounded-full blur-xl translate-y-1/3 -translate-x-1/4 z-0" />
                      
                      <div className="flex items-center gap-6 text-left relative z-10">
                        <div className="w-20 h-20 rounded-[28px] bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                          <Siren className="w-10 h-10 group-hover:animate-bounce" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-display font-bold text-white mb-1">
                            Botón de pánico
                          </h3>
                          <p className="text-lg text-red-50 font-medium opacity-90">
                            Supera el bloqueo creativo
                          </p>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white group-hover:text-red-900 transition-colors shrink-0 relative z-10">
                        <ArrowLeft className="w-7 h-7 rotate-180" />
                      </div>
                    </div>
                  </button>
                </motion.div>
              </div>

              {/* Inspiration Gallery */}
              <AnimatePresence>
                {challenge && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="overflow-hidden w-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-3xl font-display font-bold text-slate-800">Inspiración Rápida</h2>
                      <button
                        onClick={() => setImageSeedOffset(prev => prev + 100)}
                        className="flex items-center gap-2 text-lg font-display font-semibold text-[#1A5D5A] hover:text-[#2A7D7A] transition-colors"
                      >
                        <RefreshCw className="w-6 h-6" />
                        Cambiar
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map((num, i) => (
                        <motion.div 
                          key={`${seed}-${i}-${imageSeedOffset}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + (i * 0.1) }}
                          className="aspect-[4/3] rounded-[32px] overflow-hidden bg-white shadow-sm border border-slate-100 relative group"
                        >
                          <img
                            src={`https://image.pollinations.ai/prompt/${encodeURIComponent(enhanceImagePrompt(imagePrompt || 'art'))}?width=400&height=300&nologo=true&seed=${Math.floor(seed * 1000) + i + imageSeedOffset}`}
                            alt={`Inspiración ${imagePrompt} ${num}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes('picsum.photos')) {
                                target.src = `https://picsum.photos/seed/${encodeURIComponent((imagePrompt || 'art') + i + imageSeedOffset)}/400/300?blur=2`;
                              }
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              key="panic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Panic Header */}
              <div className="w-full flex items-center justify-between mb-12 relative z-10 px-4">
                <button 
                  onClick={() => setMode('random')}
                  className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-colors"
                  style={{ color: panicData?.theme?.textColor || '#0f172a' }}
                >
                  <ArrowLeft className="w-8 h-8" />
                </button>
                <h2 
                  className="text-3xl md:text-4xl font-display font-bold"
                  style={{ color: panicData?.theme?.textColor || '#0f172a' }}
                >
                  Modo Pánico
                </h2>
                <div 
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
                  style={{ color: panicData?.theme?.textColor || '#0f172a' }}
                >
                  <Siren className="w-8 h-8" />
                </div>
              </div>

              {/* Input Area */}
              <div 
                className="relative rounded-[44px] p-[4px] overflow-hidden shadow-xl mb-10 transition-colors duration-500"
                style={{ 
                  boxShadow: panicData?.theme ? `0 20px 40px -10px ${panicData.colors[0].hex}40` : '0 20px 40px -10px rgba(255,228,230,0.5)'
                }}
              >
                <div 
                  className="absolute inset-0 bg-[length:400%_400%]"
                  style={{
                    background: panicData?.theme?.bgGradient || 'linear-gradient(120deg, #FFE4E6, #F43F5E, #FDA4AF, #BE123C)',
                    animation: 'wave-gradient 8s ease-in-out infinite'
                  }}
                />
                <div 
                  className="p-8 md:p-12 rounded-[40px] relative overflow-hidden text-left h-full"
                  style={{ backgroundColor: panicData?.theme?.cardBg || 'white' }}
                >
                  <label 
                  className="block text-lg md:text-xl font-display font-bold mb-4"
                  style={{ color: panicData?.theme?.cardTextColor || '#334155' }}
                >
                  ¿Qué quieres dibujar?
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="text" 
                    value={panicInput}
                    onChange={(e) => setPanicInput(e.target.value)}
                    placeholder="Ej. Un astronauta tomando café en marte..."
                    className="flex-1 px-6 py-5 border rounded-[24px] focus:outline-none focus:ring-2 transition-all text-lg md:text-xl"
                    style={{ 
                      backgroundColor: panicData?.theme ? 'rgba(255,255,255,0.1)' : '#f8fafc',
                      borderColor: panicData?.theme ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                      color: panicData?.theme?.cardTextColor || '#0f172a'
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handlePanicSubmit()}
                  />
                  <button 
                    onClick={handlePanicSubmit}
                    disabled={isGenerating || !panicInput.trim()}
                    className="flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white text-lg md:text-xl font-display font-bold rounded-[24px] transition-transform active:scale-[0.98] hover:bg-slate-800 disabled:opacity-50 disabled:active:scale-100"
                  >
                    {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                    {isGenerating ? 'Pensando...' : 'Inspirarme'}
                  </button>
                </div>
                {errorMsg && (
                  <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
                    {errorMsg}
                  </div>
                )}
                </div>
              </div>

              {/* Results Area */}
              <AnimatePresence>
                {panicData && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 text-left"
                  >
                    {/* Ideas Sueltas y Referencias */}
                    <div 
                      className="relative rounded-[44px] p-[4px] overflow-hidden shadow-lg mb-10 transition-all duration-500"
                      style={{ 
                        boxShadow: `0 10px 40px -10px ${panicData.colors[0].hex}40`
                      }}
                    >
                      <div 
                        className="absolute inset-0 bg-[length:400%_400%]"
                        style={{
                          background: panicData?.theme?.bgGradient || 'linear-gradient(120deg, #FFE4E6, #F43F5E, #FDA4AF, #BE123C)',
                          animation: 'wave-gradient 8s ease-in-out infinite'
                        }}
                      />
                      <div 
                        className="p-8 md:p-12 rounded-[40px] relative h-full"
                        style={{ backgroundColor: panicData.theme.cardBg }}
                      >
                        <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: panicData.theme.cardTextColor }}>Ideas y Referencias</h2>
                        <button
                          onClick={() => setImageSeedOffset(prev => prev + 100)}
                          className="flex items-center justify-center w-14 h-14 rounded-full transition-all active:scale-95 hover:opacity-80"
                          style={{ backgroundColor: `${panicData.colors[0].hex}22`, color: panicData.colors[0].hex }}
                        >
                          <RefreshCw className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="space-y-12">
                        {panicData.ideas.map((idea, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="space-y-6"
                          >
                            <div className="flex items-start gap-6">
                              <div 
                                className="flex-shrink-0 w-16 h-16 rounded-[20px] flex items-center justify-center text-2xl font-display font-bold text-white shadow-sm"
                                style={{ backgroundColor: panicData.colors[i % panicData.colors.length].hex }}
                              >
                                {i + 1}
                              </div>
                              <div className="pt-2">
                                <span 
                                  className="text-xl md:text-2xl font-display font-bold leading-relaxed block"
                                  style={{ color: panicData.theme.cardTextColor }}
                                >
                                  {idea.text}
                                </span>
                              </div>
                            </div>
                            
                            {/* Imágenes para esta idea */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pl-0 sm:pl-[88px]">
                              {idea.imagePrompts && idea.imagePrompts.map((prompt, j) => (
                                <motion.div 
                                  key={`${seed}-${i}-${j}-${imageSeedOffset}`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + (j * 0.1) }}
                                  className="aspect-[4/3] rounded-[20px] overflow-hidden bg-slate-100 shadow-sm hover:shadow-md transition-shadow relative group"
                                >
                                  <img
                                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(enhanceImagePrompt(prompt))}?width=400&height=300&nologo=true&seed=${Math.floor(seed * 1000) + i * 10 + j + imageSeedOffset}`}
                                    alt={`Referencia ${j + 1} para idea ${i + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      const target = e.currentTarget;
                                      if (!target.src.includes('picsum.photos')) {
                                        target.src = `https://picsum.photos/seed/${encodeURIComponent(prompt + i + j + imageSeedOffset)}/400/300?blur=2`;
                                      }
                                    }}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      </div>
                    </div>

                    {/* Paleta de Colores */}
                    <div 
                      className="relative rounded-[44px] p-[4px] overflow-hidden shadow-lg transition-all duration-500"
                      style={{ 
                        boxShadow: `0 10px 40px -10px ${panicData.colors[0].hex}40` 
                      }}
                    >
                      <div 
                        className="absolute inset-0 bg-[length:400%_400%]"
                        style={{
                          background: panicData?.theme?.bgGradient || 'linear-gradient(120deg, #FFE4E6, #F43F5E, #FDA4AF, #BE123C)',
                          animation: 'wave-gradient 8s ease-in-out infinite'
                        }}
                      />
                      <div 
                        className="p-8 md:p-12 rounded-[40px] relative h-full"
                        style={{ backgroundColor: panicData.theme.cardBg }}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4" style={{ color: panicData.colors[0].hex }}>
                          <Palette className="w-10 h-10" />
                          <h2 className="text-3xl md:text-4xl font-display font-bold" style={{ color: panicData.theme.cardTextColor }}>Paleta de Colores Sugerida</h2>
                        </div>
                        <button
                          onClick={handleRegenerateColors}
                          disabled={isGeneratingColors}
                          className="flex items-center gap-3 px-6 py-3 text-lg font-display font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 hover:opacity-80"
                          style={{ backgroundColor: `${panicData.colors[1].hex}22`, color: panicData.colors[1].hex }}
                        >
                          <RefreshCw className={`w-5 h-5 ${isGeneratingColors ? 'animate-spin' : ''}`} />
                          {isGeneratingColors ? 'Generando...' : 'Cambiar colores'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                        {panicData.colors.map((color, i) => (
                          <motion.div
                            key={`${color.hex}-${i}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex flex-col items-center text-center group"
                          >
                            <div 
                              className="w-24 h-24 rounded-full shadow-lg mb-4 border-4 border-white group-hover:scale-110 transition-transform"
                              style={{ backgroundColor: color.hex, boxShadow: `0 8px 24px 0 ${color.hex}60` }}
                            />
                            <span className="font-display font-bold text-lg md:text-xl mb-1" style={{ color: panicData.theme.cardTextColor }}>{color.name}</span>
                            <span className="text-sm font-mono mb-3" style={{ color: panicData.theme.cardTextColor, opacity: 0.7 }}>{color.hex}</span>
                            <span className="text-sm md:text-base leading-relaxed" style={{ color: panicData.theme.cardTextColor, opacity: 0.8 }}>{color.reason}</span>
                          </motion.div>
                        ))}
                      </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
