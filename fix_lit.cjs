const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const literal = '    }\\\\n\\\\n    // Generate Dense Forest';
s = s.replace(literal, '    }\\n\\n    // Generate Dense Forest');

fs.writeFileSync('src/components/Game2D.tsx', s);
