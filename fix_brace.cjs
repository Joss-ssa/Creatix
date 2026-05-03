const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

s = s.replace(/else if \(false\) \{ \/\/ Just in case it disrupts following block/g, 'else if (false) { } // Just in case it disrupts following block');

fs.writeFileSync('src/components/Game2D.tsx', s);
