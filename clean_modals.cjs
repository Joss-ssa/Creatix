const fs = require('fs');

function cleanModals(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change modal wrappers
  // Example: initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} transition={{ type: "spring", bounce: 0, damping: 20, stiffness: 100 }}
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*scale: 0\.95,\s*y: 40\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*scale: 1\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*scale: 0\.95,\s*y: 40\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={modalV} initial="hidden" animate="visible" exit="exit"');

  const modalV = `
const modalV = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.05, staggerDirection: -1 } }
};
  `;

  if (!content.includes('const modalV')) {
    content = content.replace(/(export const \w+Modal[^=]*= [^{]*\{[^\n]*\n)/, '$1' + modalV);
  }

  // Update itemV in modals! It was originally added but maybe modified
  content = content.replace(/const itemV = \{[^}]+\}[;]?\s*\};?/g, ''); // Try to erase old itemV
  // Modals already have an itemV and listV added by enrich_modals.cjs
  // We can just replace the whole itemV block
  
  content = content.replace(/const itemV = \{[\s\S]*?\};\s*const listV = \{[\s\S]*?\};/g, `
  const itemV = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100 } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100 } }
  };
  const listV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };
  `);
  
  // Modals had their own buttons getting initial animate
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.95\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.95\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*x: -100,\s*scale: 0\.5\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*x: 0,\s*scale: 1\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');

  fs.writeFileSync(file, content);
}

cleanModals('src/components/HelpModal.tsx');
cleanModals('src/components/ReflectionsModal.tsx');
console.log('CLEANED MODALS');
