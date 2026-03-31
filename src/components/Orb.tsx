import React, { useEffect, useRef } from 'react';

const Orb = () => {
  const orbCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const orbCanvas = orbCanvasRef.current;
    if (!orbCanvas) return;
    const ctx = orbCanvas.getContext('2d');
    if (!ctx) return;

    const SIZE = 420;
    orbCanvas.width = SIZE;
    orbCanvas.height = SIZE;
    const CX = SIZE / 2, CY = SIZE / 2, R = 150;
    let t = 0;

    // 3D sphere points
    const points: any[] = [];
    for (let lat = -80; lat <= 80; lat += 15) {
      for (let lon = 0; lon < 360; lon += 15) {
        const phi = (lat * Math.PI) / 180;
        const theta = (lon * Math.PI) / 180;
        points.push({
          x: Math.cos(phi) * Math.cos(theta),
          y: Math.cos(phi) * Math.sin(theta),
          z: Math.sin(phi),
        });
      }
    }

    const symbolDots: any[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      symbolDots.push({
        x: Math.cos(angle) * 0.45,
        y: Math.sin(angle) * 0.45,
        z: 0,
      });
    }

    function rotateY(p: any, angle: number) {
      const cos = Math.cos(angle), sin = Math.sin(angle);
      return {
        x: p.x * cos - p.z * sin,
        y: p.y,
        z: p.x * sin + p.z * cos,
      };
    }

    function rotateX(p: any, angle: number) {
      const cos = Math.cos(angle), sin = Math.sin(angle);
      return {
        x: p.x,
        y: p.y * cos - p.z * sin,
        z: p.y * sin + p.z * cos,
      };
    }

    let animationFrameId: number;

    function drawOrb() {
      ctx!.clearRect(0, 0, SIZE, SIZE);
      t += 0.004;

      // Ambient glow
      const grd = ctx!.createRadialGradient(CX, CY, 0, CX, CY, R * 1.6);
      grd.addColorStop(0, 'rgba(212,136,42,0.10)');
      grd.addColorStop(0.5, 'rgba(180,100,20,0.05)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx!.fillStyle = grd;
      ctx!.beginPath();
      ctx!.arc(CX, CY, R * 1.6, 0, Math.PI * 2);
      ctx!.fill();

      // Core sphere
      const sphereGrd = ctx!.createRadialGradient(CX - 40, CY - 40, 20, CX, CY, R);
      sphereGrd.addColorStop(0, 'rgba(60,45,30,0.9)');
      sphereGrd.addColorStop(0.5, 'rgba(35,25,18,0.95)');
      sphereGrd.addColorStop(1, 'rgba(20,15,10,0.98)');
      ctx!.fillStyle = sphereGrd;
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, Math.PI * 2);
      ctx!.fill();

      // Border
      ctx!.strokeStyle = 'rgba(212,136,42,0.25)';
      ctx!.lineWidth = 0.5;
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, Math.PI * 2);
      ctx!.stroke();

      // Dots
      const sorted = points.map(p => {
        let r = rotateY(p, t);
        r = rotateX(r, t * 0.4);
        return { ...r };
      }).sort((a, b) => a.z - b.z);

      sorted.forEach(p => {
        const scale = (p.z + 1) / 2;
        const px = CX + p.x * R;
        const py = CY + p.y * R;
        const alpha = 0.1 + scale * 0.6;
        const size = 0.8 + scale * 1.4;

        if (p.z > -0.1) {
          ctx!.beginPath();
          ctx!.arc(px, py, size, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(212,136,42,${alpha})`;
          ctx!.fill();
        }
      });

      // Hexagon
      const innerR = 55;
      const hexPoints = symbolDots.map(p => {
        let r = rotateY(p, t * 0.6);
        r = rotateX(r, t * 0.25);
        return r;
      });

      ctx!.beginPath();
      hexPoints.forEach((p, i) => {
        const px = CX + p.x * innerR * (p.z + 1.5) * 0.6;
        const py = CY + p.y * innerR * (p.z + 1.5) * 0.6;
        if (i === 0) ctx!.moveTo(px, py);
        else ctx!.lineTo(px, py);
      });
      ctx!.closePath();
      ctx!.strokeStyle = `rgba(212,136,42,${0.5 + 0.3 * Math.sin(t * 2)})`;
      ctx!.stroke();

      // Core
      const coreGrd = ctx!.createRadialGradient(CX, CY, 0, CX, CY, 28);
      coreGrd.addColorStop(0, `rgba(240,168,74,${0.8 + 0.2 * Math.sin(t * 3)})`);
      coreGrd.addColorStop(0.4, 'rgba(212,136,42,0.6)');
      coreGrd.addColorStop(1, 'rgba(212,136,42,0)');
      ctx!.fillStyle = coreGrd;
      ctx!.beginPath();
      ctx!.arc(CX, CY, 28, 0, Math.PI * 2);
      ctx!.fill();

      // Core dot
      ctx!.beginPath();
      ctx!.arc(CX, CY, 8, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255,200,100,${0.9 + 0.1 * Math.sin(t * 4)})`;
      ctx!.fill();

      animationFrameId = requestAnimationFrame(drawOrb);
    }
    drawOrb();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={orbCanvasRef} className="w-full h-full" />;
};

export default Orb;
