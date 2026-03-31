import React, { useEffect, useRef, useState } from 'react';

const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            if (glowRef.current) {
                glowRef.current.style.left = `${e.clientX}px`;
                glowRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let W = window.innerWidth;
        let H = window.innerHeight;

        const resize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            x: number = 0;
            y: number = 0;
            r: number = 0;
            vx: number = 0;
            vy: number = 0;
            alpha: number = 0;
            pulse: number = 0;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * W;
                this.y = Math.random() * H;
                this.r = Math.random() * 1.2 + 0.3;
                this.vx = (Math.random() - 0.5) * 0.15;
                this.vy = (Math.random() - 0.5) * 0.15;
                this.alpha = Math.random() * 0.4 + 0.1;
                this.pulse = Math.random() * Math.PI * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += 0.008;
                if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
                    this.reset();
                }
            }

            draw(ctx: CanvasRenderingContext2D) {
                const a = this.alpha * (0.6 + 0.4 * Math.sin(this.pulse));
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 136, 42, ${a})`;
                ctx.fill();
            }
        }

        const particles: Particle[] = [];
        for (let i = 0; i < 90; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, W, H);
            
            // Draw connections
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 136, 42, ${0.05 * (1 - dist / 80)})`;
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <div 
                ref={glowRef}
                id="cursor-glow"
                className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[1] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
                style={{
                    background: 'radial-gradient(circle, rgba(212,136,42,0.06) 0%, transparent 70%)',
                }}
            />
            <canvas 
                ref={canvasRef}
                id="bg-canvas"
                className="fixed inset-0 -z-10 pointer-events-none bg-[#0e0b09]"
            />
        </>
    );
};

export default AnimatedBackground;
