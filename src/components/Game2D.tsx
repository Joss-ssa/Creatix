import React, { useEffect, useRef } from 'react';

interface Game2DProps {
  stage: string;
  appState: string;
  onPhraseSelect: (phrase: string) => void;
  phrases: string[];
  hasSelectedPhrase: boolean;
  selectedPhrases: string[];
  onEnterTunnel: () => void;
  isMobile?: boolean;
  onOpenMenu?: () => void;
  onOpenReflections?: () => void;
  onOpenHelp?: () => void;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const Game2D: React.FC<Game2DProps> = ({ 
  stage, 
  appState, 
  onPhraseSelect, 
  phrases, 
  hasSelectedPhrase, 
  selectedPhrases, 
  onEnterTunnel, 
  isMobile,
  onOpenMenu,
  onOpenReflections,
  onOpenHelp
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const joystickRef = useRef<HTMLDivElement>(null);
  const joystickKnobRef = useRef<HTMLDivElement>(null);
  const keys = useRef<{ [key: string]: boolean }>({});
  
  // Persist game state across re-renders
  const playerState = useRef({
    x: 0,
    z: 0,
    yaw: 0,
    pitch: 0
  });

  const touchControls = useRef({
    joystickActive: false,
    joystickStart: { x: 0, y: 0 },
    joystickCurrent: { x: 0, y: 0 },
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Game State
    const speed = 25; // Smooth walking speed
    const baseCameraY = 150;
    const fov = 500; 
    const drawDistance = 4000;
    const maxZ = 15000;

    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas && appState === 'PLAYING') {
        playerState.current.yaw -= e.movementX * 0.002; // Reverted to original (mouse left -> view right)
        playerState.current.pitch -= e.movementY * 0.002;
        // Limit pitch to avoid flipping and extreme distortion
        playerState.current.pitch = Math.max(-0.2, Math.min(0.2, playerState.current.pitch));
      }
    };
    
    const handleClick = () => {
      if (appState === 'PLAYING') {
        canvas.requestPointerLock();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Controls
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Stage styling (Dark Magical Forest vs Blue Glowing Forest vs Twilight Forest vs Sunny Cliff)
    const isFog = stage === 'NIEBLA';
    const isExploration = stage === 'EXPLORACION';
    const isConstruction = stage === 'CONSTRUCCION';

    const skyTop = isFog ? '#020B1A' : (isExploration ? '#8AB4F8' : (isConstruction ? '#1DA2D8' : '#040B14'));
    const skyMid = isFog ? '#0A2540' : (isExploration ? '#D7B4F3' : (isConstruction ? '#4DA6FF' : '#0A2E3F'));
    const skyBot = isFog ? '#1A6B8C' : (isExploration ? '#FFB6C1' : (isConstruction ? '#87CEEB' : '#1A4A5A'));
    
    const groundBase = isFog ? '#020B12' : (isExploration ? '#2A4B5C' : (isConstruction ? '#8CC63F' : '#02050A'));
    const pathColor = isFog ? '#151A20' : (isExploration ? '#7A7A9A' : (isConstruction ? '#9ACD32' : '#111111'));
    const fogColor = isFog ? 'rgba(10, 50, 75, ' : (isExploration ? 'rgba(215, 180, 243, ' : (isConstruction ? 'rgba(255, 255, 255, ' : 'rgba(10, 46, 63, '));

    const objects: any[] = [];
    let particles: Particle[] = [];
    
    function getPathX(z: number) {
      return Math.sin(z / 800) * 600 + Math.cos(z / 1500) * 300;
    }

    // Generate Arches (Separated, always on the path)
    const spacing = (maxZ - 3000) / Math.max(1, phrases.length);
    
    phrases.forEach((phrase, i) => {
      const zPos = 2000 + i * spacing;
      if (zPos < maxZ - 1000) {
        const pathX = getPathX(zPos);
        objects.push({
          type: 'arch',
          x: pathX, // Centered exactly on the path
          y: 0,
          z: zPos,
          phrase,
        });
      }
    });

    // Start Tunnel (Decorative)
    objects.push({
      type: 'start_tunnel',
      x: getPathX(0),
      y: 0,
      z: 0
    });

    // End Tunnel
    objects.push({
      type: 'end_mountain',
      x: getPathX(maxZ),
      y: 0,
      z: maxZ
    });

    if (isConstruction) {
      // Add a fox sleeping on the left cliff edge
      objects.push({
        type: 'fox',
        x: getPathX(2000) - 220, // Left edge of the cliff
        y: 0,
        z: 2000,
        scale: 1.5
      });
      
      // Mountains in the background (mostly on the right, or far left across the river)
      for (let i = 0; i < 40; i++) {
        const isLeft = Math.random() > 0.5;
        const mX = getPathX(Math.random() * maxZ) + (isLeft ? -5000 - Math.random() * 3000 : 2000 + Math.random() * 3000);
        objects.push({
          type: 'mountain',
          x: mX,
          y: 0,
          z: Math.random() * maxZ,
          scale: 4 + Math.random() * 6
        });
      }
      
      // Clouds in the sky
      for (let i = 0; i < 60; i++) {
        objects.push({
          type: 'cloud',
          x: (Math.random() - 0.5) * 8000,
          y: -1500 - Math.random() * 1500, // High up in the sky
          z: Math.random() * maxZ,
          scale: 2 + Math.random() * 4
        });
      }
    }

    // Background Silhouette Trees for Depth
    for (let i = 0; i < 300; i++) {
       const zPos = Math.random() * maxZ;
       const pathX = getPathX(zPos);
       const isLeft = Math.random() > 0.5;
       const treeOffset = isLeft ? -1000 - Math.random() * 3000 : 1000 + Math.random() * 3000;
       
       objects.push({
         type: 'bg_tree',
         x: pathX + treeOffset,
         y: 0,
         z: zPos,
         scale: 1.5 + Math.random() * 3,
       });
    }

    // Generate Dense Forest Trees & Flowers
    for (let i = 0; i < 600; i++) {
      const zPos = Math.random() * maxZ;
      const pathX = getPathX(zPos);
      const isLeft = Math.random() > 0.5;
      
      // Trees line the path closely
      let treeOffset = isLeft ? -300 - Math.random() * 1000 : 300 + Math.random() * 1000;
      
      // In Phase 3, the river is on the left, so only place trees on the right
      if (isConstruction && isLeft) {
        treeOffset = 300 + Math.random() * 1500; // Force to right side
      } else if (isExploration) {
        // In Phase 2, push trees further away so they don't block the path
        treeOffset = isLeft ? -450 - Math.random() * 1000 : 450 + Math.random() * 1000;
      }

      objects.push({
        type: isExploration ? 'thick_tree' : (isConstruction ? 'birch_tree' : 'tree'),
        x: pathX + treeOffset,
        y: 0,
        z: zPos,
        scale: 1 + Math.random() * 2.5,
        darkness: Math.random() * 0.5,
        isLeft: isLeft
      });

      // Flowers/Mushrooms along the path edges
      if (Math.random() > 0.1) { // High density
        let flowerOffset = isLeft ? -100 - Math.random() * 500 : 100 + Math.random() * 500;
        
        // In Phase 3, limit left side flowers to the edge of the cliff
        if (isConstruction && isLeft) {
           flowerOffset = -50 - Math.random() * 100;
        } else if (isExploration) {
           // In Phase 2, push mushrooms further away so they don't block the path
           flowerOffset = isLeft ? -250 - Math.random() * 500 : 250 + Math.random() * 500;
        }
        
        let colors;
        let type;
        if (isFog) {
            colors = ['#00FFFF', '#00FA9A', '#7FFFD4', '#E0FFFF']; // Cyan, MediumSpringGreen, Aquamarine, LightCyan
            type = 'glowing_plant';
        } else if (isExploration) {
            colors = ['#FF4040']; // Red for mushrooms
            type = Math.random() > 0.5 ? 'red_mushroom' : 'small_flower';
        } else if (isConstruction) {
            colors = ['#FFFFFF', '#FFD700', '#FF69B4', '#FFA500']; // White, yellow, pink, orange flowers
            type = 'small_flower';
        } else {
            colors = ['#FF1493', '#8A2BE2', '#FF4500', '#FFD700'];
            type = 'flower';
        }

        objects.push({
          type: type,
          x: pathX + flowerOffset,
          y: 0,
          z: zPos,
          scale: 0.3 + Math.random() * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      // Street lamps for Phase 2
      if (isExploration && i % 20 === 0) {
        const lampOffset = isLeft ? -200 : 200;
        objects.push({
          type: 'street_lamp',
          x: pathX + lampOffset,
          y: 0,
          z: zPos,
          scale: 1.5
        });
      }
    }

    // Ambient Fireflies / Pollen
    for (let i = 0; i < 300; i++) {
      const colors = isFog ? ['#00FFFF', '#E0FFFF', '#FFFACD'] : (isExploration ? ['#FFD700', '#FFA500'] : (isConstruction ? ['#FFFFFF', '#FFD700', '#87CEEB'] : ['#00FFFF', '#FF1493', '#FFD700']));
      particles.push({
        x: (Math.random() - 0.5) * 4000,
        y: -Math.random() * 1500,
        z: Math.random() * maxZ,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 999999, // Infinite life for ambient
        maxLife: 999999,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          context.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      context.fillText(line, x, currentY);
      return currentY + lineHeight;
    }

    // 3D to 2D Projection Helper
    function project(x: number, y: number, z: number) {
      const dx = x - playerState.current.x;
      const dy = y + baseCameraY; // Camera height offset
      const dz = z - playerState.current.z;

      // Rotate around Y axis (Yaw)
      const rotX = dx * Math.cos(playerState.current.yaw) - dz * Math.sin(playerState.current.yaw);
      const rotZ = dx * Math.sin(playerState.current.yaw) + dz * Math.cos(playerState.current.yaw);

      // Rotate around X axis (Pitch)
      const rotY = dy * Math.cos(playerState.current.pitch) - rotZ * Math.sin(playerState.current.pitch);
      const finalZ = dy * Math.sin(playerState.current.pitch) + rotZ * Math.cos(playerState.current.pitch);

      const clampedZ = Math.max(20, finalZ); // Increased from 1 to 20 to prevent massive scales that crash the browser
      const scale = fov / clampedZ;
      return {
        x: (canvas.width / 2) + rotX * scale,
        y: (canvas.height / 2) + rotY * scale,
        scale: scale,
        z: finalZ
      };
    }

    // Reset controls when appState changes to prevent auto-run
    keys.current = {};
    touchControls.current.moveForward = false;
    touchControls.current.moveBackward = false;
    touchControls.current.moveLeft = false;
    touchControls.current.moveRight = false;
    touchControls.current.joystickActive = false;

    let animationId: number;

    const draw = () => {
      // Update Player & Camera (Only if PLAYING)
      if (appState === 'PLAYING') {
        // Calculate movement vector based on yaw
        let moveX = 0;
        let moveZ = 0;

        if (keys.current['w'] || keys.current['arrowup'] || touchControls.current.moveForward) {
          moveZ += speed * Math.cos(playerState.current.yaw);
          moveX += speed * Math.sin(playerState.current.yaw);
        }
        if (keys.current['s'] || keys.current['arrowdown'] || touchControls.current.moveBackward) {
          moveZ -= speed * Math.cos(playerState.current.yaw);
          moveX -= speed * Math.sin(playerState.current.yaw);
        }
        if (keys.current['a'] || keys.current['arrowleft'] || touchControls.current.moveLeft) {
          moveX -= speed * Math.cos(playerState.current.yaw);
          moveZ += speed * Math.sin(playerState.current.yaw);
        }
        if (keys.current['d'] || keys.current['arrowright'] || touchControls.current.moveRight) {
          moveX += speed * Math.cos(playerState.current.yaw);
          moveZ -= speed * Math.sin(playerState.current.yaw);
        }

        // Mobile Joystick Camera Control
        if (isMobile && touchControls.current.joystickActive) {
          const dx = touchControls.current.joystickCurrent.x - touchControls.current.joystickStart.x;
          const dy = touchControls.current.joystickCurrent.y - touchControls.current.joystickStart.y;
          
          playerState.current.yaw += dx * 0.0005; // Fixed inversion
          playerState.current.pitch += dy * 0.0005; // Inverted pitch control
          playerState.current.pitch = Math.max(-0.2, Math.min(0.2, playerState.current.pitch));
        }

        playerState.current.x += moveX;
        playerState.current.z += moveZ;

        // Invisible Walls: Restrict player strictly to the path
        playerState.current.z = Math.max(300, Math.min(maxZ - 200, playerState.current.z));
        const currentPathX = getPathX(playerState.current.z);
        const pathWidthLimit = 180; // Strictly within the 200 path width
        playerState.current.x = Math.max(currentPathX - pathWidthLimit, Math.min(currentPathX + pathWidthLimit, playerState.current.x));
      }

      // 1. Sky / Deep Forest Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(0.5, skyMid);
      skyGrad.addColorStop(1, skyBot);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Sun for Phase 3
      if (isConstruction) {
        const sunX = canvas.width * 0.2;
        const sunY = canvas.height * 0.2;
        
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 150);
        sunGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        sunGrad.addColorStop(0.2, 'rgba(255, 255, 200, 0.8)');
        sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Ground Base
      const horizonY = canvas.height / 2 - Math.tan(playerState.current.pitch) * fov;
      ctx.fillStyle = groundBase;
      // Draw ground large enough to cover the bottom
      ctx.fillRect(0, horizonY, canvas.width, canvas.height * 2);

      // 3. Winding Path (Illuminated if phrase selected)
      const pathWidth = 200;
      const step = 200; 
      const maxDrawZ = Math.min(playerState.current.z + drawDistance, maxZ);
      const startDrawZ = Math.max(0, playerState.current.z - drawDistance);

      // Draw River and Cliff for Phase 3
      if (isConstruction) {
        // River
        ctx.fillStyle = '#00BFFF'; // Vibrant cyan/blue river
        for (let z = startDrawZ; z <= maxDrawZ; z += step) {
          const p1L = project(getPathX(z) - 5000, 800, z); // Wider river, lower down
          const p1R = project(getPathX(z) - 400, 800, z);
          const p2L = project(getPathX(z + step) - 5000, 800, z + step);
          const p2R = project(getPathX(z + step) - 400, 800, z + step);

          if (p1L.z > 1 || p2L.z > 1) {
            ctx.beginPath();
            ctx.moveTo(p1L.x, p1L.y);
            ctx.lineTo(p1R.x, p1R.y);
            ctx.lineTo(p2R.x, p2R.y);
            ctx.lineTo(p2L.x, p2L.y);
            ctx.fill();
          }
        }
        
        // Cliff Wall (Grassy/Rocky)
        const cliffGrad = ctx.createLinearGradient(0, canvas.height/2, 0, canvas.height);
        cliffGrad.addColorStop(0, '#8CC63F'); // Grass top
        cliffGrad.addColorStop(0.1, '#4A5D23'); // Darker grass/dirt
        cliffGrad.addColorStop(0.5, '#4F5D65'); // Gray rock
        cliffGrad.addColorStop(1, '#2F3E46'); // Dark gray rock base
        ctx.fillStyle = cliffGrad;
        
        for (let z = startDrawZ; z <= maxDrawZ; z += step) {
          const pTop = project(getPathX(z) - pathWidth - 50, 0, z);
          const pBot = project(getPathX(z) - 400, 800, z);
          const pTopNext = project(getPathX(z + step) - pathWidth - 50, 0, z + step);
          const pBotNext = project(getPathX(z + step) - 400, 800, z + step);

          if (pTop.z > 1 || pTopNext.z > 1) {
            ctx.beginPath();
            ctx.moveTo(pTop.x, pTop.y);
            ctx.lineTo(pBot.x, pBot.y);
            ctx.lineTo(pBotNext.x, pBotNext.y);
            ctx.lineTo(pTopNext.x, pTopNext.y);
            ctx.fill();
          }
        }
      }

      // Draw Path Polygons
      for (let z = startDrawZ; z <= maxDrawZ; z += step) {
        const p1L = project(getPathX(z) - pathWidth, 0, z);
        const p1R = project(getPathX(z) + pathWidth, 0, z);
        const p2L = project(getPathX(z + step) - pathWidth, 0, z + step);
        const p2R = project(getPathX(z + step) + pathWidth, 0, z + step);

        if (p1L.z > 1 || p2L.z > 1) {
          ctx.beginPath();
          ctx.moveTo(p1L.x, p1L.y);
          ctx.lineTo(p1R.x, p1R.y);
          ctx.lineTo(p2R.x, p2R.y);
          ctx.lineTo(p2L.x, p2L.y);
          ctx.closePath();

          if (hasSelectedPhrase) {
            // Glowing Golden Path
            const dist = (z - playerState.current.z) / drawDistance;
            ctx.fillStyle = `rgba(255, 140, 0, ${1 - dist})`; // Deep orange/gold
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20 * (1 - dist);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Generate Path Particles
            if (Math.random() < 0.1 && appState === 'PLAYING') {
              particles.push({
                x: getPathX(z) + (Math.random() - 0.5) * pathWidth * 2,
                y: -10,
                z: z + Math.random() * step,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3 - 1,
                life: 100,
                maxLife: 100,
                size: Math.random() * 3 + 1,
                color: '#FFD700'
              });
            }
          } else {
            // Dark Stone Path
            ctx.fillStyle = pathColor;
            ctx.fill();
          }
        }
      }

      // 4. Objects & Particles
      const visibleObjects = objects
        .map(obj => {
          const proj = project(obj.x, obj.y, obj.z);
          return { ...obj, proj };
        })
        .filter(obj => obj.proj && obj.proj.z > 0 && obj.proj.z < drawDistance)
        .sort((a, b) => b.proj.z - a.proj.z);

      let interactionText = '';
      let interactionAction: (() => void) | null = null;
      let closestInteractionDist = Infinity;

      visibleObjects.forEach(obj => {
        const { x, y, scale, z } = obj.proj;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        const fogIntensity = Math.min(1, z / drawDistance);
        ctx.globalAlpha = isConstruction ? 1 - (fogIntensity * 0.1) : (isExploration ? 1 : 1 - (fogIntensity * 0.6)); // Reduced fog intensity

        if (obj.type === 'tree') {
          const s = obj.scale;
          // Make trunks opaque and vary color based on darkness
          const baseColor = isFog ? [2, 12, 24] : [20, 30, 40];
          const colorOffset = obj.darkness * 30; // Vary color
          const treeColor = `rgb(${baseColor[0] + colorOffset}, ${baseColor[1] + colorOffset}, ${baseColor[2] + colorOffset})`;
          
          // Trunk Gradient
          const trunkGrad = ctx.createLinearGradient(-20 * s, 0, 20 * s, 0);
          trunkGrad.addColorStop(0, `rgb(${baseColor[0] - 10 + colorOffset}, ${baseColor[1] - 10 + colorOffset}, ${baseColor[2] - 10 + colorOffset})`);
          trunkGrad.addColorStop(0.5, treeColor);
          trunkGrad.addColorStop(1, `rgb(${baseColor[0] + 10 + colorOffset}, ${baseColor[1] + 10 + colorOffset}, ${baseColor[2] + 10 + colorOffset})`);
          
          ctx.fillStyle = trunkGrad;
          
          ctx.beginPath();
          ctx.moveTo(-25 * s, 0); // Wider base
          ctx.lineTo(-10 * s, -2000 * s);
          ctx.lineTo(10 * s, -2000 * s);
          ctx.lineTo(25 * s, 0);
          ctx.fill();

          // Branches
          ctx.lineWidth = 4 * s;
          ctx.strokeStyle = treeColor;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Draw some organic looking branches
          const drawBranch = (startX: number, startY: number, length: number, angle: number, depth: number) => {
            if (depth === 0) return;
            const endX = startX + Math.cos(angle) * length;
            const endY = startY + Math.sin(angle) * length;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            if (isFog && depth === 1) { // Add leaves at the end of branches in Phase 1
               ctx.fillStyle = `rgb(10, 30, 50)`; // Opaque leaves
               ctx.beginPath();
               ctx.arc(endX, endY, 40 * s, 0, Math.PI * 2);
               ctx.fill();
            }
            
            drawBranch(endX, endY, length * 0.7, angle - 0.5, depth - 1);
            drawBranch(endX, endY, length * 0.7, angle + 0.5, depth - 1);
          };

          drawBranch(0, -400 * s, 150 * s, -Math.PI/4, 2);
          drawBranch(0, -700 * s, 120 * s, -Math.PI*3/4, 2);
          drawBranch(0, -1000 * s, 100 * s, -Math.PI/4, 2);
        } 
        else if (obj.type === 'thick_tree') {
          const s = obj.scale;
          const colorOffset = obj.darkness * 20;
          const treeColor = `rgb(${40 + colorOffset}, ${30 + colorOffset}, ${60 + colorOffset})`; // Purplish dark brown, opaque
          
          // Trunk Gradient
          const trunkGrad = ctx.createLinearGradient(-40 * s, 0, 40 * s, 0);
          trunkGrad.addColorStop(0, `rgb(${20 + colorOffset}, ${15 + colorOffset}, ${30 + colorOffset})`);
          trunkGrad.addColorStop(0.5, treeColor);
          trunkGrad.addColorStop(1, `rgb(${60 + colorOffset}, ${45 + colorOffset}, ${80 + colorOffset})`);
          
          ctx.fillStyle = trunkGrad;
          
          ctx.beginPath();
          ctx.moveTo(-50 * s, 0); // Very wide base
          ctx.lineTo(-20 * s, -2000 * s);
          ctx.lineTo(20 * s, -2000 * s);
          ctx.lineTo(50 * s, 0);
          ctx.fill();

          // Arching branches
          ctx.lineWidth = 15 * s;
          ctx.strokeStyle = treeColor;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          ctx.moveTo(0, -800 * s);
          // Curve towards the center of the path
          const archDir = obj.isLeft ? 1 : -1;
          ctx.quadraticCurveTo(archDir * 300 * s, -1200 * s, archDir * 800 * s, -1000 * s);
          ctx.stroke();
          
          // Hanging lantern
          if (Math.random() > 0.5) {
             ctx.fillStyle = '#FFD700';
             ctx.shadowColor = '#FFD700';
             ctx.shadowBlur = 20;
             ctx.beginPath();
             ctx.moveTo(archDir * 200 * s, -1000 * s);
             ctx.lineTo(archDir * 210 * s, -980 * s);
             ctx.lineTo(archDir * 190 * s, -980 * s);
             ctx.fill();
             ctx.shadowBlur = 0;
             
             // string
             ctx.strokeStyle = '#111';
             ctx.lineWidth = 2;
             ctx.beginPath();
             ctx.moveTo(archDir * 200 * s, -1050 * s);
             ctx.lineTo(archDir * 200 * s, -1000 * s);
             ctx.stroke();
          }
        }
        else if (obj.type === 'bg_tree') {
          const s = obj.scale;
          ctx.fillStyle = isFog ? '#020B1A' : (isExploration ? 'rgba(138, 180, 248, 0.3)' : (isConstruction ? '#3CB371' : '#010305'));
          ctx.beginPath();
          ctx.moveTo(-15 * s, 0);
          ctx.lineTo(-5 * s, -2000 * s);
          ctx.lineTo(5 * s, -2000 * s);
          ctx.lineTo(15 * s, 0);
          ctx.fill();
          
          if (isConstruction) {
             ctx.beginPath();
             ctx.arc(0, -1800 * s, 100 * s, 0, Math.PI * 2);
             ctx.fill();
          }
        }
        else if (obj.type === 'flower') {
          const s = obj.scale;
          ctx.fillStyle = obj.color;
          ctx.shadowColor = obj.color;
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(0, -10 * s, 15 * s, 0, Math.PI*2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        else if (obj.type === 'glowing_plant') {
          const s = obj.scale;
          
          // Draw a cluster of glowing leaves/mushrooms
          ctx.shadowColor = obj.color;
          ctx.shadowBlur = 15;
          ctx.fillStyle = obj.color;
          
          ctx.beginPath();
          // Main bulb
          ctx.ellipse(0, -10 * s, 8 * s, 4 * s, 0, 0, Math.PI * 2);
          // Side bulbs
          ctx.ellipse(-8 * s, -6 * s, 5 * s, 3 * s, Math.PI/4, 0, Math.PI * 2);
          ctx.ellipse(8 * s, -6 * s, 5 * s, 3 * s, -Math.PI/4, 0, Math.PI * 2);
          ctx.fill();
          
          // Core highlight
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, -10 * s, 2 * s, 0, Math.PI * 2);
          ctx.fill();
          
          // Stems
          ctx.strokeStyle = '#0A2E3F';
          ctx.lineWidth = 2 * s;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -10 * s);
          ctx.moveTo(0, 0);
          ctx.lineTo(-8 * s, -6 * s);
          ctx.moveTo(0, 0);
          ctx.lineTo(8 * s, -6 * s);
          ctx.stroke();
        }
        else if (obj.type === 'red_mushroom') {
          const s = obj.scale * 2; // Make them a bit bigger
          
          // Stem
          ctx.fillStyle = '#E8E8E8';
          ctx.beginPath();
          ctx.fillRect(-4 * s, -20 * s, 8 * s, 20 * s);
          
          // Cap
          ctx.fillStyle = '#FF4040';
          ctx.beginPath();
          ctx.arc(0, -20 * s, 15 * s, Math.PI, 0);
          ctx.fill();
          
          // White spots
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-5 * s, -25 * s, 2 * s, 0, Math.PI*2);
          ctx.arc(5 * s, -28 * s, 2.5 * s, 0, Math.PI*2);
          ctx.arc(0, -32 * s, 1.5 * s, 0, Math.PI*2);
          ctx.fill();
        }
        else if (obj.type === 'small_flower') {
          const s = obj.scale;
          ctx.fillStyle = obj.color || '#FFD700';
          ctx.beginPath();
          ctx.arc(0, -5 * s, 5 * s, 0, Math.PI*2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, -5 * s, 2 * s, 0, Math.PI*2);
          ctx.fill();
        }
        else if (obj.type === 'street_lamp') {
          const s = obj.scale;
          // Pole
          ctx.fillStyle = '#222';
          ctx.fillRect(-3 * s, -150 * s, 6 * s, 150 * s);
          
          // Lamp head
          ctx.fillStyle = '#FFD700';
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 30;
          ctx.beginPath();
          ctx.moveTo(0, -170 * s);
          ctx.lineTo(10 * s, -150 * s);
          ctx.lineTo(-10 * s, -150 * s);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Lamp roof
          ctx.fillStyle = '#111';
          ctx.beginPath();
          ctx.moveTo(0, -180 * s);
          ctx.lineTo(15 * s, -170 * s);
          ctx.lineTo(-15 * s, -170 * s);
          ctx.fill();
        }
        else if (obj.type === 'birch_tree') {
          const s = obj.scale;
          
          // Trunk
          ctx.fillStyle = '#F5F5F5'; // White/light gray bark
          ctx.beginPath();
          ctx.fillRect(-12 * s, -1200 * s, 24 * s, 1200 * s);
          
          // Trunk shadow (right side)
          ctx.fillStyle = '#D3D3D3';
          ctx.beginPath();
          ctx.fillRect(0, -1200 * s, 12 * s, 1200 * s);
          
          // Black spots on bark
          ctx.fillStyle = '#2C3539';
          for (let i = 1; i < 12; i++) {
             const spotY = -100 * s * i - (Math.abs(Math.sin(obj.x * i)) * 30 * s);
             const spotH = 5 * s + Math.abs(Math.cos(obj.z * i)) * 8 * s;
             const spotW = 10 * s + Math.abs(Math.sin(obj.x)) * 10 * s;
             const isRight = Math.sin(obj.z * i) > 0;
             ctx.fillRect(isRight ? 0 : -12 * s, spotY, spotW, spotH);
          }

          // Leaves (Painterly style)
          const drawLeafCluster = (cx: number, cy: number, radius: number) => {
             // Dark base
             ctx.fillStyle = '#4A7C2A';
             ctx.beginPath();
             ctx.arc(cx, cy, radius, 0, Math.PI * 2);
             ctx.fill();
             
             // Mid tone
             ctx.fillStyle = '#6B8E23';
             ctx.beginPath();
             ctx.arc(cx - radius * 0.2, cy - radius * 0.2, radius * 0.8, 0, Math.PI * 2);
             ctx.fill();
             
             // Highlight (sun from top left)
             ctx.fillStyle = '#9ACD32';
             ctx.beginPath();
             ctx.arc(cx - radius * 0.4, cy - radius * 0.4, radius * 0.5, 0, Math.PI * 2);
             ctx.fill();
          };

          drawLeafCluster(0, -1000 * s, 250 * s);
          drawLeafCluster(-150 * s, -900 * s, 180 * s);
          drawLeafCluster(150 * s, -850 * s, 200 * s);
          drawLeafCluster(0, -1200 * s, 220 * s);
          drawLeafCluster(-100 * s, -1100 * s, 150 * s);
          drawLeafCluster(120 * s, -1050 * s, 160 * s);
        }
        else if (obj.type === 'mountain') {
          const s = obj.scale;
          ctx.fillStyle = isConstruction ? '#2E5A3A' : '#2E8B57'; // Darker green/blueish shadow for base
          ctx.beginPath();
          ctx.moveTo(-500 * s, 0);
          ctx.lineTo(0, -800 * s);
          ctx.lineTo(500 * s, 0);
          ctx.fill();
          
          // Mountain highlight (left side)
          ctx.fillStyle = isConstruction ? '#4CAF50' : '#3CB371'; // Lighter green
          ctx.beginPath();
          ctx.moveTo(-500 * s, 0);
          ctx.lineTo(0, -800 * s);
          ctx.lineTo(0, 0);
          ctx.fill();
        }
        else if (obj.type === 'cloud') {
          const s = obj.scale;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(0, 0, 100 * s, 0, Math.PI * 2);
          ctx.arc(-80 * s, 20 * s, 80 * s, 0, Math.PI * 2);
          ctx.arc(80 * s, 20 * s, 80 * s, 0, Math.PI * 2);
          ctx.arc(-40 * s, -40 * s, 90 * s, 0, Math.PI * 2);
          ctx.arc(40 * s, -40 * s, 90 * s, 0, Math.PI * 2);
          ctx.fill();
        }
        else if (obj.type === 'fox') {
          const s = obj.scale;
          // Body
          ctx.fillStyle = '#D35400'; // Orange
          ctx.beginPath();
          ctx.ellipse(0, -20 * s, 30 * s, 20 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // White belly/tail tip
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(0, -10 * s, 25 * s, 10 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Tail
          ctx.fillStyle = '#D35400';
          ctx.beginPath();
          ctx.ellipse(30 * s, -15 * s, 20 * s, 10 * s, Math.PI/4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(45 * s, -5 * s, 8 * s, 5 * s, Math.PI/4, 0, Math.PI * 2);
          ctx.fill();
          
          // Head
          ctx.fillStyle = '#D35400';
          ctx.beginPath();
          ctx.arc(-25 * s, -30 * s, 15 * s, 0, Math.PI * 2);
          ctx.fill();
          
          // Ears
          ctx.fillStyle = '#222';
          ctx.beginPath();
          ctx.moveTo(-35 * s, -40 * s);
          ctx.lineTo(-30 * s, -55 * s);
          ctx.lineTo(-20 * s, -40 * s);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-15 * s, -40 * s);
          ctx.lineTo(-10 * s, -55 * s);
          ctx.lineTo(-5 * s, -35 * s);
          ctx.fill();
        }
        else if (obj.type === 'arch') {
          const archW = 300;
          const archH = 400;
          const pillarW = 50;
          const archX = -archW / 2;
          const archY = -archH;
          const isSelected = hasSelectedPhrase && selectedPhrases.includes(obj.phrase);

          // Draw arched structure (open in the middle)
          ctx.beginPath();
          // Outer edge
          ctx.moveTo(archX, 0);
          ctx.lineTo(archX, archY + archW / 2);
          ctx.arc(0, archY + archW / 2, archW / 2, Math.PI, 0);
          ctx.lineTo(archX + archW, 0);
          // Inner edge
          ctx.lineTo(archX + archW - pillarW, 0);
          ctx.lineTo(archX + archW - pillarW, archY + archW / 2);
          ctx.arc(0, archY + archW / 2, archW / 2 - pillarW, 0, Math.PI, true); // counter-clockwise
          ctx.lineTo(archX + pillarW, 0);
          ctx.closePath();

          // Fill gradient
          const fillGrad = ctx.createLinearGradient(0, archY, 0, 0);
          if (isSelected) {
            fillGrad.addColorStop(0, '#FFD700'); 
            fillGrad.addColorStop(1, '#FFF8DC'); 
          } else {
            fillGrad.addColorStop(0, '#2A2A2A'); 
            fillGrad.addColorStop(1, '#111111'); 
          }
          ctx.fillStyle = fillGrad;
          ctx.fill();

          // Glowing Gold Border
          const isNiebla = stage === 'NIEBLA';
          const isExploracion = stage === 'EXPLORACION';
          const defaultArchColor = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : '#00E676');

          ctx.strokeStyle = isSelected ? '#FFFFFF' : defaultArchColor;
          ctx.lineWidth = 3;
          ctx.shadowColor = isSelected ? '#FFFFFF' : defaultArchColor;
          ctx.shadowBlur = isSelected ? 30 : 15;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Add keystone
          ctx.beginPath();
          ctx.moveTo(-35, archY - 15);
          ctx.lineTo(35, archY - 15);
          ctx.lineTo(20, archY + pillarW + 10);
          ctx.lineTo(-20, archY + pillarW + 10);
          ctx.closePath();
          ctx.fillStyle = isSelected ? '#FFF8DC' : (isNiebla ? '#1B3024' : (isExploracion ? '#2C1625' : '#333333'));
          ctx.fill();
          ctx.stroke();

          // Add pillar bases
          ctx.fillStyle = isSelected ? '#FFF8DC' : (isNiebla ? '#1B3024' : (isExploracion ? '#2A1629' : '#222222'));
          ctx.fillRect(archX - 15, -40, pillarW + 30, 40);
          ctx.strokeRect(archX - 15, -40, pillarW + 30, 40);
          ctx.fillRect(archX + archW - pillarW - 15, -40, pillarW + 30, 40);
          ctx.strokeRect(archX + archW - pillarW - 15, -40, pillarW + 30, 40);

          // Add pillar capitals (top of pillars before arch)
          const capitalY = archY + archW / 2;
          ctx.fillRect(archX - 15, capitalY, pillarW + 30, 25);
          ctx.strokeRect(archX - 15, capitalY, pillarW + 30, 25);
          ctx.fillRect(archX + archW - pillarW - 15, capitalY, pillarW + 30, 25);
          ctx.strokeRect(archX + archW - pillarW - 15, capitalY, pillarW + 30, 25);

          // Add some ivy/vines (greenish lines wrapping around)
          ctx.strokeStyle = '#2E5A1C';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Left pillar ivy
          ctx.beginPath();
          ctx.moveTo(archX - 5, -10);
          ctx.quadraticCurveTo(archX + pillarW + 15, -50, archX + pillarW / 2, -90);
          ctx.quadraticCurveTo(archX - 15, -130, archX + pillarW + 5, -170);
          ctx.quadraticCurveTo(archX + pillarW + 15, -210, archX, capitalY + 10);
          ctx.stroke();
          
          // Right pillar ivy
          ctx.beginPath();
          ctx.moveTo(archX + archW + 5, -10);
          ctx.quadraticCurveTo(archX + archW - pillarW - 15, -60, archX + archW - pillarW / 2, -100);
          ctx.quadraticCurveTo(archX + archW + 15, -140, archX + archW - pillarW - 5, -180);
          ctx.quadraticCurveTo(archX + archW - pillarW - 15, -220, archX + archW, capitalY + 10);
          ctx.stroke();

          // Draw some leaves on the ivy
          ctx.fillStyle = '#3A7A24';
          const drawLeaf = (lx: number, ly: number) => {
            ctx.beginPath();
            ctx.arc(lx, ly, 6, 0, Math.PI * 2);
            ctx.fill();
          };
          drawLeaf(archX + pillarW + 5, -40);
          drawLeaf(archX - 5, -120);
          drawLeaf(archX + pillarW, -160);
          drawLeaf(archX + archW - pillarW - 5, -50);
          drawLeaf(archX + archW + 5, -130);
          drawLeaf(archX + archW - pillarW, -170);

          // Phrase Text (in the center of the arch opening)
          if (z < 1500) { 
            ctx.fillStyle = isSelected ? '#FFFFFF' : defaultArchColor;
            ctx.shadowColor = isSelected ? '#FFFFFF' : defaultArchColor;
            ctx.shadowBlur = isSelected ? 20 : 10;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 18px "Inter", sans-serif';
            wrapText(ctx, obj.phrase, 0, archY + archH / 2 + 20, archW - pillarW * 2 - 20, 26);
            ctx.shadowBlur = 0; 
          }

          // Magic Pulsing Dot (at the keystone)
          const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
          ctx.fillStyle = isSelected ? `rgba(255, 255, 255, ${0.6 + pulse * 0.4})` : (isNiebla ? `rgba(139, 232, 185, ${0.4 + pulse * 0.6})` : (isExploracion ? `rgba(255, 156, 177, ${0.4 + pulse * 0.6})` : `rgba(241, 196, 15, ${0.4 + pulse * 0.6})`));
          ctx.beginPath();
          ctx.arc(0, archY - 5, 10 + pulse * 5, 0, Math.PI*2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, archY - 5, 3, 0, Math.PI*2);
          ctx.fill();

          // Spawn Particles
          if (Math.random() < 0.5 && appState === 'PLAYING') {
            particles.push({
              x: obj.x + (Math.random() - 0.5) * archW,
              y: archY + Math.random() * archH,
              z: obj.z,
              vx: (Math.random() - 0.5) * 2,
              vy: -Math.random() * 2 - 0.5,
              life: 100,
              maxLife: 100,
              size: Math.random() * 4 + 2,
              color: isSelected ? '#FFFFFF' : defaultArchColor
            });
          }

          // Interaction Check
          const distToPlayer = Math.sqrt(Math.pow(obj.x - playerState.current.x, 2) + Math.pow(obj.z - playerState.current.z, 2));
          if (distToPlayer < 400 && distToPlayer < closestInteractionDist && appState === 'PLAYING') {
            closestInteractionDist = distToPlayer;
            interactionText = 'Presiona E para leer el arco';
            interactionAction = () => {
              document.exitPointerLock();
              onPhraseSelect(obj.phrase);
            };
          }
        }
        else if (obj.type === 'end_mountain' || obj.type === 'start_tunnel') {
          const isEnd = obj.type === 'end_mountain';
          const tunnelW = 800; // Narrower to look like doors
          const tunnelH = 1200; // Taller
          const archThickness = 80;

          const drawArchPath = (expand: number = 0) => {
            const w = tunnelW / 2 + expand;
            const h = tunnelH + expand;
            const archRadius = w;
            const straightH = h - archRadius;
            
            ctx.beginPath();
            ctx.moveTo(-w, 0);
            ctx.lineTo(-w, -straightH);
            ctx.arc(0, -straightH, archRadius, Math.PI, 0);
            ctx.lineTo(w, 0);
            ctx.closePath();
          };

          // Draw Outer Frame
          drawArchPath(archThickness);
          ctx.fillStyle = '#2a2d34';
          ctx.fill();
          
          ctx.lineWidth = 6;
          ctx.strokeStyle = '#FFD700'; // Gold trim
          ctx.stroke();

          // Draw the Doors (Always closed, static)
          ctx.save();
          drawArchPath(0);
          ctx.clip();
          
          // Wood background (Rich brown)
          ctx.fillStyle = '#4A2E1B';
          ctx.fill();
          
          // Center gap
          ctx.strokeStyle = '#111';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -tunnelH);
          ctx.stroke();
          
          // Simple handles
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(-40, -tunnelH * 0.5, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(40, -tunnelH * 0.5, 15, 0, Math.PI * 2);
          ctx.fill();
          
          // Glowing effect when ready to enter
          if (isEnd && hasSelectedPhrase) {
            const glowGrad = ctx.createRadialGradient(0, -tunnelH/2, 0, 0, -tunnelH/2, tunnelW/2);
            glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
            glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(-tunnelW/2, -tunnelH, tunnelW, tunnelH);
          }
          
          ctx.restore();

          // Interaction
          if (isEnd) {
            const distToPlayer = Math.sqrt(Math.pow(obj.x - playerState.current.x, 2) + Math.pow(obj.z - playerState.current.z, 2));
            if (distToPlayer < 1000 && distToPlayer < closestInteractionDist && appState === 'PLAYING') {
              closestInteractionDist = distToPlayer;
              if (hasSelectedPhrase) {
                interactionText = 'Presiona E para entrar al túnel';
                interactionAction = () => {
                  document.exitPointerLock();
                  onEnterTunnel();
                };
              } else {
                interactionText = 'Selecciona un arco para abrir el túnel';
              }
            }
          }
        }

        ctx.restore();
      });

      // Draw Particles
      ctx.globalAlpha = 1;
      particles.forEach((p, index) => {
        if (appState === 'PLAYING') {
          p.x += p.vx + Math.sin(p.life / 5) * 1.5; 
          p.y += p.vy;
          if (p.maxLife !== 999999) p.life -= 1; // Ambient particles don't die
        }

        if (p.life <= 0) {
          particles.splice(index, 1);
        } else {
          const proj = project(p.x, p.y, p.z);
          if (proj && proj.z > 0 && proj.z < drawDistance) {
            ctx.fillStyle = p.maxLife === 999999 ? p.color : `rgba(255, 215, 0, ${p.life / p.maxLife})`; 
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // 5. Fog Overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isConstruction) {
        // Light atmospheric haze for bright sunny day
        gradient.addColorStop(0, fogColor + '0.0)');
        gradient.addColorStop(0.8, fogColor + '0.0)');
        gradient.addColorStop(1, fogColor + '0.05)');
      } else if (isExploration) {
        // No fog in Phase 2
        gradient.addColorStop(0, fogColor + '0.0)');
        gradient.addColorStop(1, fogColor + '0.0)');
      } else {
        gradient.addColorStop(0, fogColor + '0.6)');
        gradient.addColorStop(0.5, fogColor + '0.3)');
        gradient.addColorStop(0.8, fogColor + '0.1)');
        gradient.addColorStop(1, fogColor + '0.5)'); // Thicker fog at the very bottom (ground mist)
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 5.5 Vignette (Shadows to hide map limits beyond the forest)
      if (!isConstruction) {
        const vignetteGrad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, canvas.height * 0.4,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.8
        );
        vignetteGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vignetteGrad.addColorStop(0.7, 'rgba(0,0,0,0.5)');
        vignetteGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = vignetteGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 6. On-Screen Indication (Left Panel for Selected Phrases)
      if (selectedPhrases.length > 0 && appState === 'PLAYING' && stage !== 'NIEBLA' && stage !== 'EXPLORACION') {
        const panelWidth = isMobile ? 220 : 320;
        
        // Draw panel background
        ctx.fillStyle = 'rgba(10, 15, 20, 0.85)';
        ctx.fillRect(0, 0, panelWidth, canvas.height);
        
        // Draw panel border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(panelWidth, 0);
        ctx.lineTo(panelWidth, canvas.height);
        ctx.stroke();

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${isMobile ? '16px' : '22px'} "Playfair Display", serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        let panelTitle = 'Selección:';
        if (!isMobile) {
          if (stage === 'NIEBLA') panelTitle = 'Emociones identificadas:';
          if (stage === 'EXPLORACION') panelTitle = 'Acciones a tomar:';
          if (stage === 'CLARIDAD') panelTitle = 'Ejercicios de claridad:';
        }
        ctx.fillText(panelTitle, 20, 40);
        
        // Divider
        ctx.beginPath();
        ctx.moveTo(20, 75);
        ctx.lineTo(panelWidth - 20, 75);
        ctx.stroke();

        // List phrases
        ctx.font = `${isMobile ? '12px' : '15px'} "Inter", sans-serif`;
        ctx.fillStyle = '#FFF8DC';
        let currentY = 100;
        
        selectedPhrases.forEach((phrase, idx) => {
          ctx.fillStyle = '#FFD700';
          ctx.fillText(`${idx + 1}.`, 20, currentY);
          ctx.fillStyle = '#FFF8DC';
          currentY = wrapText(ctx, phrase, 40, currentY, panelWidth - 60, isMobile ? 18 : 24);
          currentY += isMobile ? 10 : 15; // Spacing between phrases
        });
      }

      // 7. Interaction UI
      if (interactionText && appState === 'PLAYING') {
        const isNiebla = stage === 'NIEBLA';
        const isExploracion = stage === 'EXPLORACION';
        const isClaridad = stage === 'CLARIDAD';
        const boxWidth = isMobile ? 320 : 400;
        const boxHeight = 50;
        const startX = canvas.width/2 - boxWidth/2;
        const startY = canvas.height - 120;
        
        ctx.fillStyle = isNiebla ? 'rgba(15, 30, 22, 0.8)' : (isExploracion ? 'rgba(25, 21, 34, 0.8)' : (isClaridad ? 'rgba(10, 25, 26, 0.95)' : 'rgba(0, 0, 0, 0.75)'));
        ctx.beginPath();
        ctx.roundRect(startX, startY, boxWidth, boxHeight, 25);
        ctx.fill();
        
        if (isNiebla) {
          ctx.strokeStyle = '#1B3024';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (isExploracion) {
          ctx.strokeStyle = '#3D1C34';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (isClaridad) {
          ctx.strokeStyle = 'rgba(0, 230, 118, 0.5)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        ctx.fillStyle = isNiebla ? '#8BE8B9' : (isExploracion ? '#FF9CB1' : (isClaridad ? '#00E676' : 'white'));
        ctx.font = 'bold 16px "Inter", sans-serif';
        if (isNiebla) {
           ctx.shadowColor = 'rgba(139, 232, 185, 0.4)';
           ctx.shadowBlur = 10;
        } else if (isExploracion) {
           ctx.shadowColor = 'rgba(255, 156, 177, 0.4)';
           ctx.shadowBlur = 10;
        } else if (isClaridad) {
           ctx.shadowColor = 'rgba(0, 230, 118, 0.4)';
           ctx.shadowBlur = 10;
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(interactionText, canvas.width/2, canvas.height - 95);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        if (keys.current['e'] && interactionAction) {
          keys.current['e'] = false; // debounce
          interactionAction();
        }
      }

      // Crosshair
      if (appState === 'PLAYING') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 - 10, canvas.height/2);
        ctx.lineTo(canvas.width/2 + 10, canvas.height/2);
        ctx.moveTo(canvas.width/2, canvas.height/2 - 10);
        ctx.lineTo(canvas.width/2, canvas.height/2 + 10);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [stage, appState, onPhraseSelect, phrases, hasSelectedPhrase, onEnterTunnel]);

  const handleJoystickStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchControls.current.joystickActive = true;
    touchControls.current.joystickStart = { x: touch.clientX, y: touch.clientY };
    touchControls.current.joystickCurrent = { x: touch.clientX, y: touch.clientY };
  };

  const handleJoystickMove = (e: React.TouchEvent) => {
    if (!touchControls.current.joystickActive) return;
    const touch = e.touches[0];
    touchControls.current.joystickCurrent = { x: touch.clientX, y: touch.clientY };
    
    if (joystickKnobRef.current) {
      const dx = touch.clientX - touchControls.current.joystickStart.x;
      const dy = touch.clientY - touchControls.current.joystickStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 40;
      const limitedDx = (dx / dist) * Math.min(dist, maxDist);
      const limitedDy = (dy / dist) * Math.min(dist, maxDist);
      joystickKnobRef.current.style.transform = `translate(${limitedDx}px, ${limitedDy}px)`;
    }
  };

  const handleJoystickEnd = () => {
    touchControls.current.joystickActive = false;
    if (joystickKnobRef.current) {
      joystickKnobRef.current.style.transform = 'translate(0, 0)';
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden touch-none">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ cursor: appState === 'PLAYING' ? 'none' : 'default' }}
      />
      
      {isMobile && appState === 'PLAYING' && (
        <>
          {/* Movement Arrows (Left Side) */}
          <div className="absolute bottom-12 left-12 flex flex-col gap-4 z-40">
            <button 
              className="w-16 h-16 bg-black/40 border-2 border-[#00E676]/50 rounded-xl flex items-center justify-center active:bg-[#FFD700]/20 active:scale-95 transition-all"
              onTouchStart={(e) => { e.preventDefault(); touchControls.current.moveForward = true; }}
              onTouchEnd={(e) => { e.preventDefault(); touchControls.current.moveForward = false; }}
            >
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-[#FFD700]"></div>
            </button>
            <button 
              className="w-16 h-16 bg-black/40 border-2 border-[#00E676]/50 rounded-xl flex items-center justify-center active:bg-[#FFD700]/20 active:scale-95 transition-all"
              onTouchStart={(e) => { e.preventDefault(); touchControls.current.moveBackward = true; }}
              onTouchEnd={(e) => { e.preventDefault(); touchControls.current.moveBackward = false; }}
            >
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#FFD700]"></div>
            </button>
          </div>

          {/* Camera Joystick (Right Side) */}
          <div 
            ref={joystickRef}
            className="absolute bottom-12 right-12 w-32 h-32 bg-black/40 border-2 border-[#00E676]/30 rounded-full flex items-center justify-center z-40"
            onTouchStart={handleJoystickStart}
            onTouchMove={handleJoystickMove}
            onTouchEnd={handleJoystickEnd}
          >
            <div 
              ref={joystickKnobRef}
              className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#B8860B] rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] pointer-events-none transition-transform duration-75"
            ></div>
            <div className="absolute -top-8 text-[#FFD700] text-[10px] font-bold uppercase tracking-widest opacity-60">Cámara</div>
          </div>

          {/* Mobile Interaction Button (Center Right) */}
          <button 
            className="absolute top-1/2 right-8 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-[#B8860B] to-[#FFD700] rounded-full flex items-center justify-center z-40 shadow-[0_0_20px_rgba(255,215,0,0.4)] active:scale-90 transition-all border-4 border-[#2A1408]"
            onTouchStart={(e) => {
              e.preventDefault();
              keys.current['e'] = true;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              keys.current['e'] = false;
            }}
          >
            <span className="text-[#2A1408] font-black text-xl">E</span>
          </button>

          {/* Mobile Phase Buttons (Top Right) */}
          <div className="absolute top-8 right-8 flex flex-col gap-3 z-40 items-end">
             {stage === 'EXPLORACION' && (
               <button 
                 className="px-4 py-2 bg-black/60 border border-[#00E676] text-[#FFD700] rounded-lg text-xs font-bold uppercase tracking-wider active:bg-[#FFD700]/20"
                 onTouchStart={(e) => {
                   e.preventDefault();
                   onOpenReflections?.();
                 }}
               >
                 Reflexionar
               </button>
             )}
             {stage === 'CLARIDAD' && (
               <button 
                 className="px-4 py-2 bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#2A1408] rounded-lg text-xs font-bold uppercase tracking-wider active:scale-95"
                 onTouchStart={(e) => {
                   e.preventDefault();
                   onOpenHelp?.();
                 }}
               >
                 Ayuda Creativa
               </button>
             )}
             <button 
               className="px-4 py-2 bg-black/40 border border-[#00E676]/50 text-white/80 rounded-lg text-xs font-bold uppercase tracking-wider active:bg-white/10"
               onTouchStart={(e) => {
                 e.preventDefault();
                 onOpenMenu?.();
               }}
             >
               Menú
             </button>
          </div>
        </>
      )}
    </div>
  );
};
