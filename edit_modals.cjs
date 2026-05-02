const fs = require('fs');

function addMotion(file, bgColor) {
  let f = fs.readFileSync(file, 'utf8');
  if (!f.includes('import { motion }')) {
    f = f.replace(/import React/, "import { motion } from 'motion/react';\nimport React");
  }
  
  if (file.includes('HelpModal')) {
    f = f.replace(/<div className="absolute inset-0 z-50 flex flex-row bg-black\/70 backdrop-blur-md overflow-hidden">/,
      '<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-50 flex flex-row bg-black/70 backdrop-blur-md overflow-hidden">');
    f = f.replace(/<\/div>\n    <\/div>\n  \);\n\}/, '</div>\n    </motion.div>\n  );\n}');
  } else if (file.includes('ReflectionsModal')) {
    // Let's check structure first!
    f = f.replace(/<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black\/70 backdrop-blur-sm"/,
      '<motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"');
    // I need to be careful with closing tag. 
  }
  
  fs.writeFileSync(file, f);
}

addMotion('src/components/HelpModal.tsx');
// I will check ReflectionsModal manually.
