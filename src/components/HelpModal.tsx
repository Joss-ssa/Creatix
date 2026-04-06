import React, { useState } from 'react';
import { X, Sparkles, Loader2, RefreshCw, Palette, Lightbulb, Box } from 'lucide-react';
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
    palette: string[];
    elements: string[];
  } | null>(null);

  const generateContent = async (type: 'all' | 'ideas' | 'palette' | 'elements') => {
    setLoadingState(prev => ({ ...prev, [type]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let prompt = '';
      if (type === 'all' || type === 'ideas') {
        prompt += `Genera 3 ideas o conceptos creativos y breves basados en esta idea suelta: "${ideaInput}". Devuelve solo las 3 ideas separadas por el símbolo |. `;
      }
      if (type === 'all' || type === 'palette') {
        prompt += `Genera una paleta de 5 colores (solo códigos HEX) inspirada en esta idea: "${ideaInput}". Devuelve solo los 5 códigos HEX separados por el símbolo |. `;
      }
      if (type === 'all' || type === 'elements') {
        prompt += `Genera 3 elementos o cosas random (objetos, texturas, formas) inspirados en esta idea: "${ideaInput}". Devuelve solo los 3 elementos separados por el símbolo |. `;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || '';
      const parts = text.split('|').map(s => s.trim()).filter(s => s.length > 0);

      setResults(prev => {
        const newResults = prev ? { ...prev } : { ideas: [], palette: [], elements: [] };
        
        if (type === 'all') {
          if (parts.length >= 11) {
            newResults.ideas = parts.slice(0, 3);
            newResults.palette = parts.slice(3, 8);
            newResults.elements = parts.slice(8, 11);
          }
        } else if (type === 'ideas') {
          newResults.ideas = parts.slice(0, 3);
        } else if (type === 'palette') {
          newResults.palette = parts.slice(0, 5);
        } else if (type === 'elements') {
          newResults.elements = parts.slice(0, 3);
        }
        
        return newResults;
      });
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setLoadingState(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#2A1408] border-2 border-[#FFD700] rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(255,215,0,0.4)] text-[#FFF8DC] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#FFD700] hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-extrabold text-[#FFD700] mb-2 font-serif flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          Rincón de Ayuda Creativa
        </h2>
        <p className="text-[#FDE68A] mb-6">Escribe tus ideas sueltas y deja que la magia te inspire.</p>

        <div className="space-y-6">
          <div className="flex gap-4">
            <textarea 
              value={ideaInput}
              onChange={e => setIdeaInput(e.target.value)}
              className="flex-1 bg-[#1A0C05] border border-[#B8860B] rounded-lg p-4 text-white focus:outline-none focus:border-[#FFD700] resize-none h-24"
              placeholder="Ej: Un bosque flotante con relojes derretidos..."
            />
            <button
              onClick={() => generateContent('all')}
              disabled={loadingState.all || !ideaInput}
              className="px-6 py-4 rounded-xl bg-gradient-to-br from-[#B8860B] to-[#FFD700] text-[#2A1408] font-bold hover:from-[#FFD700] hover:to-[#FFF8DC] transition-all shadow-[0_0_15px_rgba(255,215,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 min-w-[120px]"
            >
              {loadingState.all ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /> Inspirar</>}
            </button>
          </div>

          {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Ideas */}
              <div className="bg-[#1A0C05] border border-[#FFD700]/30 rounded-xl p-5 relative">
                <button onClick={() => generateContent('ideas')} disabled={loadingState.all || loadingState.ideas} className="absolute top-3 right-3 text-[#B8860B] hover:text-[#FFD700] transition-colors disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${loadingState.ideas ? 'animate-spin' : ''}`} />
                </button>
                <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Ideas / Conceptos</h3>
                <ul className="space-y-3 text-sm">
                  {results.ideas.map((idea, i) => (
                    <li key={i} className="flex gap-2"><span className="text-[#B8860B]">•</span> {idea}</li>
                  ))}
                </ul>
              </div>

              {/* Palette */}
              <div className="bg-[#1A0C05] border border-[#FFD700]/30 rounded-xl p-5 relative">
                <button onClick={() => generateContent('palette')} disabled={loadingState.all || loadingState.palette} className="absolute top-3 right-3 text-[#B8860B] hover:text-[#FFD700] transition-colors disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${loadingState.palette ? 'animate-spin' : ''}`} />
                </button>
                <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Paleta de Colores</h3>
                <div className="flex flex-col gap-2">
                  {results.palette.map((color, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: color.startsWith('#') ? color : `#${color}` }}></div>
                      <span className="text-sm font-mono uppercase">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Elements */}
              <div className="bg-[#1A0C05] border border-[#FFD700]/30 rounded-xl p-5 relative">
                <button onClick={() => generateContent('elements')} disabled={loadingState.all || loadingState.elements} className="absolute top-3 right-3 text-[#B8860B] hover:text-[#FFD700] transition-colors disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${loadingState.elements ? 'animate-spin' : ''}`} />
                </button>
                <h3 className="text-[#FFD700] font-bold mb-4 flex items-center gap-2"><Box className="w-5 h-5" /> Elementos Random</h3>
                <ul className="space-y-3 text-sm">
                  {results.elements.map((el, i) => (
                    <li key={i} className="flex gap-2"><span className="text-[#B8860B]">•</span> {el}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
