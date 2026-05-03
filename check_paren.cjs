const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

let paren = 0;
let brace = 0;
for (let i = 0; i < code.length; i++) {
    if (code[i] === '(') paren++;
    if (code[i] === ')') paren--;
    if (code[i] === '{') brace++;
    if (code[i] === '}') brace--;
}
console.log('paren balance: ', paren);
console.log('brace balance: ', brace);
