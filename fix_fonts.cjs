const fs = require('fs');

let g = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

g = g.replace(
  "ctx.fillStyle = isNiebla ? 'rgba(15, 30, 22, 0.8)' : (isExploracion ? 'rgba(25, 21, 34, 0.8)' : (isClaridad ? 'rgba(10, 30, 15, 0.9)' : 'rgba(0, 0, 0, 0.75)'));",
  "ctx.fillStyle = isNiebla ? 'rgba(15, 30, 22, 0.8)' : (isExploracion ? 'rgba(25, 21, 34, 0.8)' : (isClaridad ? 'rgba(10, 25, 26, 0.95)' : 'rgba(0, 0, 0, 0.75)'));"
);

g = g.replace(
  "} else if (isClaridad) {\n          ctx.strokeStyle = '#00E676';",
  "} else if (isClaridad) {\n          ctx.strokeStyle = 'rgba(0, 230, 118, 0.5)';"
);

// Match font spacing/uppercase? The interactionText is just plain text, Game2D handles font with 'bold 16px \"Inter\", sans-serif'
// It is already matched with the other fonts. To truly match typography unity:
// "tendra la misma estetica de los menus de la fase de Claridad."
// The menu has text-[#00E676] and shadow text.
// The Game2D code currently uses ctx.fillStyle = isClaridad ? '#00E676' : ...
// And ctx.shadowColor = 'rgba(0, 230, 118, 0.4)'
// That is extremely similar to drop-shadow-[0_0_15px_rgba(0,230,118,0.4)] and text-[#00E676].

fs.writeFileSync('src/components/Game2D.tsx', g);

let a = fs.readFileSync('src/App.tsx', 'utf8');

// Strip out inline font styles from Claridad menus
a = a.replace(/<h2 className="text-\[#00E676\] text-xl font-bold tracking-wide uppercase" style={{ fontFamily: '"Playfair Display", serif' }}>Creatividad<\/h2>/g, 
  '<h2 className="text-[#00E676] text-xl font-bold tracking-wide uppercase">Creatividad</h2>');

a = a.replace(/<h2 className="text-\[32px\] font-bold text-\[#00E676\] uppercase tracking-wide mb-6" style={{ fontFamily: '"Inter", sans-serif' }}>/g, 
  '<h2 className="text-[32px] font-bold text-[#00E676] uppercase tracking-wide mb-6">');

a = a.replace(/<h2 className="text-\[32px\] font-extrabold text-\[#00E676\] uppercase tracking-widest text-center mb-10 drop-shadow-\[0_0_15px_rgba\(0,230,118,0\.4\)\]" style={{ fontFamily: '"Inter", sans-serif' }}>CONTROLES<\/h2>/g,
  '<h2 className="text-[32px] font-extrabold text-[#00E676] uppercase tracking-widest text-center mb-10 drop-shadow-[0_0_15px_rgba(0,230,118,0.4)]">CONTROLES</h2>');

a = a.replace(/<h3 className="text-xl font-bold tracking-widest uppercase mb-4 text-\[#00E676\]" style={{ fontFamily: '"Playfair Display", serif' }}>/g,
  '<h3 className="text-xl font-bold tracking-widest uppercase mb-4 text-[#00E676]">');

fs.writeFileSync('src/App.tsx', a);

console.log("Updated E aesthetics + removed typography");
