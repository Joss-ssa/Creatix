const fs = require('fs');

let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

// 1. Remove River/Cliff logic (search for `// Draw River and Cliff for Phase 3`)
const riverCliffStart = s.indexOf('// Draw River and Cliff for Phase 3');
const riverCliffEnd = s.indexOf('      // Draw Path Base');
if (riverCliffStart !== -1 && riverCliffEnd !== -1) {
    s = s.substring(0, riverCliffStart) + s.substring(riverCliffEnd);
}

// 2. Remove fox and background mountains mapping.
const foxStart = s.indexOf('// Add a fox sleeping on the left cliff edge');
if (foxStart !== -1) {
    const foxEnd = s.indexOf('// Background Silhouette Trees for Depth');
    s = s.substring(0, foxStart) + s.substring(foxEnd);
}

// 3. Update the types assigned for trees/flowers in isClaridad
// We change birch_tree to lush_tree
s = s.replace(/isClaridad \? 'birch_tree' : 'tree'/g, "isClaridad ? 'lush_tree' : 'tree'");

// Update Phase 3 flower to bright pink flower colors
s = s.replace(/colors = \['#FFD700', '#FFFFE0'\]; \/\/ Yellow\/White for Phase 3/, "colors = ['#FF69B4', '#FF1493', '#FFB6C1']; // Pink flowers");
s = s.replace(/type = 'flower';/, "type = isClaridad ? 'pink_flower' : 'flower';"); // We'll make it generic handling below

// 4. In draw phase, change birch_tree rendering to a new luscious green rendering.
// Find birch_tree drawing logic and replace it:
const birchStart = s.indexOf('else if (obj.type === \'birch_tree\') {');
const birchEnd = s.indexOf('else if (obj.type === \'mountain\') {');
if (birchStart !== -1 && birchEnd !== -1) {
    const lushTreeLogic = `else if (obj.type === 'lush_tree') {
          const s = obj.scale * 1.5; // Bigger
          
          // Trunk - thick, dark brown/green tint
          const colorOffset = obj.darkness * 20;
          const trunkGrad = ctx.createLinearGradient(-40 * s, 0, 40 * s, 0);
          trunkGrad.addColorStop(0, \`rgb(\${30 + colorOffset}, \${25 + colorOffset}, \${20 + colorOffset})\`);
          trunkGrad.addColorStop(0.5, \`rgb(\${55 + colorOffset}, \${45 + colorOffset}, \${35 + colorOffset})\`);
          trunkGrad.addColorStop(1, \`rgb(\${20 + colorOffset}, \${15 + colorOffset}, \${10 + colorOffset})\`);
          
          ctx.fillStyle = trunkGrad;
          ctx.beginPath();
          ctx.moveTo(-45 * s, 0);
          ctx.lineTo(-25 * s, -1200 * s);
          ctx.lineTo(25 * s, -1200 * s);
          ctx.lineTo(45 * s, 0);
          ctx.fill();

          // Vines hanging down the trunk
          ctx.strokeStyle = '#2d4215';
          ctx.lineWidth = 4 * s;
          ctx.beginPath();
          ctx.moveTo(-10 * s, -1000 * s);
          ctx.quadraticCurveTo(-30 * s, -500 * s, -5 * s, 0);
          ctx.stroke();

          // Luscious green leafy canopies
          const drawCanopy = (cx, cy, rX, rY, lightColor, midColor, shadowColor) => {
             ctx.fillStyle = shadowColor;
             ctx.beginPath(); ctx.ellipse(cx, cy, rX, rY, 0, 0, Math.PI * 2); ctx.fill();
             
             ctx.fillStyle = midColor;
             ctx.beginPath(); ctx.ellipse(cx - rX * 0.1, cy - rY * 0.2, rX * 0.8, rY * 0.8, 0, 0, Math.PI * 2); ctx.fill();
             
             ctx.fillStyle = lightColor;
             ctx.beginPath(); ctx.ellipse(cx - rX * 0.3, cy - rY * 0.4, rX * 0.5, rY * 0.5, 0, 0, Math.PI * 2); ctx.fill();
          };

          const lColor = '#8ee53f';
          const mColor = '#5cb823';
          const sColor = '#2b6e15';

          // Huge enveloping canopies
          drawCanopy(0, -1100 * s, 400 * s, 250 * s, lColor, mColor, sColor);
          drawCanopy(-200 * s, -950 * s, 300 * s, 200 * s, lColor, mColor, sColor);
          drawCanopy(200 * s, -850 * s, 350 * s, 250 * s, lColor, mColor, sColor);
          drawCanopy(0, -700 * s, 250 * s, 150 * s, lColor, mColor, sColor);
          
          // Foreground bushes
          drawCanopy(-100 * s, 0, 150 * s, 100 * s, lColor, mColor, sColor);
          drawCanopy(150 * s, 0, 200 * s, 120 * s, lColor, mColor, sColor);
        }
        `;
    s = s.substring(0, birchStart) + lushTreeLogic + s.substring(birchEnd);
}

// 5. Update pink_flower
const flowerStart = s.indexOf('else if (obj.type === \'flower\' || obj.type === \'small_flower\') {');
if (flowerStart !== -1) {
    const flowerRepl = `else if (obj.type === 'flower' || obj.type === 'small_flower' || obj.type === 'pink_flower') {
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
        else if (false) { // Just in case it disrupts following block`;
        
    s = s.substring(0, flowerStart) + flowerRepl + s.substring(s.indexOf('else if (obj.type === \'glowing_plant\') {'));
}


fs.writeFileSync('src/components/Game2D.tsx', s);
console.log('Done script transformations!');
