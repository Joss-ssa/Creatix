const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8').split(String.fromCharCode(10));

let paren = 0;
for (let i = 0; i < code.length; i++) {
    const line = code[i];
    let prev = paren;
    for (let c of line) {
        if (c === '(') paren++;
        if (c === ')') paren--;
    }
    if (paren < 0) {
        console.log("Paren drops below 0 at L" + i + ": " + line);
        break;
    }
}
