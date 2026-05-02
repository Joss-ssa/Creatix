const fs = require('fs');

function megaMotion(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Instead of precise replaces, let's just globally bump up ANY spring config
  // From bounce: 0.7, damping: 10, stiffness: 250
  // To bounce: 0.85, damping: 6, stiffness: 300
  // "Que no sea tan suave" means lower damping, higher stiffness, higher bounce.
  
  content = content.replace(/bounce:\s*0\.[0-9]+/g, 'bounce: 0.85');
  content = content.replace(/damping:\s*[0-9]+/g, 'damping: 6');
  content = content.replace(/stiffness:\s*[0-9]+/g, 'stiffness: 300');

  // Let's enhance the typography animations specifically:
  // initial={{ opacity: 0, y: 80, scale: 0.8 }}
  // -> initial={{ opacity: 0, y: 150, scale: 0.4 }}
  content = content.replace(/y:\s*80,\s*scale:\s*0\.8/g, 'y: 150, scale: 0.4');

  // For popups/modals
  content = content.replace(/y:\s*100,\s*filter:\s*'blur\(10px\)'/g, "y: 250, filter: 'blur(20px)'");
  content = content.replace(/scale:\s*0\.7,\s*y:\s*250/g, "scale: 0.3, y: 250");
  content = content.replace(/scale:\s*0\.7,\s*y:\s*50/g, "scale: 0.3, y: 150"); // For modals background container

  // For sidebars
  content = content.replace(/x:\s*-200,\s*opacity:\s*0,\s*scale:\s*0\.9/g, "x: -300, opacity: 0, scale: 0.5");

  // Let's add motion.textarea to ReflectionsModal
  if (file.includes('ReflectionsModal.tsx')) {
    content = content.replace(/<textarea/g, '<motion.textarea initial={{ opacity: 0, x: -100, scale: 0.5 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.85, damping: 6, stiffness: 300 }}');
    content = content.replace(/<\/textarea>/g, '</motion.textarea>');
  }

  // Add motion.button to HelpModal and ReflectionsModal button (if not already motion)
  if (file.includes('HelpModal.tsx') || file.includes('ReflectionsModal.tsx')) {
    // Some buttons are already motion.button, some aren't.
    // Let's just do a specific replace for the primary buttons
    content = content.replace(/<button([^>]+)Enviar Reflexiones/g, '<motion.button initial={{ opacity: 0, y: 100, scale: 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.85, damping: 6, stiffness: 300 }} $1Enviar Reflexiones');
    content = content.replace(/Enviar Reflexiones\s*<\/button>/g, 'Enviar Reflexiones\n          </motion.button>');
    
    content = content.replace(/<button([^>]+)Continuar mi viaje/g, '<motion.button initial={{ opacity: 0, y: 100, scale: 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.85, damping: 6, stiffness: 300 }} $1Continuar mi viaje');
    content = content.replace(/Continuar mi viaje\s*<\/button>/g, 'Continuar mi viaje\n          </motion.button>');
  }

  // Let's also do motion.div around the Game UI controls in Game2D? 
  // Nah, Game2D is canvas + overlay. We can animate the overlay buttons in App.tsx. The user is talking about standard UI.

  fs.writeFileSync(file, content);
}

megaMotion('src/App.tsx');
megaMotion('src/components/HelpModal.tsx');
megaMotion('src/components/ReflectionsModal.tsx');
console.log('MEGA MOTION APPLIED');
