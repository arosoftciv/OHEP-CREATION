import React from 'react';
import {C} from '../theme';

export const PhoneIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill={C.red} />
    <path d="M 16 12 L 21 12 L 23 19 L 20 21 Q 22 26 27 28 L 29 25 L 36 27 L 36 32 Q 34 36 30 35 Q 15 31 13 17 Q 12 13 16 12 Z" fill="#FFF" />
  </svg>
);

export const ChatIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill="#25A244" />
    <path d="M 24 11 Q 36 11 37 23 Q 37 35 24 35 Q 20 35 17 33 L 11 36 L 13 30 Q 11 27 11 23 Q 12 11 24 11 Z" fill="none" stroke="#FFF" strokeWidth={3} />
    <path d="M 19 18 L 21 18 L 22 21 L 21 22 Q 22 25 25 26 L 26 25 L 29 26 L 29 28 Q 28 30 26 29 Q 19 27 18 20 Z" fill="#FFF" />
  </svg>
);

export const GlobeIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill={C.green} />
    <circle cx={24} cy={24} r={13} fill="none" stroke="#FFF" strokeWidth={3} />
    <ellipse cx={24} cy={24} rx={6} ry={13} fill="none" stroke="#FFF" strokeWidth={3} />
    <line x1={11} y1={24} x2={37} y2={24} stroke="#FFF" strokeWidth={3} />
  </svg>
);

export const BellIcon: React.FC<{size: number; color?: string; ring?: number}> = ({size, color = C.white, ring = 0}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <g transform={`rotate(${ring} 0 -38)`}>
      <path d="M -26 18 L -26 -6 Q -26 -32 0 -34 Q 26 -32 26 -6 L 26 18 L 34 26 L -34 26 Z" fill={color} />
      <circle cx={0} cy={-38} r={6} fill={color} />
      <path d="M -10 30 Q 0 42 10 30 Z" fill={color} />
    </g>
  </svg>
);

export const Hand: React.FC<{press: number}> = ({press}) => (
  <svg width={110} height={130} viewBox="0 0 110 130" style={{transform: `scale(${1 - 0.12 * press})`, transformOrigin: '30% 10%', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.35))'}}>
    <path
      d="M 30 8 Q 40 4 44 14 L 44 52 L 50 50 Q 58 48 60 56 L 66 54 Q 74 52 76 60 L 82 59 Q 92 58 92 70 L 92 96 Q 90 120 66 124 L 50 124 Q 34 122 24 104 L 8 76 Q 4 66 14 64 Q 20 63 24 70 L 28 76 L 28 16 Q 28 10 30 8 Z"
      fill="#FFFFFF"
      stroke="#1A1A1A"
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </svg>
);

export const UserPlus: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={20} cy={16} r={9} fill="#FFF" />
    <path d="M 4 42 Q 6 28 20 28 Q 34 28 36 42 Z" fill="#FFF" />
    <path d="M 40 14 L 40 28 M 33 21 L 47 21" stroke="#FFF" strokeWidth={4} strokeLinecap="round" />
  </svg>
);

export const MailIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={24} fill={C.redDark} />
    <rect x={11} y={15} width={26} height={18} rx={3} fill="none" stroke="#FFF" strokeWidth={3} />
    <path d="M 12 17 L 24 26 L 36 17" fill="none" stroke="#FFF" strokeWidth={3} strokeLinejoin="round" />
  </svg>
);
