const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const target = "    // Generate Dense Forest Trees & Flowers";
s = s.replace(target, "    }\\n\\n" + target);

fs.writeFileSync('src/components/Game2D.tsx', s);
