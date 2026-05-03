const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const targetAlpha = `        const fogIntensity = Math.min(1, z / drawDistance);
        ctx.globalAlpha = isClaridad ? 1 - (fogIntensity * 0.1) : (isExploration ? 1 : 1 - (fogIntensity * 0.6)); // Reduced fog intensity`;

const newAlpha = `        const fogIntensity = Math.min(1, z / drawDistance);
        if (obj.type === 'arch' || obj.type === 'particle') {
          ctx.globalAlpha = 1; // path elements remain crystal clear
        } else {
          ctx.globalAlpha = isClaridad ? 1 - (fogIntensity * 0.6) : (isExploration ? 1 - (fogIntensity * 0.7) : 1 - (fogIntensity * 0.9));
        }`;

s = s.replace(targetAlpha, newAlpha);
fs.writeFileSync('src/components/Game2D.tsx', s);
