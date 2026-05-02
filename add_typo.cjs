const fs = require('fs');

function addMotionToTypography(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Let's create a generic variants object for Typography 
  const variantsStr = `
const typoVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, damping: 15, stiffness: 150 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};
`;

  if (!content.includes('const typoVariants')) {
    content = content.replace(/(export default function App\(\) \{)/, variantsStr + '\n$1');
  }

  // Replace <h1, <h2, <p tags in some parts with motion.h1 etc.
  // Actually, wait, replacing by regex is risky. Let's just find and replace some specific blocks.
  
  // Landing screen title
  content = content.replace(/<h1 className="([^"]+)">\s*El Bosque Creativo\s*<\/h1>/,
      '<motion.h1 variants={typoVariants} initial="hidden" animate="visible" className="$1">\n                  El Bosque Creativo\n                </motion.h1>');
                
  content = content.replace(/<p className="max-w-xl mx-auto text-\[#4ECDC4\]\/80 text-xl md:text-2xl font-medium tracking-wide leading-relaxed mb-12">([^<]+)<\/p>/,
      '<motion.p variants={typoVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="max-w-xl mx-auto text-[#4ECDC4]/80 text-xl md:text-2xl font-medium tracking-wide leading-relaxed mb-12">$1</motion.p>');
      
  content = content.replace(/<button([^>]+)onClick=\{startGame\}([^>]*)>/,
      '<motion.button variants={typoVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} $1 onClick={startGame} $2>');
  // Also need to close it:
  content = content.replace(/Comenzar Aventura\s*<\/button>/, 'Comenzar Aventura\n                </motion.button>');

  // INSTRUCTIONS 1
  content = content.replace(/<h2 className="text-3xl font-bold text-white tracking-\[0.2em\] mb-6">\s*NIEBLA\s*<\/h2>/,
      '<motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.6, damping: 12, stiffness: 150 }} className="text-3xl font-bold text-white tracking-[0.2em] mb-6">NIEBLA</motion.h2>');

  content = content.replace(/<p className="text-\[#8BE8B9\] text-lg mb-10 leading-relaxed font-medium">([^<]+)<\/p>/,
      '<motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.5 }} className="text-[#8BE8B9] text-lg mb-10 leading-relaxed font-medium">$1</motion.p>');

  // INSTRUCTIONS 2
  content = content.replace(/<h2 className="text-\[28px\] font-bold text-\[#FF9CB1\] mb-6 tracking-wide">\s*FASE 2: EXPLORACIÓN\s*<\/h2>/,
      '<motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.6, damping: 12, stiffness: 150 }} className="text-[28px] font-bold text-[#FF9CB1] mb-6 tracking-wide">\n                          FASE 2: EXPLORACIÓN\n                        </motion.h2>');

  content = content.replace(/<p className="text-\[#FFE5EC\]\/90 text-lg mb-10 leading-relaxed max-w-sm font-medium">([^<]+)<\/p>/,
      '<motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: "spring", bounce: 0.5 }} className="text-[#FFE5EC]/90 text-lg mb-10 leading-relaxed max-w-sm font-medium">$1</motion.p>');

  // INSTRUCTIONS 3
  content = content.replace(/<h2 className="text-\[32px\] font-bold text-\[#00E676\] uppercase tracking-wide mb-6">\s*FASE 3: CLARIDAD\s*<\/h2>/,
      '<motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.6, damping: 12, stiffness: 150 }} className="text-[32px] font-bold text-[#00E676] uppercase tracking-wide mb-6">\n                          FASE 3: CLARIDAD\n                        </motion.h2>');

  fs.writeFileSync(file, content);
}

addMotionToTypography('src/App.tsx');
console.log('Done typography App.tsx');
