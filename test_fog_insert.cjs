const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const pathIndex = s.indexOf('      // 3. Winding Path');
const objectsIndex = s.indexOf('      // 4. Objects & Particles');
const overlayIndex = s.indexOf('      // 5. Fog Overlay');

console.log('Path index:', pathIndex);
console.log('Objects index:', objectsIndex);
console.log('Overlay index:', overlayIndex);
