"use client"
import React from 'react';
import { useWindowSize } from "@uidotdev/usehooks";
export interface Star extends Coordinate {
    radius: number;
    vx: number;
    vy: number;
    color: string;
}
export interface Coordinate {
    x: number;
    y: number;
}
export interface StarsProps {
    stars: Star[];
    FPS: number;
    numStars: number;
    mouse: {
        x: number;
        y: number;
    };
    velMax: number;
    mDistance: number;
    friction: number;
}

export const defaultStars = {
    stars: [] as Star[],
    FPS: 30,
    numStars: 150,
    mouse: {
        x: 0,
        y: 0,
    },
    velMax: 10,
    mDistance: 35,
    friction: 1.2,
} as StarsProps

function clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
}

function pushAwayFromWall(s: Star, canvas: HTMLCanvasElement) {
    // if the star is against a wall, but doesnt have a velocity away from the wall, give it one
    if (s.x <= 0 && s.vx <= 0) s.vx = Math.abs(s.vx);
    if (s.x >= canvas.width && s.vx >= 0) s.vx = -Math.abs(s.vx);
    if (s.y <= 0 && s.vy <= 0) s.vy = Math.abs(s.vy);
    if (s.y >= canvas.height && s.vy >= 0) s.vy = -Math.abs(s.vy);
}

export const Stars: React.FC<StarsProps> = (initStars) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [Stars, setStars] = React.useState(initStars);
    const size = useWindowSize();

    if (Stars.stars.length === 0) {
        // Initialize stars
        const stars = [] as Star[];
        for (let i = 0; i < Stars.numStars; i++) {
            stars.push({
                x: Math.random() * (size.width ?? 1920),
                y: Math.random() * (size.height ?? 1080),
                radius: Math.random() * 2 + 1,
                vx: Math.floor(Math.random() * 10) - 5,
                vy: Math.floor(Math.random() * 10) - 5,
                color: 'white',
            } as Star);
        setStars({
            ...Stars,
            stars: stars,
        })
        }
    }
    /**
     * Calculate the distance between two points.
     */
    const distance = ( point1: Star | Coordinate, point2: Star | Coordinate) => {
        let xs = 0;
        let ys = 0;
        xs = point2.x - point1.x;
        xs *= xs;
        ys = point2.y - point1.y;
        ys *= ys;
        return Math.sqrt(xs + ys);
    }

    const draw = React.useCallback((ctx: CanvasRenderingContext2D ) => {
        if (!size.width || !size.height) {
            size.height = 1080
            size.width = 1920
        }
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < Stars.numStars; i++) {
            const s = Stars.stars[i];
            ctx.fillStyle = s.color ?? '#999';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = 'black';
            ctx.stroke();
        }

        ctx.beginPath();
        for (let i = 0, x = Stars.stars.length; i < x; i++) {
            const starI = Stars.stars[i];
            ctx.moveTo(starI.x, starI.y);
            if (distance(Stars.mouse, starI) < Stars.mDistance) ctx.lineTo(Stars.mouse.x, Stars.mouse.y);
            for (let j = 0, x = Stars.stars.length; j < x; j++) {
                const starII = Stars.stars[j];
                if (distance(starI, starII) < 150) {
                    ctx.lineTo(starII.x, starII.y);
                }
            }
        }
        ctx.lineWidth = 0.05;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }, [Stars, size]);

    const mouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setStars({
            ...Stars,
            mouse: {
                x: e.clientX,
                y: e.clientY,
            }
        })
    }

    React.useLayoutEffect(() => {
        if (!canvasRef) return; // guard rail
        const canvas = canvasRef.current;
        if (!canvas) return; // guard rail
        const ctx = canvas.getContext('2d');
        if (!ctx) return; // guard rail
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        for (let i = 0; i < Stars.numStars; i++) {
            const s = Stars.stars[i];
            if (s.x > window.innerWidth || s.x < 0) {
                s.x = clamp(s.x, 0, window.innerWidth);
                s.vx = -s.vx;
                pushAwayFromWall(s, canvas);
            }
            if (s.y > window.innerHeight || s.y < 0) {
                s.y = clamp(s.y, 0, window.innerHeight);
                s.vy = -s.vy;
                pushAwayFromWall(s, canvas);
            }
            s.x += s.vx / Stars.FPS;
            s.y += s.vy / Stars.FPS;

            if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
            if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
            if (distance(s,Stars.mouse) < Stars.mDistance) {
                const dx = s.x - Stars.mouse.x;
                const dy = s.y - Stars.mouse.y;
                // const angle = Math.atan2(dy, dx);
                const magnitude = Math.sqrt(dx * dx + dy * dy);
                if (magnitude < Stars.mDistance) {
                    const udx = dx / magnitude;
                    const udy = dy / magnitude;
                    const sdx = udx * Stars.mDistance;
                    const sdy = udy * Stars.mDistance;
                    const speedFactor = (Stars.mDistance - magnitude) / Stars.mDistance;
                    s.x += udx * speedFactor * (Stars.mDistance - magnitude);
                    s.y += udy * speedFactor * (Stars.mDistance - magnitude);
                    s.vx += sdx * speedFactor * (Stars.mDistance - magnitude);
                    s.vy += sdy * speedFactor * (Stars.mDistance - magnitude);
                }
            }
            const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
            if (speed > Stars.velMax / 2) {
                const excessSpeedRatio = (Stars.velMax / 2) / speed;
                s.vx *= excessSpeedRatio * Stars.friction;
                s.vy *= excessSpeedRatio * Stars.friction;
            }
        }
        draw(ctx)
    }, [draw, Stars])
    return (<canvas className='absolute left-0 top-0 w-full h-full -z-50' ref={canvasRef} onMouseMove={mouseMove}></canvas>);
};

export default Stars;
