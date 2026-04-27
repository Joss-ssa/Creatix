import React, { useState } from 'react';
import { X, Sparkles, Loader2, Settings, Lightbulb, Palette, Puzzle, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [ideaInput, setIdeaInput] = useState('');
  const [loadingState, setLoadingState] = useState({
    all: false,
    ideas: false,
    palette: false,
    elements: false
  });
  const [results, setResults] = useState<{
    ideas: string[];
    palette: { hex: string, name: string }[];
    elements: string[];
  }>({
    ideas: [
      "Sinergia entre elementos orgánicos y tecnología antigua.",
      "Contraste de texturas rugosas con luz filtrada.",
      "Patrones fractales inspirados en el crecimiento del musgo."
    ],
    palette: [
      { hex: '#FFC107', name: 'Solar Yellow' },
      { hex: '#8BC34A', name: 'Moss Green' },
      { hex: '#5D5D5D', name: 'Earthy Neutral' },
      { hex: '#33691E', name: 'Deep Canopy' }
    ],
    elements: ["Cristales", "Hojas secas", "Luz difusa", "Ruido blanco", "Bocetos a lápiz"]
  });

  const generateContent = async (type: 'all' | 'ideas' | 'palette' | 'elements' = 'all') => {
    if (!ideaInput) return;
    setLoadingState(prev => ({ ...prev, [type]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let prompt = `Actúa como un asistente creativo. Basado en la idea "${ideaInput}":\nGenera:\n`;
      
      if (type === 'all') {
        prompt += `1. 3 ideas o conceptos creativos (breves).
2. 4 colores para una paleta (HEX y un nombre descriptivo en inglés corto).
3. 5 elementos aleatorios inspirados en la idea (palabras clave cortas).

Usa el siguiente formato exacto, sin markdown ni texto extra, separando las secciones por "|||" y los items por "|":
idea1|idea2|idea3|||#HEX:Nombre|#HEX:Nombre|#HEX:Nombre|#HEX:Nombre|||elemento1|elemento2|elemento3|elemento4|elemento5`;
      } else if (type === 'ideas') {
        prompt += `3 ideas o conceptos creativos (breves).\n\nUsa el siguiente formato exacto, sin markdown ni texto extra, separando los items por "|":\nidea1|idea2|idea3`;
      } else if (type === 'palette') {
        prompt += `4 colores para una paleta (HEX y un nombre descriptivo en inglés corto).\n\nUsa el siguiente formato exacto, sin markdown ni texto extra, separando los items por "|":\n#HEX:Nombre|#HEX:Nombre|#HEX:Nombre|#HEX:Nombre`;
      } else if (type === 'elements') {
        prompt += `5 elementos aleatorios inspirados en la idea (palabras clave cortas).\n\nUsa el siguiente formato exacto, sin markdown ni texto extra, separando los items por "|":\nelemento1|elemento2|elemento3|elemento4|elemento5`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || '';
      
      if (type === 'all') {
        const sections = text.split('|||');
        if (sections.length >= 3) {
          const ideas = sections[0].split('|').map(s => s.trim()).filter(s => s);
          const palette = sections[1].split('|').map(s => {
            const parts = s.split(':');
            return {
              hex: parts[0]?.trim() || '#000000',
              name: parts[1]?.trim() || 'Unknown'
            };
          }).filter(c => c.hex);
          const elements = sections[2].split('|').map(s => s.trim()).filter(s => s);
          setResults({ ideas, palette, elements });
        }
      } else if (type === 'ideas') {
        const ideas = text.split('|').map(s => s.trim()).filter(s => s);
        if (ideas.length > 0) setResults(prev => ({ ...prev, ideas }));
      } else if (type === 'palette') {
        const palette = text.split('|').map(s => {
          const parts = s.split(':');
          return {
            hex: parts[0]?.trim() || '#000000',
            name: parts[1]?.trim() || 'Unknown'
          };
        }).filter(c => c.hex);
        if (palette.length > 0) setResults(prev => ({ ...prev, palette }));
      } else if (type === 'elements') {
        const elements = text.split('|').map(s => s.trim()).filter(s => s);
        if (elements.length > 0) setResults(prev => ({ ...prev, elements }));
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoadingState(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-row bg-black/70 backdrop-blur-md overflow-hidden">
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto w-full">
        <div className="absolute top-6 right-8 z-20 flex gap-6 items-center">
          <button className="text-[#888377] hover:text-[#FFA800] transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="text-[#888377] hover:text-white transition-colors bg-[#2C2A25] p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-w-[1000px] w-full mx-auto pt-20 px-8 pb-16">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-[54px] font-bold text-[#FFECCC] mb-3 tracking-tight drop-shadow-md" style={{ fontFamily: '"Inter", sans-serif' }}>Ayuda Creativa</h1>
            <p className="text-[#A8A397] text-lg font-light tracking-wide">Escribe tus ideas sueltas y deja que la magia te inspire.</p>
          </div>

          {/* Text Input Area */}
          <div className="bg-[#1C1A14]/40 border border-[#4A473D] rounded-2xl p-1 relative mb-10 shadow-lg backdrop-blur-sm">
            <textarea 
              value={ideaInput}
              onChange={e => setIdeaInput(e.target.value)}
              className="w-full bg-transparent p-6 text-[#E2DED5] placeholder:text-[#6a665a] focus:outline-none resize-none h-[180px] text-base font-light rounded-2xl"
              placeholder="Escribe aquí... (ej. Un bosque lluvioso pero con luces de neón amarillas)"
            />
            <div className="absolute bottom-5 right-5">
              <button
                onClick={() => generateContent('all')}
                disabled={loadingState.all || !ideaInput}
                className="px-6 py-3 rounded-full bg-[#FFA800] text-[#3E2900] font-bold hover:bg-[#FFB822] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,168,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingState.all ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="text-sm">Generar Magia</span>
              </button>
            </div>
          </div>
          
          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Ideas / Conceptos */}
            <div className="bg-[#16140F]/60 border border-[#3A3832] rounded-xl p-6 backdrop-blur-sm shadow-md flex flex-col relative group">
              <div className="flex items-center gap-3 mb-6 pr-8">
                <Lightbulb className="w-5 h-5 text-[#95E052]" />
                <h3 className="text-[#E2DED5] font-medium text-lg tracking-wide">Ideas / Conceptos</h3>
              </div>
              <button 
                onClick={() => generateContent('ideas')} 
                disabled={loadingState.all || loadingState.ideas || !ideaInput} 
                className="absolute top-6 right-6 text-[#888377] hover:text-[#95E052] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingState.ideas ? 'animate-spin' : ''}`} />
              </button>
              <div className="space-y-4 flex-1">
                {results.ideas.map((idea, i) => (
                  <div key={i} className="bg-[#1C1A14] border border-[#2C2A25] rounded-md p-4 text-[#A8A397] text-sm font-light leading-relaxed">
                    {idea}
                  </div>
                ))}
              </div>
            </div>

            {/* Paleta de Colores */}
            <div className="bg-[#16140F]/60 border border-[#3A3832] rounded-xl p-6 backdrop-blur-sm shadow-md flex flex-col relative group">
              <div className="flex items-center gap-3 mb-6 pr-8">
                <Palette className="w-5 h-5 text-[#FFA800]" />
                <h3 className="text-[#E2DED5] font-medium text-lg tracking-wide">Paleta de Colores</h3>
              </div>
              <button 
                onClick={() => generateContent('palette')} 
                disabled={loadingState.all || loadingState.palette || !ideaInput} 
                className="absolute top-6 right-6 text-[#888377] hover:text-[#FFA800] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingState.palette ? 'animate-spin' : ''}`} />
              </button>
              <div className="space-y-4 flex-1 mt-2">
                {results.palette.map((color, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full shrink-0 shadow-inner" 
                      style={{ backgroundColor: color.hex.startsWith('#') ? color.hex : `#${color.hex}` }}
                    />
                    <span className="text-[#E2DED5] text-sm font-medium tracking-wide">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Elementos Random */}
            <div className="bg-[#16140F]/60 border border-[#3A3832] rounded-xl p-6 backdrop-blur-sm shadow-md flex flex-col relative group">
              <div className="flex items-center gap-3 mb-6 pr-8">
                <Puzzle className="w-5 h-5 text-[#95E052]" />
                <h3 className="text-[#E2DED5] font-medium text-lg tracking-wide">Elementos Random</h3>
              </div>
              <button 
                onClick={() => generateContent('elements')} 
                disabled={loadingState.all || loadingState.elements || !ideaInput} 
                className="absolute top-6 right-6 text-[#888377] hover:text-[#95E052] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingState.elements ? 'animate-spin' : ''}`} />
              </button>
              <div className="flex flex-wrap gap-3">
                {results.elements.map((el, i) => (
                  <span 
                    key={i} 
                    className="bg-[#1C1A14] border border-[#3A3832] text-[#A8A397] text-xs font-medium px-4 py-2 rounded-full"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

