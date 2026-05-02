const fs = require('fs');

function updateSuperMotion(file) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. App.tsx direct inline styles
  content = content.replace(/initial=\{\{ opacity: 0, y: 30, scale: 0\.95 \}\}/g, 'initial={{ opacity: 0, y: 80, scale: 0.8 }}');
  content = content.replace(/animate=\{\{ opacity: 1, y: 0, scale: 1 \}\}/g, 'animate={{ opacity: 1, y: 0, scale: 1 }}');
  content = content.replace(/transition=\{\{ type: "spring", bounce: 0\.6, damping: 15, stiffness: 200 \}\}/g, 'transition={{ type: "spring", bounce: 0.7, damping: 10, stiffness: 250 }}');

  // 2. Base popups in App.tsx
  content = content.replace(/initial=\{\{ opacity: 0, scale: 0\.95, y: 30, filter: 'blur\(8px\)' \}\}/g, "initial={{ opacity: 0, scale: 0.7, y: 100, filter: 'blur(10px)' }}");
  content = content.replace(/exit=\{\{ opacity: 0, scale: 0\.95, y: -30, filter: 'blur\(8px\)' \}\}/g, "exit={{ opacity: 0, scale: 0.8, y: -100, filter: 'blur(10px)' }}");
  
  // App.tsx Spring configs for popups
  content = content.replace(/transition=\{\{ type: "spring", bounce: 0\.6, damping: 12, stiffness: 150, mass: 1 \}\}/g, 'transition={{ type: "spring", bounce: 0.7, damping: 10, stiffness: 200, mass: 1 }}');
  
  // 3. Sidebars in App.tsx
  content = content.replace(/initial=\{\{ x: -100, opacity: 0 \}\}/g, 'initial={{ x: -200, opacity: 0, scale: 0.9 }}');
  content = content.replace(/exit=\{\{ x: -100, opacity: 0 \}\}/g, 'exit={{ x: -200, opacity: 0, scale: 0.9 }}');
  content = content.replace(/animate=\{\{ x: 0, opacity: 1 \}\}/g, 'animate={{ x: 0, opacity: 1, scale: 1 }}');
  
  // 4. Modals - itemV variable
  content = content.replace(/hidden: \{ opacity: 0, y: 30, scale: 0\.95 \}/g, 'hidden: { opacity: 0, y: 50, scale: 0.7, rotateX: 10 }');
  content = content.replace(/visible: \{ opacity: 1, y: 0, scale: 1, transition: \{ type: "spring", bounce: 0\.6, damping: 15, stiffness: 200 \} \}/g, 'visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: "spring", bounce: 0.7, damping: 10, stiffness: 250 } }');
  
  // 5. HelpModal & ReflectionsModal backgrounds
  content = content.replace(/initial=\{\{ opacity: 0, scale: 0\.95 \}\}/g, 'initial={{ opacity: 0, scale: 0.7, y: 50 }}');
  content = content.replace(/exit=\{\{ opacity: 0, scale: 0\.95 \}\}/g, 'exit={{ opacity: 0, scale: 0.8, y: 50 }}');
  content = content.replace(/transition=\{\{ type: "spring", bounce: 0\.5, damping: 15, stiffness: 150 \}\}/g, 'transition={{ type: "spring", bounce: 0.7, damping: 12, stiffness: 200 }}');

  fs.writeFileSync(file, content);
}

updateSuperMotion('src/App.tsx');
updateSuperMotion('src/components/HelpModal.tsx');
updateSuperMotion('src/components/ReflectionsModal.tsx');
console.log('Added super motion!');
