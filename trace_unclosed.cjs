const fs = require('fs');
const file = 'src/components/Game2D.tsx';
const code = fs.readFileSync(file, 'utf8');

// I am going to search for the open brace that remained open!
let openB = 0;
let lines = code.split(String.fromCharCode(10));
let inString = false;
let strChar = '';
let inComment = false;
let inBlockComment = false;

let braceStack = [];

for (let l = 0; l < lines.length; l++) {
    const line = lines[l];
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        const next = line[i+1];
        if (inBlockComment) {
            if (c === '*' && next === '/') {
                inBlockComment = false;
                i++;
            }
            continue;
        }
        if (inComment) continue; // rest of line
        if (inString) {
            if (c === '\\\\') { i++; continue; }
            if (c === strChar) inString = false;
            continue;
        }
        
        if (c === '/' && next === '/') { inComment = true; i++; continue; }
        if (c === '/' && next === '*') { inBlockComment = true; i++; continue; }
        if (c === "'" || c === '"' || c === "\`") { inString = true; strChar = c; continue; }
        
        if (c === '{') {
             braceStack.push({ line: l+1, idx: i, text: line.trim() });
             openB++;
        }
        if (c === '}') {
             braceStack.pop();
             openB--;
        }
    }
    inComment = false;
}
console.log("Unclosed braces: ");
console.log(braceStack);
