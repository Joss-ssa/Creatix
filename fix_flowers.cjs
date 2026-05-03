const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const flowerStart = s.indexOf("else if (obj.type === 'flower') {");
if (flowerStart !== -1) {
    const glowingStart = s.indexOf("else if (obj.type === 'glowing_plant') {");
    const flowerRepl = `else if (obj.type === 'flower' || obj.type === 'pink_flower') {
          const s = obj.scale * (obj.type === 'pink_flower' ? 2 : 1);
          // Leaves
          ctx.fillStyle = '#228B22';
          ctx.beginPath();
          ctx.ellipse(-8 * s, -6 * s, 5 * s, 3 * s, Math.PI/4, 0, Math.PI * 2);
          ctx.ellipse(8 * s, -6 * s, 5 * s, 3 * s, -Math.PI/4, 0, Math.PI * 2);
          ctx.fill();
          // Stem
          ctx.strokeStyle = '#006400';
          ctx.lineWidth = 2 * s;
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(0, -15 * s); ctx.stroke();
          
          // Flower petals
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          for(let p=0; p<5; p++) {
             const ang = (Math.PI * 2 / 5) * p;
             ctx.moveTo(0, -15 * s);
             ctx.arc(Math.cos(ang)*5*s, -15*s + Math.sin(ang)*5*s, 4*s, 0, Math.PI*2);
          }
          ctx.fill();
          
          // Center
          ctx.fillStyle = obj.type === 'pink_flower' ? '#FFD700' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, -15 * s, 3 * s, 0, Math.PI*2);
          ctx.fill();
        }
        `;
    s = s.substring(0, flowerStart) + flowerRepl + s.substring(glowingStart);
}
fs.writeFileSync('src/components/Game2D.tsx', s);
console.log('Fixed flowers');
