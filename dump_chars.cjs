const fs = require('fs');
const content = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const lines = content.split(String.fromCharCode(10));
for (let l = 1308; l <= 1312; l++) {
    const line = lines[l];
    let codes = [];
    for (let i = 0; i < line.length; i++) {
        codes.push(line.charCodeAt(i));
    }
    console.log("L" + (l+1) + " [" + codes.join(',') + "] : " + line);
}
