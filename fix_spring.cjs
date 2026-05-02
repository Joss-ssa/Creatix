const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace type: 'spring', type: "spring"
  content = content.replace(/type: (['"])spring\1,\s*type: "spring"/g, 'type: "spring"');
  
  fs.writeFileSync(file, content);
}
fix('src/App.tsx');
fix('src/components/HelpModal.tsx');
fix('src/components/ReflectionsModal.tsx');
console.log('Fixed tags');
