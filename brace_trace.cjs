const fs = require('fs');
const s = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

let count = 0;
let lastOpen = [];
for(let i=0; i<s.length; i++) {
  if (s[i] === '{') { count++; lastOpen.push(s.substring(Math.max(0, i-50), i)); }
  else if (s[i] === '}') { count--; lastOpen.pop(); }
  if (count < 0) {
     console.log("Unmatched closing brace at index " + i + ", line " + s.substring(0, i).split('\\n').length);
     break;
  }
}
if (count === 0) console.log("Braces Match.");
else {
  console.log("Missing " + count + " closing braces.");
  console.log("Last unmatched open brace: " + lastOpen[lastOpen.length - 1]);
}
