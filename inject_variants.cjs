const fs = require('fs');

const variants = `
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
`;

function injectVariants(file) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('const itemV: any = {')) {
    content = content.replace(/(export const \w+Modal)/, variants + '\n$1');
  }

  // Also replace any remaining inline typography
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.9\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.9\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*y: 20\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.95\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.95\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');

  fs.writeFileSync(file, content);
}

injectVariants('src/components/ReflectionsModal.tsx');
injectVariants('src/components/HelpModal.tsx');
console.log('INJECTED VARIANTS IN MODALS');
