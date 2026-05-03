const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

s = s.replace("    }\\\\n\\\\n    // Generate Dense Forest Trees & Flowers", "    }\\n\\n    // Generate Dense Forest Trees & Flowers");

fs.writeFileSync('src/components/Game2D.tsx', s);
