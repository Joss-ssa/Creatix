const fs = require('fs');

let t = fs.readFileSync('src/App.tsx', 'utf8');

// Colors
t = t.replace(/#00E5FF/g, '#00E676');
t = t.replace(/#84FFFF/g, '#B9F6CA');
t = t.replace(/#18FFFF/g, '#69F0AE');
t = t.replace(/#00BFA5/g, '#00C853');
t = t.replace(/#E0F7FA/g, '#F1F8E9');

// Shadows (RGB)
t = t.replace(/0,229,255/g, '0,230,118');
t = t.replace(/0, 229, 255/g, '0, 230, 118');
t = t.replace(/rgba\(0,\s*229,\s*255/g, 'rgba(0, 230, 118');

// Fix missed orange replacing in previous step
t = t.replace(/#FFA200/g, '#00E676');
t = t.replace(/#FFAB00/g, '#00E676');

fs.writeFileSync('src/App.tsx', t);

console.log('App updated.');
