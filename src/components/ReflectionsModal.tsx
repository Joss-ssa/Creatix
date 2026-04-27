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

  if (report) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-500">
        {/* Modal Container: Image 2 Structure with Image 1 Colors/Aesthetics */}
        <div className="bg-[#13111C] border border-white/10 rounded-[40px] p-8 sm:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col items-center relative shadow-[0_0_60px_rgba(255,77,121,0.1)]">
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-[#FF4D79] hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Top Pill Title */}
          <div className="border border-[#FF4D79] rounded-full px-8 py-3 mb-10 shadow-[0_0_20px_rgba(255,77,121,0.2)] bg-[#FF4D79]/5">
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#FF4D79] m-0 leading-none tracking-wide text-center uppercase">
              Análisis de la Información
            </h2>
          </div>

          <div className="w-full flex-1 relative flex flex-col items-center justify-center min-h-[200px] mb-12 px-6 sm:px-12">
            {/* Top Left Quote Icon */}
            <div className="absolute top-0 left-0 text-6xl font-serif text-[#2CD4CE] leading-none select-none opacity-80 mix-blend-screen drop-shadow-[0_0_10px_rgba(44,212,206,0.5)]">
              “
            </div>
            
            <p className="text-lg sm:text-xl font-medium font-sans text-[#E2E2ED] leading-relaxed text-center z-10 pt-6 pb-6 w-full">
              {report}
            </p>
            
            {/* Bottom Right Quote Icon */}
            <div className="absolute bottom-0 right-0 text-6xl font-serif text-[#2CD4CE] leading-none select-none opacity-80 mix-blend-screen drop-shadow-[0_0_10px_rgba(44,212,206,0.5)]">
              ”
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-12 py-4 rounded-full border border-[#FF4D79] bg-transparent text-[#FF4D79] hover:bg-[#FF4D79] hover:text-[#13111C] font-bold text-sm tracking-[0.25em] transition-all duration-300 shadow-[0_0_20px_rgba(255,77,121,0.1)] hover:shadow-[0_0_30px_rgba(255,77,121,0.4)] active:scale-95 uppercase"
          >
            Continuar mi viaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-[#191522] border-2 border-[#FF9CB1] rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-[0_0_40px_rgba(255,156,177,0.4)] text-[#FFE5EC] relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-[#FF9CB1] hover:text-white transition-colors p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FF9CB1] mb-6 font-serif text-center">Pensamientos y Reflexiones</h2>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué hiciste?</label>
            <textarea 
              value={answers.q1}
              onChange={e => setAnswers({...answers, q1: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué viste?</label>
            <textarea 
              value={answers.q2}
              onChange={e => setAnswers({...answers, q2: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué sentiste?</label>
            <textarea 
              value={answers.q3}
              onChange={e => setAnswers({...answers, q3: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Te recuerda algo?</label>
            <textarea 
              value={answers.q4}
              onChange={e => setAnswers({...answers, q4: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <label className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué ideas tuviste?</label>
            <textarea 
              value={answers.q5}
              onChange={e => setAnswers({...answers, q5: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !Object.values(answers).some(a => a.length > 0)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFB3C6] to-[#FF9CB1] text-[#2A1629] font-extrabold text-lg hover:from-[#FF9CB1] hover:to-[#FFE5EC] transition-all shadow-[0_0_20px_rgba(255,156,177,0.5)] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            Enviar Reflexiones
          </button>
        </div>
      </div>
    </div>
  );
};
