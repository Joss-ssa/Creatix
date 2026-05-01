const fs = require('fs');

let f = fs.readFileSync('src/components/HelpModal.tsx', 'utf8');

f = f.replace(/#FFA800/g, '#00E676');
f = f.replace(/#FFB822/g, '#B9F6CA');
f = f.replace(/#3E2900/g, '#004D40');
f = f.replace(/#281E11/g, '#0A191A'); // Bg colors
f = f.replace(/255,168,0/g, '0,230,118');
f = f.replace(/255,\s*168,\s*0/g, '0, 230, 118');
f = f.replace(/#1F180F/g, '#051210');
f = f.replace(/#EAA000/g, '#00C853');
f = f.replace(/#FFECCC/g, '#F1F8E9');
f = f.replace(/#FFF2D9/g, '#F1F8E9');

// Typography
f = f.replace(/ style={{ fontFamily: '"Inter", sans-serif' }}/g, '');
f = f.replace(/ style={{ fontFamily: '"Playfair Display", serif' }}/g, '');

fs.writeFileSync('src/components/HelpModal.tsx', f);
console.log('Fixed HelpModal.tsx');
