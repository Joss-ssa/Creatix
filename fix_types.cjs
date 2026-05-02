const fs = require('fs');

function fixTypes(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/const pageV = \{/g, 'const pageV: any = {');
  content = content.replace(/const itemV = \{/g, 'const itemV: any = {');
  content = content.replace(/const sidebarV = \{/g, 'const sidebarV: any = {');
  
  if (file.includes('Modal')) {
    content = content.replace(/const modalV = \{/g, 'const modalV: any = {');
    content = content.replace(/const listV = \{/g, 'const listV: any = {');
  }

  fs.writeFileSync(file, content);
}

fixTypes('src/App.tsx');
fixTypes('src/components/HelpModal.tsx');
fixTypes('src/components/ReflectionsModal.tsx');
console.log('TYPES FIXED');
