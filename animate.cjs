const fs = require('fs');

function animateTypo(file) {
  let content = fs.readFileSync(file, 'utf8');

  const animationProps = 'initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.6, damping: 15, stiffness: 200 }}';

  const tags = ['h1', 'h2', 'h3', 'p', 'label'];
  tags.forEach(tag => {
     // replace `<tag className="` with `<motion.tag animationProps className="`
     content = content.replace(new RegExp(`<${tag} className="`, 'g'), `<motion.${tag} ${animationProps} className="`);
     // replace `</tag>` with `</motion.tag>`
     content = content.replace(new RegExp(`</${tag}>`, 'g'), `</motion.${tag}>`);
  });

  // some might not have className right after the tag
  tags.forEach(tag => {
     content = content.replace(new RegExp(`<${tag}>`, 'g'), `<motion.${tag} ${animationProps}>`);
  });
  
  // also animate standard buttons? let's do close buttons or main buttons if they have onClick
  // content = content.replace(/<button /g, `<motion.button ${animationProps} `);
  // content = content.replace(/<\/button>/g, `</motion.button>`);

  fs.writeFileSync(file, content);
}

animateTypo('src/components/HelpModal.tsx');
animateTypo('src/components/ReflectionsModal.tsx');

// Some components in App.tsx didn't have typography updated. Let's do it there too.
animateTypo('src/App.tsx');

console.log("Done");
