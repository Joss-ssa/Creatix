const fs = require('fs');
const ts = require('typescript');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

// Use TS compiler API to find exactly where it fails
const sourceFile = ts.createSourceFile(
  'Game2D.tsx',
  code,
  ts.ScriptTarget.Latest,
  true
);

function traverse(node) {
   // Just trying to see if it parses fully. If it throws, we know.
}

console.log("Checking syntax using typescript parser...");
