const fs = require('fs');

function addExitToTypo(file) {
  let content = fs.readFileSync(file, 'utf8');

  // We find elements with initial={{ opacity: 0, y: 20, scale: 0.95 }}
  // and we make sure they also have exit={{ opacity: 0, y: 20, scale: 0.95 }}
  
  content = content.replace(/animate=\{\{\s*opacity: 1,\s*y: 0,\s*scale: 1\s*\}\}\s*transition=\{\{/g,
    'animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{');

  fs.writeFileSync(file, content);
}

addExitToTypo('src/App.tsx');
addExitToTypo('src/components/HelpModal.tsx');
addExitToTypo('src/components/ReflectionsModal.tsx');
console.log('EXIT ADDED');
