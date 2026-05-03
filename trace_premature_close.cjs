const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8').split(String.fromCharCode(10));

let open = 0;
for (let i = 0; i < code.length; i++) {
    const line = code[i];
    for (let c of line) {
        if (c === '{') open++;
        if (c === '}') {
            open--;
            if (open === 0 && i > 50 && i < code.length - 20) {
                console.log("Component closed early at L" + i + ": " + line);
            }
        }
    }
}
