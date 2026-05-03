const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8').split('\\n');

let open = 0;
for (let i = 0; i < code.length; i++) {
    const line = code[i];
    for (let c of line) {
        if (c === '{') open++;
        if (c === '}') open--;
    }
}
console.log("Final balance: " + open);
