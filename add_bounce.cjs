const fs = require('fs');

function updateMotion(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace transition configs for bounce
  content = content.replace(/damping: 25, stiffness: 300, mass: 1/g, 'type: "spring", bounce: 0.6, damping: 12, stiffness: 150, mass: 1');
  content = content.replace(/damping: 25, stiffness: 200/g, 'type: "spring", bounce: 0.5, damping: 15, stiffness: 150');
  content = content.replace(/damping: 25, stiffness: 200, mass: 1/g, 'type: "spring", bounce: 0.5, damping: 15, stiffness: 150, mass: 1');

  // Let's add motion to main typography in App.tsx
  if (file.includes('App.tsx')) {
    // Add motion to h1, h2, h3, p if they are direct kids of a screen
    // Instead of regex madness, let's just do a string replace for some key classes
  }

  fs.writeFileSync(file, content);
}

updateMotion('src/App.tsx');
updateMotion('src/components/HelpModal.tsx');
updateMotion('src/components/ReflectionsModal.tsx');
console.log('Done updating bounce');
