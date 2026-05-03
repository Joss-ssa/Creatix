const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

// Replace the 5. Fog Overlay gradient section
const targetOverlay = `      // 5. Fog Overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isClaridad) {
        // Light atmospheric haze for bright sunny day
        gradient.addColorStop(0, fogColor + '0.0)');
        gradient.addColorStop(0.8, fogColor + '0.0)');
        gradient.addColorStop(1, fogColor + '0.05)');
      } else if (isExploration) {
        // No fog in Phase 2
        gradient.addColorStop(0, fogColor + '0.0)');
        gradient.addColorStop(1, fogColor + '0.0)');
      } else {
        gradient.addColorStop(0, fogColor + '0.6)');
        gradient.addColorStop(0.5, fogColor + '0.3)');
        gradient.addColorStop(0.8, fogColor + '0.1)');
        gradient.addColorStop(1, fogColor + '0.5)'); // Thicker fog at the very bottom (ground mist)
      }`;

const newOverlay = `      // 5. Fog Overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      const horizonRatio = Math.max(0, Math.min(1, (horizonY) / canvas.height));
      
      if (isClaridad) {
        // Bright haze
        gradient.addColorStop(0, fogColor + '0.1)');
        gradient.addColorStop(horizonRatio, fogColor + '0.6)');
        gradient.addColorStop(1, fogColor + '0.1)');
      } else if (isExploration) {
        // Mystical purple haze
        gradient.addColorStop(0, fogColor + '0.2)');
        gradient.addColorStop(horizonRatio, fogColor + '0.7)');
        gradient.addColorStop(1, fogColor + '0.1)');
      } else {
        // Thick dense fog
        gradient.addColorStop(0, fogColor + '0.5)');
        gradient.addColorStop(horizonRatio, fogColor + '0.9)');
        gradient.addColorStop(1, fogColor + '0.4)');
      }`;

s = s.replace(targetOverlay, newOverlay);

fs.writeFileSync('src/components/Game2D.tsx', s);
