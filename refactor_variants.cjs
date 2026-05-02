const fs = require('fs');

function refactorToVariants(file) {
  let content = fs.readFileSync(file, 'utf8');

  const variantDefs = `
const pageV = {
  hidden: { opacity: 0, scale: 0.8, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.08, delayChildren: 0.1 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20, 
    filter: 'blur(5px)',
    transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.05, staggerDirection: -1 }
  }
};

const itemV = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100 } }
};

const sidebarV = {
  hidden: { x: -80, opacity: 0, scale: 0.95 },
  visible: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { x: -80, opacity: 0, scale: 0.95, transition: { type: "spring", bounce: 0, damping: 20, stiffness: 100, staggerChildren: 0.05, staggerDirection: -1 } }
};
`;

  // Insert variants at the top
  if (!content.includes('const pageV = {')) {
    content = content.replace(/export default function App\(\) \{/, variantDefs + '\nexport default function App() {');
  }

  // Replace wrapper states
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*scale: 0\.3,\s*y: 40,\s*filter:\s*'blur\(5px\)'\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*scale: 1,\s*y: 0,\s*filter:\s*'blur\(0px\)'\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*scale: 0\.3,\s*y: 40,\s*filter:\s*'blur\(5px\)'\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={pageV} initial="hidden" animate="visible" exit="exit"');

  // Replace sidebar states
  content = content.replace(/initial=\{\{\s*x: -80,\s*opacity: 0,\s*scale: 0\.9\s*\}\}\s*animate=\{\{\s*x: 0,\s*opacity: 1,\s*scale: 1\s*\}\}\s*exit=\{\{\s*x: -80,\s*opacity: 0,\s*scale: 0\.9\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={sidebarV} initial="hidden" animate="visible" exit="exit"');

  // Replace typography and elements states (which are the itemV now)
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.9\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.9\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');

  // Replace older versions just in case
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.95\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*exit=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.95\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');
    
  // Buttons that didn't have exit
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.95\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 20,\s*scale: 0\.9\s*\}\}\s*animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*transition=\{\{[^}]+\}\}/g,
    'variants={itemV}');

  fs.writeFileSync(file, content);
}

refactorToVariants('src/App.tsx');
console.log('REFACTORED TO VARIANTS');
