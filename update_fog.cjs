const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const fogRegex = /\/\/ 5\. Fog Overlay[\s\S]*?(?=\/\/ 5\.5 Vignette)/;
const match = s.match(fogRegex);

if (!match) {
  console.log('Fog overlay not found');
  process.exit(1);
}

let fogCode = match[0];
s = s.replace(fogRegex, ''); // remove from end

// Now find where to insert it (before Winding Path)
const pathRegex = /\/\/ 3\. Winding Path/;
s = s.replace(pathRegex, fogCode + '\n      // 3. Winding Path');

fs.writeFileSync('src/components/Game2D.tsx', s);
