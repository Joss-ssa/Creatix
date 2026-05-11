import { motion } from 'motion/react';
import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ReflectionsModalProps {
  onClose: () => void;
  onSaveReflections: (reflection: { report: string, answers: Record<string, string>, timestamp: number }) => void;
}


const itemV: any = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100 } }
};
const listV: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
};

export const ReflectionsModal: React.FC<ReflectionsModalProps> = ({ onClose, onSaveReflections }) => {

const modalV: any = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.05, staggerDirection: -1 } }
};
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
      // Generate the report summary locally without using an AI API
      const { q1, q2, q3, q4, q5 } = answers;
      
      const activeAnswers = [];
      if (q1.trim()) activeAnswers.push(`mencionaste enfocarte en "${q1.trim()}"`);
      if (q2.trim()) activeAnswers.push(`observaste "${q2.trim()}"`);
      
      let intro = "Al reflexionar sobre esta fase, ";
      if (activeAnswers.length > 0) {
          intro += `${activeAnswers.join(' y ')}. `;
      } else {
          intro = "En tu recorrido por esta fase silenciosa, ";
      }
      
      let emotional = q3.trim() ? `Tu paisaje emocional estuvo marcado por sensaciones de "${q3.trim()}". ` : "";
      let memory = q4.trim() ? `Esto evocó en ti conexiones con "${q4.trim()}". ` : "";
      let ideas = q5.trim() ? `Toda esta vivencia estimuló tu imaginación, resultando en ideas como "${q5.trim()}". ` : "";
      
      let finalReport = intro + emotional + memory + ideas;
      if (finalReport.trim() !== "En tu recorrido por esta fase silenciosa, ") {
          finalReport += "Todo esto conforma el inicio de una valiosa narrativa personal de redescubrimiento. ¡Sigue explorando tu creatividad!";
      } else {
          finalReport = "Gracias por este momento reflexivo. A veces el solo hecho de pausar ayuda a asimilar la experiencia. ¡Sigue adelante con tu viaje creativo!";
      }

      // Simulate a brief processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setReport(finalReport);
      onSaveReflections({
        report: finalReport,
        answers: { ...answers },
        timestamp: Date.now()
      });
    } catch (error) {
      console.error("Error generating report:", error);
      setReport("Gracias por compartir tus reflexiones. Ha habido un pequeño error, pero tus pensamientos son muy valiosos. ¡Sigue adelante!");
    } finally {
      setIsLoading(false);
    }
  };

  if (report) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} transition={{ type: "spring", bounce: 0, damping: 20, stiffness: 100 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
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
            <motion.h2 variants={itemV} className="text-xl sm:text-2xl font-bold font-sans text-[#FF4D79] m-0 leading-none tracking-wide text-center uppercase">
              Análisis de la Información
            </motion.h2>
          </div>

          <div className="w-full flex-1 relative flex flex-col items-center justify-center min-h-[200px] mb-12 px-6 sm:px-12">
            {/* Top Left Quote Icon */}
            <div className="absolute top-0 left-0 text-6xl font-serif text-[#2CD4CE] leading-none select-none opacity-80 mix-blend-screen drop-shadow-[0_0_10px_rgba(44,212,206,0.5)]">
              “
            </div>
            
            <motion.div variants={itemV} className="z-10 py-6 px-6 sm:px-10 mx-auto w-[85%] max-h-[40vh] overflow-y-auto custom-scrollbar">
              <p className="text-base sm:text-lg font-medium font-sans text-[#E2E2ED] leading-relaxed text-center">
                {report}
              </p>
            </motion.div>
            
            {/* Bottom Right Quote Icon */}
            <div className="absolute bottom-0 right-0 text-6xl font-serif text-[#2CD4CE] leading-none select-none opacity-80 mix-blend-screen drop-shadow-[0_0_10px_rgba(44,212,206,0.5)]">
              ”
            </div>
          </div>

          {/* Bottom Button */}
          <motion.button variants={itemV}
            onClick={onClose}
            className="w-full sm:w-auto px-12 py-4 rounded-full border border-[#FF4D79] bg-transparent text-[#FF4D79] hover:bg-[#FF4D79] hover:text-[#13111C] font-bold text-sm tracking-[0.25em] transition-all duration-300 shadow-[0_0_20px_rgba(255,77,121,0.1)] hover:shadow-[0_0_30px_rgba(255,77,121,0.4)] active:scale-95 uppercase"
          >
            Continuar mi viaje
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} transition={{ type: "spring", bounce: 0, damping: 20, stiffness: 100 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-[#191522] border-2 border-[#FF9CB1] rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-[0_0_40px_rgba(255,156,177,0.4)] text-[#FFE5EC] relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-[#FF9CB1] hover:text-white transition-colors p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.h2 variants={itemV} className="text-2xl sm:text-3xl font-extrabold text-[#FF9CB1] mb-6 font-serif text-center">Pensamientos y Reflexiones</motion.h2>

        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <motion.label variants={itemV} className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué hiciste?</motion.label>
            <motion.textarea variants={itemV} 
              value={answers.q1}
              onChange={e => setAnswers({...answers, q1: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <motion.label variants={itemV} className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué viste?</motion.label>
            <motion.textarea variants={itemV} 
              value={answers.q2}
              onChange={e => setAnswers({...answers, q2: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <motion.label variants={itemV} className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué sentiste?</motion.label>
            <motion.textarea variants={itemV} 
              value={answers.q3}
              onChange={e => setAnswers({...answers, q3: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <motion.label variants={itemV} className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Te recuerda algo?</motion.label>
            <motion.textarea variants={itemV} 
              value={answers.q4}
              onChange={e => setAnswers({...answers, q4: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <motion.label variants={itemV} className="block text-base sm:text-lg font-medium text-[#FFB3C6]">¿Qué ideas tuviste?</motion.label>
            <motion.textarea variants={itemV} 
              value={answers.q5}
              onChange={e => setAnswers({...answers, q5: e.target.value})}
              className="w-full bg-[#2A1629] border border-[#3D1C34] rounded-lg p-3 text-white focus:outline-none focus:border-[#FF9CB1] resize-none h-20 sm:h-24 text-sm sm:text-base"
              placeholder="Escribe aquí..."
            />
          </div>

          <motion.button variants={itemV}
            onClick={handleSubmit}
            disabled={isLoading || !Object.values(answers).some(a => a.length > 0)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFB3C6] to-[#FF9CB1] text-[#2A1629] font-extrabold text-lg hover:from-[#FF9CB1] hover:to-[#FFE5EC] transition-all shadow-[0_0_20px_rgba(255,156,177,0.5)] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-wider"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            Enviar Reflexiones
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
