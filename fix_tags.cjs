const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Any unmatched `<p className=\{[^\}]+\}>` that ends with `</motion.p>` should be `motion.p`
  
  content = content.replace(/<(p|h1|h2|h3|label)( className=\{`\$[^\}]+\}>)((?:[^<]|<(?!(?:\/\1|\/motion\.\1)>))*?)<\/motion\.\1>/gs, 
     '<motion.$1 initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.6, damping: 15, stiffness: 200 }}$2$3</motion.$1>');

  fs.writeFileSync(file, content);
}
fix('src/App.tsx');
console.log('Fixed tags');
