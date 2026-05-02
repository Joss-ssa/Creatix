const fs = require('fs');

function wipeInline(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Any inline animation that has `transition={{ type: "spring", bounce: 0, damping: 20, stiffness: 100 ...`
  // We can just wipe it if it's on a typical element like h2, p, button.
  
  content = content.replace(/initial=\{\{[^}]*\}\}\s*animate=\{\{[^}]*\}\}\s*(?:exit=\{\{[^}]*\}\}\s*)?transition=\{\{[^}]*\}\}/g, 'variants={itemV}');

  fs.writeFileSync(file, content);
}

wipeInline('src/App.tsx');
console.log('WIPED INLINES IN APP.TSX');
