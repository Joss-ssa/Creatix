const fs = require('fs');

function makeSmoothAndStaggered(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change to a very smooth, elegant spring. No bounce, medium stiffness, very smooth.
  content = content.replace(/type:\s*"spring",\s*bounce:\s*0\.4,\s*damping:\s*15,\s*stiffness:\s*200/g, 
    'type: "spring", bounce: 0, damping: 20, stiffness: 100');
  
  content = content.replace(/type:\s*"spring",\s*bounce:\s*0\.4,\s*damping:\s*15,\s*stiffness:\s*200,\s*mass:\s*1/g, 
    'type: "spring", bounce: 0, damping: 20, stiffness: 100, mass: 1');

  // Make Sidebars slide farther
  content = content.replace(/x:\s*-40/g, 'x: -80');

  // To make it disappear sequentially, we can try to add wait to the wrapper,
  // but let's just ensure that exit scale and distances are noticeable but very smooth.
  content = content.replace(/scale: 0\.95/g, 'scale: 0.9');

  fs.writeFileSync(file, content);
}

makeSmoothAndStaggered('src/App.tsx');
makeSmoothAndStaggered('src/components/HelpModal.tsx');
makeSmoothAndStaggered('src/components/ReflectionsModal.tsx');
console.log('SMOOTH APPLIED');
