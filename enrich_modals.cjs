const fs = require('fs');

function enrichModal(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add variants
  if (!content.includes('const itemV')) {
    content = content.replace(/(export const [^\n]+(?:=>|{)[^\n]*\n)/, 
`$1  const itemV = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.6, damping: 15, stiffness: 200 } }
  };
  const listV = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };
`);
  }

  if (file.includes('HelpModal.tsx')) {
     content = content.replace(/<div className="max-w-\[1000px\] w-full mx-auto pt-20 px-8 pb-16">/, 
     '<motion.div variants={listV} initial="hidden" animate="visible" className="max-w-[1000px] w-full mx-auto pt-20 px-8 pb-16">');
     content = content.replace(/<\/div>\n          \n        <\/div>\n      <\/div>\n    <\/motion.div>/, '</motion.div>\n          \n        </div>\n      </div>\n    </motion.div>');
  } else if (file.includes('ReflectionsModal.tsx')) {
     content = content.replace(/<div className="space-y-4 sm:space-y-6">/, '<motion.div variants={listV} initial="hidden" animate="visible" className="space-y-4 sm:space-y-6">');
     content = content.replace(/<\/div>\n\s*<\/div>\n\s*<\/motion.div>\n\s*\);\n\}/, '</motion.div>\n      </div>\n    </motion.div>\n  );\n}');
      
     content = content.replace(/<div className="w-full flex-1 relative flex flex-col items-center justify-center min-h-\[200px\] mb-12 px-6 sm:px-12">/, '<motion.div variants={listV} initial="hidden" animate="visible" className="w-full flex-1 relative flex flex-col items-center justify-center min-h-[200px] mb-12 px-6 sm:px-12">');
     content = content.replace(/<\/div>\n\n\s*\{\/\* Bottom Button/, '</motion.div>\n\n          {/* Bottom Button');
  }

  // Replace tags: <h1, <h2, <h3, <p, <label
  const tags = ['h1', 'h2', 'h3', 'p', 'label'];
  tags.forEach(tag => {
     content = content.replace(new RegExp(`<${tag} (className="[^"]*")`, 'g'), `<motion.${tag} variants={itemV} $1`);
     content = content.replace(new RegExp(`</${tag}>`, 'g'), `</motion.${tag}>`);
  });
  
  // Custom for elements that might not have className right away or we just want to animate specific ones
  content = content.replace(/<button([^>]+onClick=\{onClose}[^>]*)>/g, '<motion.button variants={itemV} $1>');
  content = content.replace(/<\/button>\n\s*<\/div>\n\s*<\/motion.div>/g, '</motion.button>\n        </div>\n      </motion.div>');
  
  fs.writeFileSync(file, content);
}

enrichModal('src/components/HelpModal.tsx');
enrichModal('src/components/ReflectionsModal.tsx');
console.log("Done");
