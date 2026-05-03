const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8').split(String.fromCharCode(10));

let open = 0;
for (let i = 0; i < 150; i++) {
    const line = code[i] || "";
    let prev = open;
    for (let c of line) {
        if (c === '{') open++;
        if (c === '}') open--;
    }
    console.log("L" + i + ": open=" + open + " | " + line);
}
