const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8').split(String.fromCharCode(10));

let open = 0;
let lastLine = '';
for (let i = 0; i < code.length; i++) {
    const line = code[i];
    let prev = open;
    for (let c of line) {
        if (c === '{') open++;
        if (c === '}') open--;
    }
    if (open !== prev) {
         if (open >= 3) console.log("L" + i + ": count=" + open + " line: " + line);
    }
}
