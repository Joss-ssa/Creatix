const fs = require('fs');
let s = fs.readFileSync('server.ts', 'utf8');
s = s.replace(/\\\`/g, '`');
s = s.replace(/\\\${/g, '${');
s = s.replace(/\\\\n/g, '\\n');
fs.writeFileSync('server.ts', s);
console.log('fixed server.ts');
