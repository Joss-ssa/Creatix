const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

// The line 1258 `const isClaridad = stage === 'CLARIDAD';` is in the way.
s = s.replace(/const isClaridad = stage === 'CLARIDAD';/g, '');
s = s.replace(/isConstruction/g, 'isClaridad');
s = s.replace(/stage === 'CONSTRUCCION'/g, "stage === 'CLARIDAD'");

fs.writeFileSync('src/components/Game2D.tsx', s);
console.log('Done Stage replacements!');
