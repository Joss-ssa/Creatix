const fs = require('fs');
const content = fs.readFileSync('src/components/Game2D.tsx', 'utf8');

const tsCode = "import { useEffect, useRef } from 'react';\\nexport const Test = () => {\\ntype any = 1;\\ntype Particle = 2;\\n" + 
    content.slice(content.indexOf('  useEffect(() => {'), content.indexOf('  const handleJoystickStart')) + 
    "\\n}";

fs.writeFileSync('test_chunk.tsx', tsCode);
