import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ReflectionsModalProps {
  onClose: () => void;
}

export const ReflectionsModal: React.FC<ReflectionsModalProps> = ({ onClose }) => {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
Eres un guía amigable, cercano y empático en un viaje de descubrimiento personal y creativo.
El jugador acaba de terminar una fase de exploración y ha respondido a 5 preguntas sobre su experiencia.
Por favor, lee sus respuestas y escribe un breve reporte o reflexión final (unas 3-4 oraciones) que lo haga sentir escuchado, validado y motivado para continuar. Usa un tono cálido y amistoso.

Sus respuestas:
1. ¿Qué hiciste? ${answers.q1}
2. ¿Qué viste? ${answers.q2}
3. ¿Qué sentiste? ${answers.q3}
4. ¿Te recuerda algo? ${answers.q4}
5. ¿Qué ideas tuviste... o generaste? ${answers.q5}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReport(response.text || "Gracias por compartir tus reflexiones. ¡Sigue adelante con esa misma energía!");
    } catch (error) {
      console.error("Error generating report:", error);
      setReport("Gracias por compartir tus reflexiones. Ha habido un pequeño error al generar tu reporte, pero tus pensamientos son muy valiosos. ¡Sigue adelante!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-[#2A1408] border-2 border-[#FFD700] rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-[0_0_40px_rgba(255,215,0,0.4)] text-[#FFF8DC] relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-[#FFD700] hover:text-white transition-colors p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFD700] mb-6 font-serif text-center">Pensamientos y Reflexiones</h2>

        {!report ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-base sm:text-lg font-medium text-[#FDE68A]">¿Qué hiciste?</label>
              <textarea 
                value={answers.q1}
                onChange={e => setAnswers({...answers, q1: e.target.value})}
                className="w-full bg-[#1A0C05] border border-[#B8860B] rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] resize-none h-20 sm:h-24 text-sm sm:text-base"
                placeholder="Escribe aquí..."
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-base sm:text-lg font-medium text-[#FDE68A]">¿Qué viste?</label>
              <textarea 
                value={answers.q2}
                onChange={e => setAnswers({...answers, q2: e.target.value})}
                className="w-full bg-[#1A0C05] border border-[#B8860B] rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] resize-none h-20 sm:h-24 text-sm sm:text-base"
                placeholder="Escribe aquí..."
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-base sm:text-lg font-medium text-[#FDE68A]">¿Qué sentiste?</label>
              <textarea 
                value={answers.q3}
                onChange={e => setAnswers({...answers, q3: e.target.value})}
                className="w-full bg-[#1A0C05] border border-[#B8860B] rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] resize-none h-20 sm:h-24 text-sm sm:text-base"
                placeholder="Escribe aquí..."
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-base sm:text-lg font-medium text-[#FDE68A]">¿Te recuerda algo?</label>
              <textarea 
                value={answers.q4}
                onChange={e => setAnswers({...answers, q4: e.target.value})}
                className="w-full bg-[#1A0C05] border border-[#B8860B] rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] resize-none h-20 sm:h-24 text-sm sm:text-base"
                placeholder="Escribe aquí..."
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <label className="block text-base sm:text-lg font-medium text-[#FDE68A]">¿Qué ideas tuviste?</label>
              <textarea 
                value={answers.q5}
                onChange={e => setAnswers({...answers, q5: e.target.value})}
                className="w-full bg-[#1A0C05] border border-[#B8860B] rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] resize-none h-20 sm:h-24 text-sm sm:text-base"
                placeholder="Escribe aquí..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !Object.values(answers).some(a => a.length > 0)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-extrabold text-lg hover:from-[#FFD700] hover:to-[#FFF8DC] transition-all shadow-[0_0_20px_rgba(255,215,0,0.5)] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-wider"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              Enviar Reflexiones
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 py-8 animate-in fade-in zoom-in duration-500">
            <div className="p-6 bg-[#1A0C05] border-2 border-[#FFD700]/40 rounded-2xl relative">
              <div className="absolute -top-4 -left-4 text-4xl text-[#FFD700]/20 font-serif">“</div>
              <p className="text-xl sm:text-2xl font-serif italic text-[#FDE68A] leading-relaxed text-center">
                {report}
              </p>
              <div className="absolute -bottom-4 -right-4 text-4xl text-[#FFD700]/20 font-serif">”</div>
            </div>
            <button
              onClick={onClose}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] font-bold text-lg hover:scale-105 transition-transform shadow-lg uppercase tracking-widest"
            >
              Continuar mi viaje
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
