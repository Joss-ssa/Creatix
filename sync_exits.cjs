const fs = require('fs');

function syncExitWithInitial(file) {
  let content = fs.readFileSync(file, 'utf8');

  // App.tsx popups
  content = content.replace(/exit=\{\{ opacity: 0, scale: 0\.8, y: -100, filter: 'blur\(10px\)' \}\}/g, 
    "exit={{ opacity: 0, scale: 0.3, y: 40, filter: 'blur(5px)' }}");

  fs.writeFileSync(file, content);
}

syncExitWithInitial('src/App.tsx');
console.log('SYNCED EXITS APP');
