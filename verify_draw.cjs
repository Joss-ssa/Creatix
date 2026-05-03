const fs = require('fs');
const code = fs.readFileSync('src/components/Game2D.tsx', 'utf8').split(String.fromCharCode(10));

let open = 0;
for (let i = 0; i < code.length; i++) {
    const line = code[i];
    for (let c of line) {
        if (c === '{') open++;
        if (c === '}') open--;
    }
    if (line.includes('const draw = () => {')) {
        console.log("draw starts at " + i + " with open=" + open);
    }
    if (line.includes('animationId = requestAnimationFrame(draw);')) {
        console.log("draw ends roughly at " + i + " with open=" + open);
    }
    if (line.includes('return () => {')) {
        console.log("return starts at " + i + " with open=" + open);
    }
    if (line.includes('}, [stage, appState')) {
        console.log("useEffect ends at " + i + " with open=" + open);
    }
}
