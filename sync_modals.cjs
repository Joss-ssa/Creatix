const fs = require('fs');

function syncExitModals(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Modals have: exit={{ opacity: 0, scale: 0.8, y: 50 }}
  // We want to make it: exit={{ opacity: 0, scale: 0.95, y: 40 }}
  content = content.replace(/exit=\{\{\s*opacity: 0,\s*scale: 0\.8,\s*y: 50\s*\}\}/g,
    "exit={{ opacity: 0, scale: 0.95, y: 40 }}");

  fs.writeFileSync(file, content);
}

syncExitModals('src/components/HelpModal.tsx');
syncExitModals('src/components/ReflectionsModal.tsx');
console.log('SYNCED EXITS MODALS');
