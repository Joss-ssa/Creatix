const fs = require('fs');

let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const vignetteStart = s.indexOf('      // 5.5 Vignette (Shadows to hide map limits beyond the forest)');
const uiLayerStart = s.indexOf('      // 6. On-Screen Indication (Left Panel for Selected Phrases)');

if (vignetteStart !== -1 && uiLayerStart !== -1) {
    const replacement = `      // 5.5 Vignette or Sunbeams
      if (!isClaridad) {
        const vignetteGrad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.height * 0.4,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.8
        );
        vignetteGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vignetteGrad.addColorStop(0.7, 'rgba(0,0,0,0.5)');
        vignetteGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = vignetteGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        // Draw Majestic Sunbeams
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Swaying sunbeams based on time
        const time = Date.now() / 3000;
        const centerX = canvas.width * 0.3;
        const centerY = -canvas.height * 0.2;
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
           const beamAngle = Math.PI / 4 + Math.sin(time + i * 0.5) * 0.1;
           const beamWidth = canvas.width * 0.15 + Math.cos(time + i) * 50;
           
           ctx.moveTo(centerX, centerY);
           
           // Left edge of beam
           const leftAngle = beamAngle - 0.1;
           const rightAngle = beamAngle + 0.1;
           const length = canvas.height * 2;
           
           ctx.lineTo(centerX + Math.cos(leftAngle) * length, centerY + Math.sin(leftAngle) * length);
           ctx.lineTo(centerX + Math.cos(rightAngle) * length, centerY + Math.sin(rightAngle) * length);
           ctx.lineTo(centerX, centerY);
        }
        
        const beamGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvas.height * 1.5);
        beamGrad.addColorStop(0, 'rgba(255, 255, 230, 0.4)');
        beamGrad.addColorStop(0.5, 'rgba(255, 250, 200, 0.15)');
        beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = beamGrad;
        ctx.fill();
        ctx.restore();
      }

`;
    s = s.substring(0, vignetteStart) + replacement + s.substring(uiLayerStart);
} else {
    console.log("Could not find boundaries for Vignette block");
}

fs.writeFileSync('src/components/Game2D.tsx', s);
console.log('Added sunbeams!');
