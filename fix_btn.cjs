const fs = require('fs');
let content = fs.readFileSync('src/components/ReflectionsModal.tsx', 'utf8');

// The close button is already <motion.button>, let's check
// Replace <button to <motion.button only if it hasn't been changed yet.
// Since we only need to fix lines 96 and 166 (roughly)

content = content.replace(/<button\n\s*onClick=\{onClose\}/, '<motion.button\n            onClick={onClose}');
content = content.replace(/<button\n\s*onClick=\{handleSubmit\}/, '<motion.button\n            onClick={handleSubmit}');

// Add the initial/animate/transition props to these! 
const anim = 'initial={{ opacity: 0, y: 100, scale: 0 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.85, damping: 6, stiffness: 300 }}';

content = content.replace(/<motion\.button\n\s*onClick=\{onClose\}/, `<motion.button ${anim}\n            onClick={onClose}`);
content = content.replace(/<motion\.button\n\s*onClick=\{handleSubmit\}/, `<motion.button ${anim}\n            onClick={handleSubmit}`);

fs.writeFileSync('src/components/ReflectionsModal.tsx', content);

