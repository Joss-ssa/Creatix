const fs = require('fs');

function softenMotion(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Spring configs
  content = content.replace(/bounce: 0\.85/g, 'bounce: 0.4');
  content = content.replace(/damping: 6/g, 'damping: 15');
  content = content.replace(/stiffness: 300/g, 'stiffness: 200');

  content = content.replace(/bounce: 0\.7/g, 'bounce: 0.4');
  content = content.replace(/damping: 10/g, 'damping: 15');
  content = content.replace(/stiffness: 250/g, 'stiffness: 200');

  // Typography positions
  content = content.replace(/y: 150,\s*scale: 0\.4/g, 'y: 30, scale: 0.95');
  content = content.replace(/y: 80,\s*scale: 0\.8/g, 'y: 20, scale: 0.95');

  // Modal / screen transitions
  content = content.replace(/y: 250,\s*filter:\s*'blur\(20px\)'/g, "y: 40, filter: 'blur(5px)'");
  content = content.replace(/scale: 0\.3,\s*y: 250/g, "scale: 0.95, y: 40");
  content = content.replace(/scale: 0\.3,\s*y: 150/g, "scale: 0.95, y: 40");
  content = content.replace(/scale: 0\.7,\s*y: 100,\s*filter:\s*'blur\(10px\)'/g, "scale: 0.95, y: 30, filter: 'blur(5px)'");

  // Sidebar transitions
  content = content.replace(/x: -300,\s*opacity: 0,\s*scale: 0\.5/g, "x: -40, opacity: 0, scale: 0.95");
  content = content.replace(/x: -200,\s*opacity: 0,\s*scale: 0\.9/g, "x: -40, opacity: 0, scale: 0.95");

  // Button
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 100,\s*scale: 0\s*\}\}/g, "initial={{ opacity: 0, y: 20, scale: 0.95 }}");
  content = content.replace(/initial=\{\{\s*opacity: 0,\s*y: 30,\s*scale: 0\.95\s*\}\}/g, "initial={{ opacity: 0, y: 20, scale: 0.95 }}");

  fs.writeFileSync(file, content);
}

softenMotion('src/App.tsx');
softenMotion('src/components/HelpModal.tsx');
softenMotion('src/components/ReflectionsModal.tsx');
console.log('SOFTEN MOTION APPLIED');
