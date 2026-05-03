const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8').split('\\n');

let open = 0;
for (let i = 0; i < code.length; i++) {
    const line = code[i];
    let old = open;
    for (let c of line) {
        if (c === '{') open++;
        if (c === '}') open--;
    }
    if (i > 100 && i < 350 && (open !== old || open > 2)) {
        console.log("L" + i + ": open=" + open + " -> " + line);
    }
}
