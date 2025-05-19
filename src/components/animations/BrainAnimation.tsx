"use client";

import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';

// We'll use a simple placeholder until we can add a real brain animation
// In a real app, you'd want to download a proper brain animation JSON
const placeholderAnimation = {
  v: "5.7.6",
  fr: 30,
  ip: 0,
  op: 120,
  w: 512,
  h: 512,
  nm: "Brain",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "BrainPulse",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [50], e: [80] },
            { t: 60, s: [80], e: [50] },
            { t: 120, s: [50] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [256, 256, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100], e: [105, 105] },
            { t: 60, s: [105, 105], e: [100, 100] },
            { t: 120, s: [100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [200, 200] },
              d: 1,
              nm: "Ellipse"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.6, 0.4, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 10 },
              lc: 2,
              lj: 2,
              bm: 0,
              nm: "Stroke"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.6, 0.4, 1, 0.3] },
              o: { a: 0, k: 30 },
              r: 1,
              bm: 0,
              nm: "Fill"
            }
          ],
          nm: "Ellipse",
          np: 3
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "BrainConnections",
      sr: 1,
      ks: {
        o: { a: 0, k: 70 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [10] },
            { t: 60, s: [10], e: [0] },
            { t: 120, s: [0] }
          ]
        },
        p: { a: 0, k: [256, 256, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sr",
              sy: 1,
              d: 1,
              pt: { a: 0, k: 5 },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              or: { a: 0, k: 90 },
              os: { a: 0, k: 0 },
              ix: 1,
              nm: "Polystar"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.4, 0.6, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
              lc: 2,
              lj: 2,
              bm: 0,
              nm: "Stroke"
            }
          ],
          nm: "Polystar",
          np: 2
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Neurons",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [70], e: [100] },
            { t: 60, s: [100], e: [70] },
            { t: 120, s: [70] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [256, 256, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [80, 80], e: [90, 90] },
            { t: 60, s: [90, 90], e: [80, 80] },
            { t: 120, s: [80, 80] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sr",
              sy: 1,
              d: 1,
              pt: { a: 0, k: 8 },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              or: { a: 0, k: 50 },
              os: { a: 0, k: 0 },
              ix: 1,
              nm: "Polystar"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.8, 0.4, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 6 },
              lc: 2,
              lj: 2,
              bm: 0,
              nm: "Stroke"
            }
          ],
          nm: "Polystar",
          np: 2
        }
      ],
      ip: 0,
      op: 120,
      st: 0,
      bm: 0
    }
  ],
  markers: []
};

export default function BrainAnimation() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a placeholder until the component is mounted
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-50 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main brain animation */}
      <Lottie
        loop
        animationData={placeholderAnimation}
        play
        style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500 rounded-full filter blur-[80px] opacity-30 animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-blue-500 rounded-full filter blur-[60px] opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-pink-500 rounded-full filter blur-[70px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Neural network connections */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g className="animate-pulse" style={{ animationDuration: '3s' }}>
            <path d="M250 150 L150 250 L250 350 L350 250 Z" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="2" />
            <path d="M250 200 L200 250 L250 300 L300 250 Z" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="2" />
          </g>
          <g className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <circle cx="250" cy="150" r="8" fill="rgba(168, 85, 247, 0.8)" />
            <circle cx="150" cy="250" r="8" fill="rgba(59, 130, 246, 0.8)" />
            <circle cx="250" cy="350" r="8" fill="rgba(236, 72, 153, 0.8)" />
            <circle cx="350" cy="250" r="8" fill="rgba(168, 85, 247, 0.8)" />
          </g>
        </svg>
      </div>
    </div>
  );
} 