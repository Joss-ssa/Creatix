const fs = require('fs');
let s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const target1 = "else if (false) { } // Just in case it disrupts following blockelse if";
if (s.includes(target1)) {
    console.log("Found target 1, replacing");
    s = s.replace(target1, "else if (false) { } // Just in case it disrupts following block\\n        else if");
}

const target2 = "else if (false) { // Just in case it disrupts following blockelse if";
if (s.includes(target2)) {
    console.log("Found target 2, replacing");
    s = s.replace(target2, "else if (false) { } // Just in case it disrupts following block\\n        else if");
}

fs.writeFileSync('src/components/Game2D.tsx', s);
