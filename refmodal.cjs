const fs = require('fs');

let r = fs.readFileSync('src/components/ReflectionsModal.tsx', 'utf8');

if (!r.includes('import { motion }')) {
  r = r.replace(/import React/, "import { motion } from 'motion/react';\nimport React");
}

r = r.replace(/<div className="absolute inset-0 z-50 flex items-center justify-center bg-black\/80 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-500">/,
  '<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">');
  
r = r.replace(/<\/div>\n      <\/div>\n    \);\n  \}/, '</div>\n      </motion.div>\n    );\n  }');


r = r.replace(/<div className="absolute inset-0 z-50 flex items-center justify-center bg-black\/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-300">/,
  '<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">');

r = r.replace(/<\/div>\n    <\/div>\n  \);\n\};/, '</div>\n    </motion.div>\n  );\n};');

fs.writeFileSync('src/components/ReflectionsModal.tsx', r);
console.log('Done modifying ReflectionsModal');
