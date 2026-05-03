const fs = require('fs');
const ts = require('typescript');

const file = 'src/components/Game2D.tsx';
const code = fs.readFileSync(file, 'utf8');

// We simply want to scan from top to line 1250, wait we can just use TS.
let openP = 0, openB = 0;
let inString = false;
let strChar = '';
let inComment = false;
let inBlockComment = false;

for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const next = code[i+1];
    
    if (inBlockComment) {
        if (c === '*' && next === '/') {
            inBlockComment = false;
            i++;
        }
        continue;
    }
    if (inComment) {
        if (c === '\\n') inComment = false;
        continue;
    }
    if (inString) {
        if (c === '\\\\') i++;
        else if (c === strChar) inString = false;
        continue;
    }
    
    if (c === '/' && next === '/') { inComment = true; i++; continue; }
    if (c === '/' && next === '*') { inBlockComment = true; i++; continue; }
    if (c === "'" || c === '"' || c === "\`") { inString = true; strChar = c; continue; }
    
    if (c === '(') openP++;
    if (c === ')') openP--;
    if (c === '{') openB++;
    if (c === '}') {
       openB--;
       if (openB < 0) {
           console.log("Brace drops < 0 at index " + i + ", line " + code.substring(0, i).split('\\n').length);
           break;
       }
    }
}
console.log('Final Parenthesis: ', openP);
console.log('Final Brace: ', openB);
