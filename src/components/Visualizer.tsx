import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { tokenize, Parser, evaluateAST } from "../utils/mathParser";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface VisualizerRef {
  triggerParticles: (clientX?: number, clientY?: number, themeColor?: string) => void;
}

interface VisualizerProps {
  graphExpression: string | null; // Expression to plot (e.g., "sin(x)"), or null if standard mode
  theme: string;
}

const Visualizer = forwardRef<VisualizerRef, VisualizerProps>(
  ({ graphExpression, theme }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Graph plotting view state (pan & zoom)
    const [scale, setScale] = useState<number>(35); // Pixels per unit
    const [offsetX, setOffsetX] = useState<number>(0); // Center offset X
    const [offsetY, setOffsetY] = useState<number>(0); // Center offset Y
    const isDragging = useRef<boolean>(false);
    const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Particles list
    const particlesRef = useRef<Particle[]>([]);

    // Expose particle trigger function to the parent component
    useImperativeHandle(ref, () => ({
      triggerParticles(clientX, clientY, themeColor) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        let spawnX = canvas.width / 2;
        let spawnY = canvas.height / 2;

        if (clientX !== undefined && clientY !== undefined) {
          // Translate page coordinates to canvas coordinate space
          spawnX = ((clientX - rect.left) / rect.width) * canvas.width;
          spawnY = ((clientY - rect.top) / rect.height) * canvas.height;
        }

        // Color palette based on theme
        const colors = themeColor
          ? [themeColor]
          : theme === "cyberpunk"
          ? ["#00f0ff", "#ff007f", "#39ff14", "#ff00f0"]
          : theme === "terminal"
          ? ["#33ff33", "#00ff00", "#11aa11", "#88ff88"]
          : theme === "aurora"
          ? ["#4facfe", "#00f2fe", "#7f00ff", "#ff007f"]
          : ["#ffffff", "#e0e0e0", "#b3cdd1", "#9fa8a3"];

        // Spawn a burst of 15-25 particles
        const count = 15 + Math.floor(Math.random() * 10);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 4;
          const maxLife = 40 + Math.floor(Math.random() * 30);
          particlesRef.current.push({
            x: spawnX,
            y: spawnY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (0.5 + Math.random() * 1.5), // slight upward draft
            size: 2 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            life: maxLife,
            maxLife,
          });
        }
      },
    }));

    // Reset graph offset when expression changes or mode toggles
    useEffect(() => {
      setOffsetX(0);
      setOffsetY(0);
      setScale(35);
    }, [graphExpression]);

    // Handle mouse drag-to-pan in graphing mode
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!graphExpression) return;
      isDragging.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging.current || !graphExpression) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffsetX((prev) => prev + dx);
      setOffsetY((prev) => prev + dy);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUpOrLeave = () => {
      isDragging.current = false;
    };

    // Handle mouse wheel zoom
    const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
      if (!graphExpression) return;
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      setScale((prev) => Math.max(10, Math.min(200, prev * zoomFactor)));
    };

    // Canvas animation loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationId: number;

      // Handle high DPI displays
      const resizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      // Animation frame render function
      const render = () => {
        const w = canvas.width / window.devicePixelRatio;
        const h = canvas.height / window.devicePixelRatio;

        // 1. Clear background
        ctx.clearRect(0, 0, w, h);

        // 2. Draw Math Graph (if enabled)
        if (graphExpression) {
          drawGraph(ctx, w, h);
        } else {
          // Draw subtle ambient sound wave when not graphing
          drawAmbientWave(ctx, w, h);
        }

        // 3. Update and Draw Particles
        drawParticles(ctx);

        animationId = requestAnimationFrame(render);
      };

      // Helper: Draw ambient sound wave
      let frameCount = 0;
      const drawAmbientWave = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        frameCount++;
        ctx.beginPath();
        ctx.lineWidth = 2;

        let strokeStyle = "rgba(255, 255, 255, 0.15)";
        if (theme === "cyberpunk") strokeStyle = "rgba(0, 240, 255, 0.2)";
        if (theme === "terminal") strokeStyle = "rgba(51, 255, 51, 0.2)";
        if (theme === "aurora") strokeStyle = "rgba(127, 0, 255, 0.25)";

        ctx.strokeStyle = strokeStyle;

        const centerY = h - 20; // draw at the bottom screen separator
        ctx.moveTo(0, centerY);

        for (let x = 0; x < w; x++) {
          const angle1 = (x / w) * Math.PI * 4 + frameCount * 0.03;
          const angle2 = (x / w) * Math.PI * 8 - frameCount * 0.015;
          const y = centerY + Math.sin(angle1) * 8 + Math.cos(angle2) * 4;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      // Helper: Draw particles
      const drawParticles = (ctx: CanvasRenderingContext2D) => {
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // gravity
          p.life--;
          p.alpha = Math.max(0, p.life / p.maxLife);

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;

          // Add glowing shadow for Neon theme particles
          if (theme === "cyberpunk" || theme === "terminal") {
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      };

      // Helper: Graphing function
      const drawGraph = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        const originX = w / 2 + offsetX;
        const originY = h / 2 + offsetY;

        // Theme colors
        let gridColor = "rgba(255, 255, 255, 0.08)";
        let axisColor = "rgba(255, 255, 255, 0.3)";
        let curveColor = "#00ffff";
        let textColor = "rgba(255, 255, 255, 0.4)";

        if (theme === "cyberpunk") {
          gridColor = "rgba(0, 240, 255, 0.08)";
          axisColor = "rgba(255, 0, 127, 0.4)";
          curveColor = "#00f0ff";
          textColor = "#00f0ff";
        } else if (theme === "terminal") {
          gridColor = "rgba(0, 255, 0, 0.08)";
          axisColor = "rgba(0, 255, 0, 0.35)";
          curveColor = "#33ff33";
          textColor = "#00ff00";
        } else if (theme === "aurora") {
          gridColor = "rgba(79, 172, 254, 0.1)";
          axisColor = "rgba(127, 0, 255, 0.4)";
          curveColor = "#ff007f";
          textColor = "#7f00ff";
        } else if (theme === "glass") {
          gridColor = "rgba(0, 0, 0, 0.05)";
          axisColor = "rgba(0, 0, 0, 0.25)";
          curveColor = "#1d4ed8";
          textColor = "rgba(0, 0, 0, 0.5)";
        }

        // Draw grid lines
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.font = "9px monospace";
        ctx.fillStyle = textColor;

        // Vertical gridlines
        const leftBoundary = Math.floor(-originX / scale);
        const rightBoundary = Math.ceil((w - originX) / scale);
        for (let u = leftBoundary; u <= rightBoundary; u++) {
          if (u === 0) continue;
          const x = originX + u * scale;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();

          // Labels on X axis
          if (originY > 10 && originY < h - 10) {
            ctx.fillText(u.toString(), x - 4, originY + 12);
          } else {
            ctx.fillText(u.toString(), x - 4, h - 5);
          }
        }

        // Horizontal gridlines
        const topBoundary = Math.floor(-originY / scale);
        const bottomBoundary = Math.ceil((h - originY) / scale);
        for (let u = topBoundary; u <= bottomBoundary; u++) {
          if (u === 0) continue;
          const y = originY + u * scale;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();

          // Labels on Y axis (inverted direction for standard graph Cartesian space)
          if (originX > 10 && originX < w - 10) {
            ctx.fillText((-u).toString(), originX + 6, y + 3);
          } else {
            ctx.fillText((-u).toString(), 5, y + 3);
          }
        }

        // Draw primary axes
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 1.5;

        // X-Axis
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(w, originY);
        ctx.stroke();

        // Y-Axis
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, h);
        ctx.stroke();

        // Origin (0,0) label
        ctx.fillText("0", originX - 10, originY + 12);

        // 3. Compile and Plot the Mathematical Expression
        try {
          const tokens = tokenize(graphExpression!);
          const parser = new Parser(tokens);
          const ast = parser.parse();

          ctx.beginPath();
          ctx.strokeStyle = curveColor;
          ctx.lineWidth = 2.5;

          // Glow effects for curves
          if (theme === "cyberpunk" || theme === "terminal") {
            ctx.shadowBlur = 12;
            ctx.shadowColor = curveColor;
          }

          let firstPoint = true;

          // Plot every pixel column along the width
          for (let pixelX = 0; pixelX < w; pixelX++) {
            // Translate pixel X coordinate to graph coordinate units
            const graphX = (pixelX - originX) / scale;

            try {
              // Evaluate AST with current x value
              const graphY = evaluateAST(ast, { x: graphX });

              // Ignore invalid values (NaN, Infinite)
              if (!isNaN(graphY) && isFinite(graphY)) {
                // Translate graph Y coordinate back to canvas pixels (note: Y coordinates are inverted in screen space)
                const pixelY = originY - graphY * scale;

                if (firstPoint) {
                  ctx.moveTo(pixelX, pixelY);
                  firstPoint = false;
                } else {
                  ctx.lineTo(pixelX, pixelY);
                }
              } else {
                firstPoint = true; // break path line if value is invalid
              }
            } catch (err) {
              firstPoint = true; // skip point
            }
          }
          ctx.stroke();
          ctx.shadowBlur = 0; // reset shadow glow
        } catch (err) {
          // If the math expression is currently invalid/half-typed, draw helper note
          ctx.save();
          ctx.fillStyle = theme === "terminal" ? "#00aa00" : "rgba(255, 255, 255, 0.4)";
          ctx.font = theme === "terminal" ? '12px "Share Tech Mono"' : '12px "Inter", sans-serif';
          ctx.fillText("Equation graph plotting...", 10, 20);
          ctx.restore();
        }
      };

      animationId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", resizeCanvas);
      };
    }, [graphExpression, scale, offsetX, offsetY, theme]);

    return (
      <canvas
        ref={canvasRef}
        className="visualizer-canvas"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          cursor: graphExpression ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
      />
    );
  }
);

Visualizer.displayName = "Visualizer";

export default Visualizer;
