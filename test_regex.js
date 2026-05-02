const fs = require('fs');

function motionizeModals(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Let's create an item variant if it doesn't exist
  const itemVar = `
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.5, damping: 15, stiffness: 150 } }
};
`;

  if (!content.includes('const itemVariants')) {
    content = content.replace(/(export const \w+Modal[^=]*= [^{]*\{[^\n]*\n)/, '$1' + itemVar);
  }

  // To make `itemVariants` work, the parent needs `staggerChildren`
  // The easiest is to find the main container inside the modal and make it a motion.div
  // Wait, both modals already have `<motion.div initial=... className="absolute inset-0 ...">` as the wrapper.
  // We can just add `variants={containerVariants} initial="hidden" animate="visible" exit="hidden"` to a child div.
  
  // Actually, wait, replacing <p with <motion.p variants={itemVariants} is easy.
  content = content.replace(/<h2 /g, '<motion.h2 variants={itemVariants} ');
  content = content.replace(/<\/h2>/g, '</motion.h2>');

  content = content.replace(/<h3 /g, '<motion.h3 variants={itemVariants} ');
  content = content.replace(/<\/h3>/g, '</motion.h3>');

  content = content.replace(/<p /g, '<motion.p variants={itemVariants} ');
  content = content.replace(/<\/p>/g, '</motion.p>');

  content = content.replace(/<li /g, '<motion.li variants={itemVariants} ');
  content = content.replace(/<\/li>/g, '</motion.li>');

  // The wrapper needs `initial="hidden" animate="visible"` 
  // and `transition={{ staggerChildren: 0.1 }}`
  // In HelpModal:
  content = content.replace(/<div className="bg-\[#13111C\][^"]+">/, 
    '$&\n          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.05 }}>');
  // Need to close this extra motion.div before the end.
  // It's safer to just add the transition to the main wrapper instead of adding an extra div.

  fs.writeFileSync(file, content);
}

// Better: Let's do a more precise replacement script
