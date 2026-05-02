const fs = require('fs');

function addMotion(file) {
  let f = fs.readFileSync(file, 'utf8');
  if (!f.includes('import { motion }')) {
    f = f.replace(/import React/, "import { motion } from 'motion/react';\nimport React");
  }
  
  f = f.replace(/<div className="absolute inset-0 z-50 flex items-center justify-center bg-black\/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">/,
    '<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">');
    
  f = f.replace(/<\/div>\n    <\/div>\n  \);\n\};/, '</div>\n    </motion.div>\n  );\n};');
  
  f = f.replace(/<div className="absolute inset-0 z-50 flex items-center justify-center bg-\[#0B0E0D\]\/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-500">/,
    '<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay, #0B0E0D)]/90 backdrop-blur-md p-4 sm:p-6 text-white">');
  
  // Wait there is another return for the report:
  f = f.replace(/<div className="absolute inset-0 z-50 flex items-center justify-center bg-\[#13111C\]\/95 backdrop-blur-md p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-500">/,
    '<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-50 flex items-center justify-center bg-[#13111C]/95 backdrop-blur-md p-4 sm:p-8">');
    
  f = f.replace(/<\/div>\n      <\/div>\n    \);\n  \}/, '</div>\n      </motion.div>\n    );\n  }');
  
  fs.writeFileSync(file, f);
}

addMotion('src/components/ReflectionsModal.tsx');
