const fs = require('fs');

let g = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

// 1) Replace all #00E5FF back to #FFD700 (which reverts my mistake of global replace on Game2D)
g = g.replace(/#00E5FF/g, '#FFD700');
g = g.replace(/0,229,255/g, '255,215,0');
g = g.replace(/0, 229, 255/g, '255, 215, 0');
g = g.replace(/rgba\(0,229,255/g, 'rgba(255,215,0');
g = g.replace(/rgba\(0, 229, 255/g, 'rgba(255, 215, 0');
g = g.replace(/#00BFA5/g, '#B8860B');

// 2) Now, strategically apply the NEW GREEN color (#00E676) for Claridad specific things
// Arch color for Claridad:
g = g.replace(/const defaultArchColor = isNiebla \? '#8BE8B9' : \(isExploracion \? '#FF9CB1' : '#FFD700'\);/, "const defaultArchColor = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : '#00E676');");

// Interaction box fill (isClaridad ? '#102A1E'):
g = g.replace(/ctx.fillStyle = isNiebla \? 'rgba\\(15, 30, 22, 0.8\\)' : \\(isExploracion \? 'rgba\\(25, 21, 34, 0.8\\)' : \\(isClaridad \? 'rgba\\(10, 25, 26, 0.8\\)' : 'rgba\\(0, 0, 0, 0.75\\)'\\)\\);/, "ctx.fillStyle = isNiebla ? 'rgba(15, 30, 22, 0.8)' : (isExploracion ? 'rgba(25, 21, 34, 0.8)' : (isClaridad ? 'rgba(10, 30, 15, 0.9)' : 'rgba(0, 0, 0, 0.75)'));");

// Interaction box stroke:
g = g.replace(/} else if \\(isClaridad\\) \{\\n          ctx.strokeStyle = '#004D40';/, "} else if (isClaridad) {\n          ctx.strokeStyle = '#00E676';");

// Interaction text color:
g = g.replace(/ctx.fillStyle = isNiebla \? '#8BE8B9' : \\(isExploracion \? '#FF9CB1' : \\(isClaridad \? '#FFD700' : 'white'\\)\\);/, "ctx.fillStyle = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : (isClaridad ? '#00E676' : 'white'));");

// Interaction shadow:
g = g.replace(/} else if \\(isClaridad\\) \{\\n           ctx.shadowColor = 'rgba\\(255, 215, 0, 0.4\\)';/, "} else if (isClaridad) {\n           ctx.shadowColor = 'rgba(0, 230, 118, 0.4)';");

fs.writeFileSync('src/components/Game2D.tsx', g);
