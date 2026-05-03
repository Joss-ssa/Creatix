const fs = require('fs');

let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

// 1. Remove River/Cliff logic
const riverCliffStart = s.indexOf('      // Draw River and Cliff for Phase 3');
const riverCliffEnd = s.indexOf('      // Draw Path Polygons');
if (riverCliffStart !== -1 && riverCliffEnd !== -1) {
    s = s.substring(0, riverCliffStart) + s.substring(riverCliffEnd);
} else {
    console.log("Could not find River/Cliff block bounds");
}

fs.writeFileSync('src/components/Game2D.tsx', s);
console.log('Removed river cliff logic');
