const fs = require('fs');
const s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

let count = 0;
for(let i=0; i<s.length; i++) {
  if (s[i] === '{') count++;
  else if (s[i] === '}') count--;
  if (count < 0) {
     console.log("Unmatched closing brace at index " + i + ", line " + s.substring(0, i).split('\\n').length);
     break;
  }
}
if (count === 0) console.log("Braces Match.");
else console.log("Missing " + count + " closing braces.");
