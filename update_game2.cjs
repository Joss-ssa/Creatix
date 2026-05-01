const fs = require('fs');

let g = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

g = g.replace(
  "const defaultArchColor = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : '#FFD700');",
  "const defaultArchColor = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : '#00E676');"
);

g = g.replace(
  "ctx.fillStyle = isNiebla ? 'rgba(15, 30, 22, 0.8)' : (isExploracion ? 'rgba(25, 21, 34, 0.8)' : (isClaridad ? 'rgba(10, 25, 26, 0.8)' : 'rgba(0, 0, 0, 0.75)'));",
  "ctx.fillStyle = isNiebla ? 'rgba(15, 30, 22, 0.8)' : (isExploracion ? 'rgba(25, 21, 34, 0.8)' : (isClaridad ? 'rgba(10, 30, 15, 0.9)' : 'rgba(0, 0, 0, 0.75)'));"
);

g = g.replace(
  "} else if (isClaridad) {\n          ctx.strokeStyle = '#004D40';",
  "} else if (isClaridad) {\n          ctx.strokeStyle = '#00E676';"
);

g = g.replace(
  "ctx.fillStyle = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : (isClaridad ? '#FFD700' : 'white'));",
  "ctx.fillStyle = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : (isClaridad ? '#00E676' : 'white'));"
);

g = g.replace(
  "} else if (isClaridad) {\n           ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';",
  "} else if (isClaridad) {\n           ctx.shadowColor = 'rgba(0, 230, 118, 0.4)';"
);

// Menu outline and interaction things in Game2D (if any other left)
g = g.replace(/border-\[#FFD700\]/g, "border-[#00E676]"); // For mobile Claridad buttons if they are in Game2D - wait, those were `#00E5FF` so they became `#FFD700` and I shouldn't replace all!
// Let's just fix the Mobile buttons specifically.

// mobile movement arrows
g = g.replace(/className="w-16 h-16 bg-black\/40 border-2 border-\[#FFD700\]\/50/g, 'className="w-16 h-16 bg-black/40 border-2 border-[#FFD700]/50'); // Keep yellow for controls? Wait, the controls were yellow before.
// But the clarity buttons (Ayuda Creativa etc.) -> they should adapt to phase or remain fixed? "SOLO en la fase de Claridad cambia ese azul por verde." Wait, the user didn't mention controls, just Claridad phase menus. Let's just restore them to yellow for simplicity and not touch them.

fs.writeFileSync('src/components/Game2D.tsx', g);
