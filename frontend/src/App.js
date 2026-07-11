import { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  ThemeProvider, createTheme, CssBaseline,
  Box, Typography, Button, TextField, Select, MenuItem,
  InputLabel, FormControl, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Snackbar, Alert, Slide, Grid, InputAdornment
} from '@mui/material';
import DarkModeIcon  from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const API_URL = 'http://localhost:3000/api';

/* ═══════════════════════════════════════════════════════════════
   ÍCONES SVG CUSTOM
═══════════════════════════════════════════════════════════════ */
const IcoShield = ({ s = 28, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
    <path d="M14 2.5L25 7v8.5C25 21 20 25.5 14 27 8 25.5 3 21 3 15.5V7Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="14" cy="13" r="3.5" stroke={c} strokeWidth="1.3"/>
    <line x1="14" y1="8" x2="14" y2="9.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="14" y1="16.5" x2="14" y2="18" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="9" y1="13" x2="10.5" y2="13" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="17.5" y1="13" x2="19" y2="13" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="14" cy="13" r="1.2" fill={c}/>
  </svg>
);
const IcoBadge = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <rect x="2" y="4" width="14" height="11" rx="2" stroke={c} strokeWidth="1.3"/>
    <rect x="6.5" y="2" width="5" height="3" rx="1" stroke={c} strokeWidth="1.2"/>
    <circle cx="9" cy="9.5" r="2" stroke={c} strokeWidth="1.2"/>
    <line x1="5.5" y1="13.5" x2="12.5" y2="13.5" stroke={c} strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);
const IcoPersonAdd = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <circle cx="7" cy="6" r="3" stroke={c} strokeWidth="1.3"/>
    <path d="M1.5 16c0-3.5 2.5-5.5 5.5-5.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="13" y1="10" x2="13" y2="16" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="10" y1="13" x2="16" y2="13" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IcoHistory = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="6.5" stroke={c} strokeWidth="1.3"/>
    <polyline points="9,5.5 9,9.5 12,11.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 5.5 L2 3 L4.5 3.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoPeople = ({ s = 22, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
    <circle cx="8" cy="7" r="3" stroke={c} strokeWidth="1.3"/>
    <path d="M2 19c0-4.5 2.7-6.5 6-6.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="15" cy="7" r="2.2" stroke={c} strokeWidth="1.2"/>
    <path d="M19.5 19c0-3.5-2-5.5-4.5-5.5" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IcoCheck = ({ s = 22, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
    <path d="M11 2L19.5 5.5v7C19.5 17 15.5 20 11 21 6.5 20 2.5 17 2.5 12.5v-7Z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/>
    <polyline points="7,11 10,14 15,9" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoLog = ({ s = 22, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
    <rect x="3" y="3" width="16" height="16" rx="2.5" stroke={c} strokeWidth="1.3"/>
    <line x1="7" y1="8" x2="15" y2="8" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="7" y1="11.5" x2="15" y2="11.5" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="7" y1="15" x2="12" y2="15" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const IcoBlock = ({ s = 22, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="8.5" stroke={c} strokeWidth="1.4"/>
    <line x1="4.5" y1="4.5" x2="17.5" y2="17.5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IcoNfc = ({ s = 14, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke={c} strokeWidth="1.1"/>
    <path d="M5 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2" stroke={c} strokeWidth="1.1" strokeLinecap="round"/>
    <circle cx="7" cy="7" r="1" fill={c}/>
  </svg>
);
const IcoDownload = ({ s = 16, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
    <line x1="8" y1="2" x2="8" y2="10.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    <polyline points="4.5,7.5 8,11 11.5,7.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="2" y1="14" x2="14" y2="14" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoWarn = ({ s = 26, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 26 26" fill="none">
    <polygon points="13,2 25,23 1,23" stroke={c} strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
    <line x1="13" y1="10" x2="13" y2="16" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="13" cy="20" r="1.2" fill={c}/>
  </svg>
);
const IcoCloud = ({ s = 64, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 64 64" fill="none">
    <path d="M46 46H22c-7 0-13-5.5-13-12.5 0-6.5 4.5-12 10.5-13C20.5 14.5 26 10 32.5 10c4.5 0 8.5 2 11 5.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M53 40c1.5-1.5 2-3.5 2-5.5 0-6-5-11-11-12" stroke={c} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <line x1="8" y1="8" x2="56" y2="56" stroke={c} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IcoSearch = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <circle cx="8" cy="8" r="5" stroke={c} strokeWidth="1.5"/>
    <line x1="12" y1="12" x2="16" y2="16" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcoFilter = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <polygon points="2,4 16,4 10,11 10,16 8,14 8,11" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
  </svg>
);
const IcoDomain = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <rect x="4" y="2" width="10" height="14" rx="1.5" stroke={c} strokeWidth="1.5"/>
    <path d="M7 6H8 M10 6H11 M7 9H8 M10 9H11 M7 12H8 M10 12H11" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
// NOVOS ÍCONES DE AUDITORIA
const IcoSort = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <path d="M5 11L9 15L13 11 M5 7L9 3L13 7" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoClock = ({ s = 18, c = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="6.5" stroke={c} strokeWidth="1.5"/>
    <path d="M9 5v4l2.5 2.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   ILUSTRAÇÕES SVG
═══════════════════════════════════════════════════════════════ */
const IlluDoor = ({ dark }) => {
  const a = dark ? '#ffb000' : '#6366f1';
  const b = dark ? 'rgba(255,176,0,0.12)' : 'rgba(99,102,241,0.1)';
  const d = dark ? 'rgba(255,176,0,0.35)' : 'rgba(99,102,241,0.5)';
  return (
    <svg width="170" height="150" viewBox="0 0 170 150" fill="none">
      <rect x="45" y="18" width="72" height="110" rx="4" stroke={a} strokeWidth="1.5" fill={b}/>
      <rect x="49" y="22" width="64" height="102" rx="3" stroke={d} strokeWidth="0.7" fill="none" strokeDasharray="4 3"/>
      <circle cx="107" cy="73" r="5" stroke={a} strokeWidth="1.5" fill="none"/>
      <line x1="112" y1="73" x2="117" y2="73" stroke={a} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="52" y="54" width="24" height="36" rx="3" stroke={a} strokeWidth="1.3" fill={b}/>
      <rect x="56" y="59" width="16" height="12" rx="1.5" stroke={d} strokeWidth="0.9" fill="none"/>
      <line x1="57" y1="76" x2="68" y2="76" stroke={d} strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="57" y1="80" x2="63" y2="80" stroke={d} strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="64" cy="65" r="20" stroke={a} strokeWidth="0.8" fill="none" opacity="0.25"/>
      <circle cx="64" cy="65" r="30" stroke={a} strokeWidth="0.5" fill="none" opacity="0.12"/>
      <circle cx="64" cy="65" r="40" stroke={a} strokeWidth="0.3" fill="none" opacity="0.07"/>
    </svg>
  );
};

const IlluFile = ({ dark }) => {
  const a = dark ? '#ffb000' : '#6366f1';
  const b = dark ? 'rgba(255,176,0,0.1)' : 'rgba(99,102,241,0.08)';
  const d = dark ? 'rgba(255,176,0,0.4)' : 'rgba(99,102,241,0.4)';
  return (
    <svg width="150" height="140" viewBox="0 0 150 140" fill="none">
      <rect x="48" y="10" width="58" height="75" rx="4" stroke={d} strokeWidth="0.8" fill="none" opacity="0.5"/>
      <rect x="28" y="18" width="62" height="82" rx="4" stroke={a} strokeWidth="1.5" fill={b}/>
      <path d="M73 18 L90 35 L73 35 Z" stroke={a} strokeWidth="1.2" fill={b}/>
      <line x1="40" y1="48" x2="80" y2="48" stroke={d} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="40" y1="58" x2="80" y2="58" stroke={d} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="40" y1="68" x2="68" y2="68" stroke={d} strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="40" y1="78" x2="58" y2="78" stroke={d} strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>
      <circle cx="106" cy="105" r="18" stroke={a} strokeWidth="1.5" fill="none"/>
      <circle cx="106" cy="105" r="10" stroke={d} strokeWidth="0.8" fill="none"/>
      <line x1="119" y1="118" x2="130" y2="129" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="105" x2="112" y2="105" stroke={d} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="106" y1="99" x2="106" y2="111" stroke={d} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
};

const IlluPerson = ({ dark }) => {
  const a = dark ? '#ffb000' : '#6366f1';
  const b = dark ? 'rgba(255,176,0,0.12)' : 'rgba(99,102,241,0.1)';
  const d = dark ? 'rgba(255,176,0,0.4)' : 'rgba(99,102,241,0.4)';
  return (
    <svg width="100" height="90" viewBox="0 0 100 90" fill="none">
      <circle cx="32" cy="24" r="13" stroke={a} strokeWidth="1.5" fill={b}/>
      <path d="M7 72c0-14 8-22 25-22" stroke={a} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <circle cx="72" cy="45" r="20" stroke={a} strokeWidth="1.5" fill={b}/>
      <line x1="72" y1="36" x2="72" y2="54" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="63" y1="45" x2="81" y2="45" stroke={a} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
};

const IlluRadar = ({ dark }) => {
  const a = dark ? '#ef4444' : '#dc2626';
  const b = dark ? 'rgba(239,68,68,0.12)' : 'rgba(220,38,38,0.08)';
  return (
    <svg width="170" height="150" viewBox="0 0 170 150" fill="none">
      <line x1="85" y1="120" x2="85" y2="42" stroke={a} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="62" y1="120" x2="108" y2="120" stroke={a} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M56 74 Q85 50 114 74" stroke={a} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M63 83 Q85 65 107 83" stroke={a} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M38 38 Q85 14 132 38" stroke={a} strokeWidth="1" fill="none" opacity="0.35" strokeDasharray="5 4"/>
      <path d="M26 55 Q85 26 144 55" stroke={a} strokeWidth="0.7" fill="none" opacity="0.2" strokeDasharray="4 5"/>
      <circle cx="124" cy="34" r="15" fill={b} stroke={a} strokeWidth="1.3"/>
      <line x1="118" y1="28" x2="130" y2="40" stroke={a} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="130" y1="28" x2="118" y2="40" stroke={a} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════
   AVATAR GEOMÉTRICO ÚNICO
═══════════════════════════════════════════════════════════════ */
const PALETTES = [
  ['#f59e0b','#d97706'],['#6366f1','#4f46e5'],['#10b981','#059669'],
  ['#ec4899','#db2777'],['#ef4444','#dc2626'],['#06b6d4','#0891b2'],
  ['#8b5cf6','#7c3aed'],['#14b8a6','#0d9488'],
];
const seed = (n='') => { let h=0; for(let i=0;i<n.length;i++) h=(h*31+n.charCodeAt(i))>>>0; return h; };

const Avatar = ({ name='?', size=38, dark }) => {
  const s = seed(name);
  const [p1,p2] = PALETTES[s % PALETTES.length];
  const cx = size/2, r = size*0.3, sides = 3+(s%3);
  const pts = Array.from({length:sides},(_,i)=>{
    const a = ((s%360)+(360/sides)*i)*Math.PI/180;
    return `${(cx+r*Math.cos(a)).toFixed(1)},${(cx+r*Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{borderRadius:6,display:'block',flexShrink:0}}>
      <defs>
        <linearGradient id={`av${s}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p1} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={p2} stopOpacity="0.08"/>
        </linearGradient>
      </defs>
      <rect width={size} height={size} rx="6" fill={`url(#av${s})`}/>
      <rect width={size} height={size} rx="6" stroke={p1} strokeWidth="0.8" fill="none" opacity="0.5"/>
      <polygon points={pts} stroke={p1} strokeWidth="1" fill={p1} fillOpacity="0.15"/>
      <text x={cx} y={cx+size*0.13} textAnchor="middle" fontFamily="Sora,sans-serif" fontWeight="800"
        fontSize={size*0.38} fill={p1} opacity="0.95">{name.charAt(0).toUpperCase()}</text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const TK = {
  dark:{
    bg:'#07090f',
    glass:'rgba(255,255,255,0.03)',
    glassBorder:'rgba(255,255,255,0.08)',
    glassHover:'rgba(255,255,255,0.06)',
    accent:'#818cf8',  
    accentB:'#6366f1',
    gold:'#f59e0b',
    red:'#f87171', green:'#34d399', blue:'#60a5fa', amber:'#fbbf24',
    text:'#f1f5f9', textSub:'#64748b', textMute:'#334155',
    surface:'#0f1117',
    nav:'rgba(7,9,15,0.85)',
  },
  light:{
    bg:'#f8faff',
    glass:'rgba(255,255,255,0.7)',
    glassBorder:'rgba(99,102,241,0.12)',
    glassHover:'rgba(99,102,241,0.06)',
    accent:'#6366f1',
    accentB:'#4f46e5',
    gold:'#d97706',
    red:'#ef4444', green:'#10b981', blue:'#3b82f6', amber:'#f59e0b',
    text:'#0f172a', textSub:'#64748b', textMute:'#cbd5e1',
    surface:'#ffffff',
    nav:'rgba(248,250,255,0.88)',
  },
};

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════ */
const GlobalCSS = ({ dark }) => {
  const t = TK[dark?'dark':'light'];
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
      *,*::before,*::after{box-sizing:border-box;}
      html,body,#root{height:100%;margin:0;padding:0;}
      body{
        font-family:'Sora',sans-serif;
        background:${dark?'#07090f':'#f8faff'};
        ${dark?`background-image:
          radial-gradient(ellipse 80% 50% at 20% -10%,rgba(99,102,241,0.15) 0%,transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 110%,rgba(139,92,246,0.12) 0%,transparent 60%),
          radial-gradient(ellipse 50% 30% at 50% 50%,rgba(245,158,11,0.04) 0%,transparent 70%);`
          :`background-image:
          radial-gradient(ellipse 70% 40% at 15% -5%,rgba(99,102,241,0.1) 0%,transparent 60%),
          radial-gradient(ellipse 50% 35% at 85% 105%,rgba(139,92,246,0.08) 0%,transparent 60%);`}
      }
      ::-webkit-scrollbar{width:4px;background:transparent;}
      ::-webkit-scrollbar-thumb{background:${dark?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)'};border-radius:4px;}

      @keyframes alarm-pulse{
        0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4),inset 0 0 0 0 rgba(239,68,68,0);}
        50%{box-shadow:0 0 0 16px rgba(239,68,68,0),inset 0 0 40px rgba(239,68,68,0.08);}
      }
      @keyframes radar-ring{0%{transform:scale(0.5);opacity:1}100%{transform:scale(3);opacity:0}}
      @keyframes radar-sweep{to{transform:rotate(360deg)}}
      @keyframes dot-pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 currentColor}50%{opacity:.4;box-shadow:none}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
      @keyframes fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      
      .row-tr td{transition:background 0.15s;}
      .row-tr:hover td{background:${dark?'rgba(99,102,241,0.06)':'rgba(99,102,241,0.04)'} !important;}
      .row-warn td{background:${dark?'rgba(245,158,11,0.06)':'rgba(245,158,11,0.05)'} !important;}
      
      .pill{cursor:pointer;transition:all .18s ease;border:none;background:none;font-family:'Sora',sans-serif;}
      .pill:hover{background:${dark?'rgba(255,255,255,0.05)':'rgba(99,102,241,0.07)'} !important;}
      .btn-act{transition:all .15s ease;font-family:'Sora',sans-serif;}
      .btn-act:hover:not(:disabled){filter:brightness(1.15);transform:translateY(-1px);}
      .btn-act:disabled{opacity:.3!important;cursor:not-allowed!important;}
      .kpi{transition:transform .2s,box-shadow .2s;cursor:default;}
      .kpi:hover{transform:translateY(-4px);}
      .float{animation:float 4s ease-in-out infinite;}
      .glass{
        background:${t.glass};
        border:1px solid ${t.glassBorder};
        backdrop-filter:blur(20px);
        -webkit-backdrop-filter:blur(20px);
      }
    `}</style>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MUI THEME
═══════════════════════════════════════════════════════════════ */
const mkTheme = (dark) => createTheme({
  palette:{
    mode:dark?'dark':'light',
    primary:{main:dark?'#818cf8':'#6366f1'},
    error:{main:'#ef4444'},warning:{main:'#f59e0b'},
    success:{main:dark?'#34d399':'#10b981'},info:{main:'#60a5fa'},
    background:{default:dark?'#07090f':'#f8faff',paper:dark?'#0f1117':'#ffffff'},
    text:{primary:dark?'#f1f5f9':'#0f172a',secondary:dark?'#64748b':'#64748b'},
    divider:dark?'rgba(255,255,255,0.07)':'rgba(99,102,241,0.1)',
  },
  typography:{
    fontFamily:'"Sora",sans-serif',fontSize:14,
    h6:{fontWeight:700,letterSpacing:'-0.01em'},
    button:{fontFamily:'"Sora",sans-serif',fontWeight:700,textTransform:'none',letterSpacing:'0.01em'},
    overline:{fontFamily:'"JetBrains Mono",monospace',letterSpacing:'0.14em',fontSize:'0.62rem'},
  },
  shape:{borderRadius:10},
  components:{
    MuiButton:{styleOverrides:{root:{borderRadius:8,boxShadow:'none',padding:'8px 18px',fontSize:'0.84rem',
      '&:hover':{boxShadow:'none'}},
      containedPrimary:{background:dark?'linear-gradient(135deg,#818cf8,#6366f1)':'linear-gradient(135deg,#818cf8,#4f46e5)',
        color:'#fff','&:hover':{background:dark?'linear-gradient(135deg,#a5b4fc,#818cf8)':'linear-gradient(135deg,#818cf8,#6366f1)'}}}},
    MuiTableCell:{styleOverrides:{
      root:{borderBottom:dark?'1px solid rgba(255,255,255,0.05)':'1px solid rgba(99,102,241,0.07)',
        padding:'15px 18px',fontSize:'0.91rem'},
      head:{fontSize:'0.65rem',fontWeight:500,letterSpacing:'0.12em',textTransform:'uppercase',
        fontFamily:'"JetBrains Mono",monospace',color:dark?'#475569':'#94a3b8',
        background:dark?'rgba(0,0,0,0.2)':'rgba(248,250,255,0.8)',padding:'12px 18px'}}},
    MuiOutlinedInput:{styleOverrides:{root:{borderRadius:8,fontSize:'0.91rem',
      '& fieldset':{borderColor:dark?'rgba(255,255,255,0.1)':'rgba(99,102,241,0.2)'},
      '&:hover fieldset':{borderColor:dark?'rgba(129,140,248,0.5)':'rgba(99,102,241,0.5)'},
      '&.Mui-focused fieldset':{borderColor:dark?'#818cf8':'#6366f1'}},
      input:{fontFamily:'"Sora",sans-serif'}}},
    MuiInputLabel:{styleOverrides:{root:{fontSize:'0.88rem',fontFamily:'"Sora",sans-serif'}}},
    MuiSelect:{styleOverrides:{select:{fontSize:'0.91rem',fontFamily:'"Sora",sans-serif'}}},
    MuiMenuItem:{styleOverrides:{root:{fontSize:'0.9rem',fontFamily:'"Sora",sans-serif'}}},
    MuiPaper:{styleOverrides:{root:{backgroundImage:'none'}}},
    MuiChip:{styleOverrides:{root:{fontSize:'0.73rem',fontWeight:700,height:25,borderRadius:6},
      label:{paddingLeft:10,paddingRight:10}}},
  },
});

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTES
═══════════════════════════════════════════════════════════════ */

// KPI Card glassmorphism
const KpiCard = ({ label, value, Ico, accent, dark }) => {
  const t = TK[dark?'dark':'light'];
  return (
    <Box className="kpi glass" sx={{
      borderRadius:'16px', p:3, position:'relative', overflow:'hidden',
      boxShadow:dark?`0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.05)`
                    :`0 4px 24px rgba(99,102,241,0.08),0 0 0 1px rgba(99,102,241,0.06)`,
    }}>
      <Box sx={{position:'absolute',top:0,left:0,right:0,height:3,background:accent,borderRadius:'16px 16px 0 0'}}/>
      <Box sx={{position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:accent,opacity:dark?0.07:0.05,filter:'blur(24px)'}}/>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',mb:2}}>
        <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.6rem',color:t.textSub,letterSpacing:'0.14em',textTransform:'uppercase'}}>{label}</Typography>
        <Box sx={{color:accent,opacity:0.85}}><Ico s={20} c={accent}/></Box>
      </Box>
      <Typography sx={{fontSize:'2.6rem',fontWeight:800,color:t.text,lineHeight:1,letterSpacing:'-0.02em'}}>
        {value==='---'?<span style={{color:t.textSub}}>---</span>:value}
      </Typography>
    </Box>
  );
};

// Chip de status
const StatusChip = ({ user, dark }) => {
  const t = TK[dark?'dark':'light'];
  if(user.is_deleted)  return <Chip label="REMOVIDO"  sx={{background:'rgba(148,163,184,0.1)',color:'#94a3b8',border:'1px solid rgba(148,163,184,0.25)'}}/>;
  if(user.is_blocked)  return <Chip label="BLOQUEADO" sx={{background:`rgba(245,158,11,0.1)`,color:t.amber,border:`1px solid rgba(245,158,11,0.3)`}}/>;
  if(user.valid_until&&new Date()>new Date(user.valid_until))
                       return <Chip label="EXPIRADO"  sx={{background:'rgba(139,92,246,0.1)',color:'#a78bfa',border:'1px solid rgba(139,92,246,0.3)'}}/>;
  if(!user.uid)        return <Chip label="PENDENTE"  sx={{background:`rgba(96,165,250,0.1)`,color:t.blue,border:`1px solid rgba(96,165,250,0.3)`}}/>;
  return                      <Chip label="ATIVO"     sx={{background:`rgba(52,211,153,0.1)`,color:t.green,border:`1px solid rgba(52,211,153,0.3)`}}/>;
};

// Botão de escuta de hardware
const RadarBtn = ({ userId, waitingForUser, onStart, dark }) => {
  const t = TK[dark?'dark':'light'];
  if(waitingForUser===userId) return (
    <Box sx={{display:'inline-flex',alignItems:'center',gap:1.5,px:2,py:1,borderRadius:'8px',
      background:'rgba(129,140,248,0.1)',border:'1px solid rgba(129,140,248,0.4)',
      boxShadow:'0 0 16px rgba(129,140,248,0.15)'}}>
      <Box sx={{position:'relative',width:26,height:26,flexShrink:0}}>
        {[0,0.55,1.1].map((d,i)=>(
          <Box key={i} sx={{position:'absolute',inset:0,borderRadius:'50%',
            border:'1.5px solid #818cf8',
            animation:`radar-ring 2s ${d}s ease-out infinite`,opacity:0.7}}/>
        ))}
        <Box sx={{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden',border:'1px solid rgba(129,140,248,0.2)'}}>
          <Box sx={{position:'absolute',top:0,left:'50%',width:'50%',height:'100%',
            background:'conic-gradient(from 0deg,rgba(129,140,248,0.6),transparent 55%)',
            transformOrigin:'left center',animation:'radar-sweep 1.4s linear infinite'}}/>
        </Box>
        <Box sx={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>
          <IcoNfc s={12} c="#818cf8"/>
        </Box>
      </Box>
      <Typography sx={{fontSize:'0.73rem',fontWeight:700,color:'#818cf8',
        fontFamily:'"JetBrains Mono",monospace',animation:'blink 1.3s infinite',letterSpacing:'0.07em'}}>
        AGUARDANDO...
      </Typography>
    </Box>
  );
  return (
    <Button className="btn-act" size="small" onClick={()=>onStart(userId)}
      sx={{fontSize:'0.77rem',borderRadius:'8px',background:'rgba(129,140,248,0.1)',
        color:'#818cf8',border:'1px solid rgba(129,140,248,0.35)',gap:0.8,
        '&:hover':{background:'rgba(129,140,248,0.2)',borderColor:'#818cf8',boxShadow:'0 0 12px rgba(129,140,248,0.2)'}}}>
      <IcoNfc s={13} c="#818cf8"/> ATRIBUIR
    </Button>
  );
};

// Topbar glassmorphism com tabs
const Topbar = ({ dark, onToggleDark, online, tab, setTab }) => {
  const t = TK[dark?'dark':'light'];
  const tabs = [
    {id:0,label:'DIRETÓRIO',Ic:IcoBadge},
    {id:1,label:'NOVO PERFIL',Ic:IcoPersonAdd},
    {id:2,label:'AUDITORIA',Ic:IcoHistory},
  ];
  return (
    <Box sx={{
      position:'sticky',top:0,zIndex:200,
      background:t.nav,borderBottom:`1px solid ${t.glassBorder}`,
      backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',
    }}>
      <Box sx={{maxWidth:1440,mx:'auto',px:4}}>
        <Box sx={{display:'flex',alignItems:'center',gap:2,pt:2.2,pb:1.5}}>
          <Box sx={{position:'relative',flexShrink:0}}>
            <Box sx={{position:'absolute',inset:-4,borderRadius:'50%',
              border:`1px solid ${t.accent}`,opacity:0.2,
              animation:'radar-ring 3s 1s ease-out infinite'}}/>
            <Box sx={{width:40,height:40,borderRadius:'10px',
              background:`linear-gradient(135deg,${t.accent}22,${t.accentB}11)`,
              border:`1px solid ${t.accent}30`,
              display:'flex',alignItems:'center',justifyContent:'center',
              boxShadow:`0 0 20px ${t.accent}22`}}>
              <IcoShield s={22} c={t.accent}/>
            </Box>
          </Box>

          <Box sx={{flex:1}}>
            <Box sx={{display:'flex',alignItems:'baseline',gap:0.5}}>
              <Typography sx={{fontWeight:800,fontSize:'1.3rem',color:t.text,letterSpacing:'-0.02em',lineHeight:1}}>
                Acesso
              </Typography>
              <Typography sx={{fontWeight:800,fontSize:'1.3rem',
                background:`linear-gradient(135deg,${t.accent},${t.accentB})`,
                WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                letterSpacing:'-0.02em',lineHeight:1}}>
                IoT
              </Typography>
            </Box>
            <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.58rem',
              color:t.textSub,letterSpacing:'0.12em',mt:0.2}}>
              ENTERPRISE RBAC v2
            </Typography>
          </Box>

          <Box sx={{display:'flex',alignItems:'center',gap:1,px:1.8,py:0.8,borderRadius:'20px',
            background:online?'rgba(52,211,153,0.08)':'rgba(248,113,113,0.08)',
            border:`1px solid ${online?'rgba(52,211,153,0.3)':'rgba(248,113,113,0.3)'}`,
            boxShadow:online?'0 0 12px rgba(52,211,153,0.1)':'0 0 12px rgba(248,113,113,0.1)'}}>
            <Box sx={{width:7,height:7,borderRadius:'50%',
              background:online?t.green:t.red,
              animation:'dot-pulse 2s infinite',color:online?t.green:t.red}}/>
            <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.62rem',
              color:online?t.green:t.red,letterSpacing:'0.1em',fontWeight:600}}>
              {online?'ONLINE':'OFFLINE'}
            </Typography>
          </Box>

          <Box onClick={onToggleDark} sx={{cursor:'pointer',p:0.9,borderRadius:'8px',
            background:t.glass,border:`1px solid ${t.glassBorder}`,
            display:'flex',alignItems:'center',
            '&:hover':{borderColor:t.accent,boxShadow:`0 0 10px ${t.accent}20`},
            transition:'all .2s'}}>
            {dark?<LightModeIcon sx={{fontSize:17,color:'#fbbf24'}}/>
                 :<DarkModeIcon  sx={{fontSize:17,color:t.textSub}}/>}
          </Box>
        </Box>

        <Box sx={{display:'flex',gap:0,borderTop:`1px solid ${t.glassBorder}`}}>
          {tabs.map(({id,label,Ic})=>{
            const on=tab===id;
            return (
              <Box key={id} className="pill" onClick={()=>setTab(id)}
                sx={{display:'flex',alignItems:'center',gap:1,px:2.5,py:1.3,position:'relative',
                  color:on?t.accent:t.textSub,borderRadius:'0',
                  '&:hover':{color:t.text}}}>
                <Ic s={15} c={on?t.accent:t.textSub}/>
                <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.67rem',
                  letterSpacing:'0.1em',fontWeight:on?600:400}}>{label}</Typography>
                {on&&<Box sx={{position:'absolute',bottom:0,left:0,right:0,height:2,
                  background:`linear-gradient(90deg,transparent,${t.accent},transparent)`,
                  borderRadius:'2px 2px 0 0'}}/>}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
function App() {
  const [tabIndex,      setTabIndex]      = useState(0);
  const [users,         setUsers]         = useState([]);
  const [logs,          setLogs]          = useState([]);
  const [waitingForUser,setWaitingForUser]= useState(null);
  const [darkMode,      setDarkMode]      = useState(true);
  const [popup,         setPopup]         = useState({open:false,severity:'info',message:''});
  const [systemOnline,  setSystemOnline]  = useState(true);
  const lastLogIdRef                      = useRef(null);

  // Form state
  const [nome,         setNome]        = useState('');
  const [role,         setRole]        = useState('Colaborador');
  const [department,   setDepartment]  = useState('Geral');
  const [isTemporary, setIsTemporary]  = useState(false);
  const [validUntil,   setValidUntil]  = useState('');

  // Estados de Filtro (Auditoria)
  const [filterText,       setFilterText]       = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus,     setFilterStatus]     = useState('ALL');
  const [filterDate,       setFilterDate]       = useState('');
  // Novos filtros: Turno e Ordenação
  const [filterTime,       setFilterTime]       = useState('ALL');
  const [sortOrder,        setSortOrder]        = useState('DESC');

  const t     = TK[darkMode?'dark':'light'];
  const theme = useMemo(()=>mkTheme(darkMode),[darkMode]);
  const notify= (message,severity='info')=>setPopup({open:true,message,severity});

  /* ── Fetch ── */
  const fetchData = async () => {
    try {
      const ru = await axios.get(`${API_URL}/users`);  setUsers(ru.data);
      const rl = await axios.get(`${API_URL}/access_logs`); setLogs(rl.data);
      setSystemOnline(true);
    } catch { setSystemOnline(false); }
  };
  useEffect(()=>{fetchData();const i=setInterval(fetchData,5000);return()=>clearInterval(i);},[]);

  /* ── Notificações de novos logs ── */
  useEffect(()=>{
    if(logs.length>0){
      const l=logs[0];
      if(lastLogIdRef.current!==null&&l.id!==lastLogIdRef.current){
        if(l.success===0){
          const f=logs.slice(0,3).filter(x=>x.success===0).length;
          if(f>=3) notify('🚨 AVISO: Múltiplas tentativas falhadas!','error');
          else notify(`Acesso Negado (${l.method})`,'warning');
        } else notify(`✅ Acesso Autorizado: ${l.nome}`,'success');
      }
      lastLogIdRef.current=l.id;
    }
  },[logs]);

  /* ── Radar de hardware ── */
  useEffect(()=>{
    let iv;
    if(waitingForUser){
      iv=setInterval(async()=>{
        try{
          const r=await axios.get(`${API_URL}/last-scanned`);
          if(r.data.uid){
            clearInterval(iv);
            try{
              await axios.put(`${API_URL}/users/${waitingForUser}/card`,{uid:r.data.uid});
              await axios.delete(`${API_URL}/last-scanned`);
              setWaitingForUser(null);fetchData();
              notify('Cartão atribuído com sucesso!','success');
            }catch(e){
              await axios.delete(`${API_URL}/last-scanned`);
              setWaitingForUser(null);notify('Erro na atribuição.','error');
            }
          }
        }catch(e){console.error(e);}
      },1000);
    }
    return()=>clearInterval(iv);
  },[waitingForUser]);

  /* ── Handlers ── */
  const handleAddUser = async (e) => {
    e.preventDefault();
    try{
      await axios.post(`${API_URL}/users`,{nome,uid:null,role,department,valid_until:isTemporary?validUntil:null});
      setNome('');setRole('Colaborador');setDepartment('Geral');setIsTemporary(false);setValidUntil('');
      fetchData();notify('Perfil criado!','success');setTabIndex(0);
    }catch{notify('Erro ao criar perfil.','error');}
  };
  const startWaitingForCard = async(id)=>{await axios.delete(`${API_URL}/last-scanned`);setWaitingForUser(id);};
  const handleToggleBlock   = async(id,cur)=>{
    try{await axios.put(`${API_URL}/users/${id}/block`,{is_blocked:!cur});fetchData();notify('Estado alterado.','info');}catch{}
  };
  const handleDelete = async(id)=>{
    if(window.confirm('Remover permanentemente?'))
      try{await axios.delete(`${API_URL}/users/${id}`);fetchData();notify('Removido.','success');}catch{}
  };

  /* ── Compilar lista de departamentos dinamicamente ── */
  const departmentsList = useMemo(() => {
    const s = new Set();
    users.forEach(u => { if (u.department) s.add(u.department); });
    logs.forEach(l => { if (l.department && l.department !== '—' && l.department !== 'N/A') s.add(l.department); });
    return Array.from(s).sort();
  }, [users, logs]);

  /* ── Lógica de Filtragem e Ordenação (useMemo) ── */
  const filteredLogs = useMemo(() => {
    const filtered = logs.filter(log => {
      // 1. Filtro de Texto
      const searchStr = filterText.toLowerCase();
      const matchesText = !filterText || 
        (log.nome && log.nome.toLowerCase().includes(searchStr)) ||
        (log.uid && log.uid.toLowerCase().includes(searchStr));

      // 2. Filtro de Departamento
      let matchesDept = true;
      if (filterDepartment !== 'ALL') {
        matchesDept = (log.department === filterDepartment);
      }

      // 3. Filtro de Status
      const isSuccess = log.success === 1;
      let matchesStatus = true;
      if (filterStatus === 'SUCCESS') matchesStatus = isSuccess;
      if (filterStatus === 'DENIED') matchesStatus = !isSuccess;

      // 4. Filtro de Data
      let matchesDate = true;
      if (filterDate) {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        matchesDate = (logDate === filterDate);
      }

      // 5. Filtro de Turno / Período do dia
      let matchesTime = true;
      if (filterTime !== 'ALL') {
        const hour = new Date(log.timestamp).getHours();
        if (filterTime === 'MORNING') matchesTime = (hour >= 6 && hour < 14);     // 06h - 13h59
        if (filterTime === 'AFTERNOON') matchesTime = (hour >= 14 && hour < 22);  // 14h - 21h59
        if (filterTime === 'NIGHT') matchesTime = (hour >= 22 || hour < 6);       // 22h - 05h59
      }

      return matchesText && matchesDept && matchesStatus && matchesDate && matchesTime;
    });

    // 6. Ordenação (Sort)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
    });

  }, [logs, filterText, filterDepartment, filterStatus, filterDate, filterTime, sortOrder]);

  /* ── Exportação baseada nos Filtros ── */
  const exportToCSV = ()=>{
    let csv="data:text/csv;charset=utf-8,\uFEFFData e Hora,Utilizador,Departamento,UID Cartao,Metodo,Resultado\n";
    filteredLogs.forEach(l=>{csv+=`"${new Date(l.timestamp).toLocaleString('pt-PT')}","${l.nome||'N/A'}","${l.department||'N/A'}","${l.uid||'N/A'}","${l.method}","${l.success===1?'Autorizado':'Negado'}"\n`;});
    const a=document.createElement('a');a.href=encodeURI(csv);a.download='Relatorio_Auditoria.csv';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    notify(`Exportados ${filteredLogs.length} registos com sucesso!`,'success');
  };

  // KPIs
  const totalUsers  = users.length;
  const activeUsers = users.filter(u=>!u.is_deleted&&!u.is_blocked).length;
  const falhas      = logs.filter(l=>l.success===0).length;
  const multiFailure= logs.length>=3&&logs.slice(0,3).every(l=>l.success===0);

  const ROLES = {
    Administrador:{bg:'rgba(139,92,246,0.1)',color:'#a78bfa',border:'rgba(139,92,246,0.3)'},
    Segurança:    {bg:'rgba(251,191,36,0.1)', color:'#fbbf24',border:'rgba(251,191,36,0.3)'},
    Colaborador:  {bg:'rgba(148,163,184,0.08)',color:'#94a3b8',border:'rgba(148,163,184,0.2)'},
  };
  const RoleChip=({role:r})=>{const c=ROLES[r]||ROLES.Colaborador;return <Chip label={r.toUpperCase()} sx={{background:c.bg,color:c.color,border:`1px solid ${c.border}`,fontSize:'0.68rem',height:22,letterSpacing:'0.05em'}}/>;};

  /* ══════════════════════════════════════════════════════════════
      RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <GlobalCSS dark={darkMode}/>

      <Box sx={{minHeight:'100vh'}}>
        <Topbar dark={darkMode} onToggleDark={()=>setDarkMode(d=>!d)} online={systemOnline} tab={tabIndex} setTab={setTabIndex}/>

        <Box sx={{maxWidth:1440,mx:'auto',px:4,pt:4,pb:10,animation:'fade-up .4s ease'}}>

          {/* ── OFFLINE BANNER ─────────────────────────────────────── */}
          {!systemOnline&&(
            <Box sx={{display:'flex',gap:3,alignItems:'center',p:3.5,mb:4,borderRadius:'16px',
              background:'rgba(239,68,68,0.07)',
              border:'1.5px solid rgba(239,68,68,0.35)',
              boxShadow:'0 0 40px rgba(239,68,68,0.08)',
              animation:'alarm-pulse 1.5s infinite'}}>
              <Box className="float" sx={{flexShrink:0}}><IlluRadar dark={darkMode}/></Box>
              <Box sx={{flex:1}}>
                <Box sx={{display:'flex',alignItems:'center',gap:1.5,mb:0.8}}>
                  <IcoWarn s={22} c={t.red}/>
                  <Typography sx={{fontWeight:800,fontSize:'1rem',color:t.red,letterSpacing:'-0.01em'}}>CONEXÃO PERDIDA COM A BASE DE DADOS</Typography>
                </Box>
                <Typography sx={{fontSize:'0.9rem',color:darkMode?'#fca5a5':'#991b1b',lineHeight:1.65}}>
                  A plataforma web não consegue ler ou guardar dados novos. O hardware (ESP32) entrou em isolamento automático e está a validar acessos de forma 100% autónoma recorrendo à criptografia interna.
                </Typography>
              </Box>
            </Box>
          )}

          {/* ── KPI CARDS ──────────────────────────────────────────── */}
          <Box sx={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2.5,mb:4,
            opacity:systemOnline?1:0.4,transition:'opacity .4s'}}>
            <KpiCard label="TOTAL IDENTIDADES" value={systemOnline?totalUsers:'---'}  Ico={IcoPeople}  accent="#818cf8" dark={darkMode}/>
            <KpiCard label="PERFIS ATIVOS"      value={systemOnline?activeUsers:'---'} Ico={IcoCheck}   accent="#34d399" dark={darkMode}/>
            <KpiCard label="LEITURAS DE LOG"    value={systemOnline?logs.length:'---'} Ico={IcoLog}     accent="#60a5fa" dark={darkMode}/>
            <KpiCard label="ACESSOS NEGADOS"    value={systemOnline?falhas:'---'}      Ico={IcoBlock}   accent="#f87171" dark={darkMode}/>
          </Box>

          {/* ── OFFLINE EMPTY STATE ─────────────────────────────────── */}
          {!systemOnline?(
            <Box sx={{textAlign:'center',py:12}}>
              <Box className="float" sx={{display:'inline-block',mb:3}}><IcoCloud s={64} c={t.textSub}/></Box>
              <Typography sx={{fontSize:'1.1rem',fontWeight:800,color:t.textSub,mb:1,letterSpacing:'-0.01em'}}>PAINEL SUSPENSO</Typography>
              <Typography sx={{fontSize:'0.9rem',color:t.textSub,maxWidth:460,mx:'auto',lineHeight:1.7}}>
                Tabelas e formulários bloqueados para evitar inconsistência de dados enquanto a base de dados central estiver inacessível.
              </Typography>
            </Box>
          ):(
            <>
              {/* ╔══ TAB 0 — DIRETÓRIO ══════════════════════════════╗ */}
              {tabIndex===0&&(
                <Box sx={{animation:'fade-up .3s ease'}}>

                  {/* Aviso múltiplas falhas */}
                  {multiFailure&&(
                    <Box sx={{display:'flex',gap:2,alignItems:'center',p:2.5,mb:3,borderRadius:'12px',
                      background:'rgba(245,158,11,0.07)',border:'1px solid rgba(245,158,11,0.3)',
                      boxShadow:'0 0 20px rgba(245,158,11,0.06)'}}>
                      <IcoWarn s={22} c={t.amber}/>
                      <Box>
                        <Typography sx={{fontWeight:700,fontSize:'0.93rem',color:t.amber,mb:0.2}}>Aviso de Segurança</Typography>
                        <Typography sx={{fontSize:'0.85rem',color:darkMode?'#fcd34d':'#92400e'}}>
                          Múltiplas tentativas de acesso falhadas consecutivas detetadas no leitor RFID.
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Header secção */}
                  <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:3}}>
                    <Box>
                      <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.6rem',color:t.textSub,letterSpacing:'0.14em',mb:0.4}}>MÓDULO DE CONTROLO</Typography>
                      <Typography variant="h6" sx={{color:t.text,fontSize:'1.15rem'}}>Estado Global das Identidades</Typography>
                    </Box>
                    <Button variant="contained" onClick={()=>setTabIndex(1)}
                      sx={{gap:0.8,fontSize:'0.83rem',px:2.5,
                        boxShadow:'0 4px 20px rgba(129,140,248,0.3)',
                        '&:hover':{boxShadow:'0 6px 24px rgba(129,140,248,0.4)'}}}>
                      <IcoPersonAdd s={16} c="#fff"/> NOVO PERFIL
                    </Button>
                  </Box>

                  {/* Tabela */}
                  <Box className="glass" sx={{borderRadius:'16px',overflow:'hidden',
                    boxShadow:darkMode?'0 8px 40px rgba(0,0,0,0.4)':'0 4px 24px rgba(99,102,241,0.08)'}}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Privilégio / Dept.</TableCell>
                            <TableCell>Validade</TableCell>
                            <TableCell>Cartão & Hash ESP32</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.length===0?(
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{py:8,border:'none'}}>
                                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:1.5}}>
                                  <Box className="float"><IlluDoor dark={darkMode}/></Box>
                                  <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.75rem',color:t.textSub,letterSpacing:'0.12em'}}>
                                    NENHUM PERFIL REGISTADO
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ):users.map(user=>(
                            <TableRow key={user.id} className="row-tr" sx={{opacity:user.is_deleted?0.4:1}}>
                              <TableCell>
                                <Box sx={{display:'flex',alignItems:'center',gap:1.5}}>
                                  <Avatar name={user.nome} size={38} dark={darkMode}/>
                                  <Typography sx={{fontWeight:700,fontSize:'0.93rem',color:t.text}}>{user.nome}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{display:'flex',alignItems:'center',gap:1,flexWrap:'wrap'}}>
                                  <RoleChip role={user.role}/>
                                  <Typography sx={{fontSize:'0.8rem',color:t.textSub}}>{user.department}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.78rem',color:t.textSub}}>
                                  {user.valid_until?new Date(user.valid_until).toLocaleDateString('pt-PT'):'Sem Limite'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {user.uid?(
                                  <Box>
                                    <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.79rem',fontWeight:600,color:t.text}}>
                                      {user.uid.split('-REMOVIDO-')[0]}
                                    </Typography>
                                    <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.6rem',
                                      background:`linear-gradient(90deg,${t.accent},${t.accentB})`,
                                      WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',
                                      mt:0.4,wordBreak:'break-all',opacity:0.85}}>
                                      SHA: {user.hash_esp32?user.hash_esp32.substring(0,22)+'…':'—'}
                                    </Typography>
                                  </Box>
                                ):(
                                  <Chip label="SEM CARTÃO" size="small" variant="outlined"
                                    sx={{fontSize:'0.68rem',color:t.textSub,borderColor:t.glassBorder,borderStyle:'dashed',height:22}}/>
                                )}
                              </TableCell>
                              <TableCell align="center"><StatusChip user={user} dark={darkMode}/></TableCell>
                              <TableCell align="center">
                                <Box sx={{display:'flex',justifyContent:'center',gap:1}}>
                                  {!user.uid&&user.is_deleted===0?(
                                    <RadarBtn userId={user.id} waitingForUser={waitingForUser} onStart={startWaitingForCard} dark={darkMode}/>
                                  ):(
                                    <Button className="btn-act" size="small" disabled={user.is_deleted===1}
                                      onClick={()=>handleToggleBlock(user.id,user.is_blocked)}
                                      sx={{fontSize:'0.76rem',border:'none',borderRadius:'7px',
                                        ...(user.is_blocked
                                          ?{background:'rgba(52,211,153,0.1)',color:t.green,'&:hover':{background:'rgba(52,211,153,0.2)'}}
                                          :{background:'rgba(251,191,36,0.1)',color:t.amber,'&:hover':{background:'rgba(251,191,36,0.2)'}})
                                      }}>
                                      {user.is_blocked?'REATIVAR':'BLOQUEAR'}
                                    </Button>
                                  )}
                                  <Button className="btn-act" size="small" disabled={user.is_deleted===1}
                                    onClick={()=>handleDelete(user.id)}
                                    sx={{fontSize:'0.76rem',border:'none',borderRadius:'7px',
                                      background:'rgba(248,113,113,0.1)',color:t.red,
                                      '&:hover':{background:'rgba(248,113,113,0.2)'}}}>
                                    REMOVER
                                  </Button>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              )}

              {/* ╔══ TAB 1 — NOVO PERFIL ════════════════════════════╗ */}
              {tabIndex===1&&(
                <Box sx={{maxWidth:760,mx:'auto',animation:'fade-up .3s ease'}}>
                  <Box className="glass" sx={{borderRadius:'20px',overflow:'hidden',
                    boxShadow:darkMode?'0 8px 40px rgba(0,0,0,0.4)':'0 4px 24px rgba(99,102,241,0.1)'}}>

                    {/* Header ilustrado */}
                    <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',
                      px:4,pt:3.5,pb:3,
                      background:darkMode?'rgba(129,140,248,0.07)':'rgba(99,102,241,0.04)',
                      borderBottom:`1px solid ${t.glassBorder}`}}>
                      <Box>
                        <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.6rem',
                          color:t.textSub,letterSpacing:'0.14em',mb:0.5}}>MÓDULO DE REGISTO</Typography>
                        <Typography variant="h6" sx={{color:t.text,fontSize:'1.2rem',mb:0.3}}>
                          Criar Nova Identidade RBAC
                        </Typography>
                        <Typography sx={{fontSize:'0.83rem',color:t.textSub}}>
                          Preenche os dados e associa um cartão físico ESP32
                        </Typography>
                      </Box>
                      <Box className="float" sx={{flexShrink:0,opacity:0.9}}>
                        <IlluPerson dark={darkMode}/>
                      </Box>
                    </Box>

                    <Box sx={{p:4}}>
                      <Box component="form" onSubmit={handleAddUser}>
                        <Grid container spacing={2.5}>
                          <Grid item xs={12}>
                            <TextField label="Nome Completo" value={nome} onChange={e=>setNome(e.target.value)} required fullWidth size="small"/>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Privilégio</InputLabel>
                              <Select value={role} label="Privilégio" onChange={e=>setRole(e.target.value)}>
                                <MenuItem value="Administrador">Administrador</MenuItem>
                                <MenuItem value="Segurança">Segurança</MenuItem>
                                <MenuItem value="Colaborador">Colaborador</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField label="Departamento" value={department} onChange={e=>setDepartment(e.target.value)} fullWidth size="small"/>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{p:2.5,borderRadius:'10px',border:`1px solid ${t.glassBorder}`,
                              background:darkMode?'rgba(129,140,248,0.05)':'rgba(99,102,241,0.03)'}}>
                              <FormControlLabel
                                control={<Switch checked={isTemporary} onChange={e=>setIsTemporary(e.target.checked)} color="warning" size="small"/>}
                                label={<Typography sx={{fontSize:'0.89rem',fontWeight:700,color:t.text}}>Acesso Temporário</Typography>}
                                sx={{m:0}}/>
                              {isTemporary&&(
                                <Box sx={{mt:2}}>
                                  <TextField label="Data Limite" type="datetime-local" InputLabelProps={{shrink:true}}
                                    value={validUntil} onChange={e=>setValidUntil(e.target.value)} required fullWidth size="small"/>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                        <Box sx={{mt:4,display:'flex',justifyContent:'flex-end',gap:1.5}}>
                          <Button className="btn-act" onClick={()=>setTabIndex(0)}
                            sx={{color:t.textSub,background:t.glass,border:`1px solid ${t.glassBorder}`,
                              fontSize:'0.83rem','&:hover':{borderColor:t.accent}}}>
                            CANCELAR
                          </Button>
                          <Button type="submit" variant="contained" sx={{px:3.5,fontSize:'0.84rem',gap:0.8,
                            boxShadow:'0 4px 20px rgba(129,140,248,0.35)',
                            '&:hover':{boxShadow:'0 6px 24px rgba(129,140,248,0.45)'}}}>
                            <IcoPersonAdd s={15} c="#fff"/> REGISTAR PERFIL
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* ╔══ TAB 2 — AUDITORIA ══════════════════════════════╗ */}
              {tabIndex===2&&(
                <Box sx={{animation:'fade-up .3s ease'}}>
                  <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',mb:2.5}}>
                    <Box>
                      <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.6rem',color:t.textSub,letterSpacing:'0.14em',mb:0.4}}>MÓDULO DE AUDITORIA</Typography>
                      <Typography variant="h6" sx={{color:t.text,fontSize:'1.15rem'}}>Registo de Eventos de Segurança</Typography>
                    </Box>
                    <Button className="btn-act" onClick={exportToCSV}
                      sx={{fontSize:'0.83rem',borderRadius:'8px',gap:0.8,
                        border:'1px solid rgba(52,211,153,0.35)',color:t.green,
                        background:'rgba(52,211,153,0.07)',
                        '&:hover':{background:'rgba(52,211,153,0.15)',borderColor:t.green,
                          boxShadow:'0 0 16px rgba(52,211,153,0.15)'}}}>
                      <IcoDownload s={16} c={t.green}/> DOWNLOAD CSV
                    </Button>
                  </Box>

                  <Box className="glass" sx={{borderRadius:'16px',overflow:'hidden',
                    boxShadow:darkMode?'0 8px 40px rgba(0,0,0,0.4)':'0 4px 24px rgba(99,102,241,0.08)'}}>
                    
                    {/* BARRA DE FILTRAGEM MULTIPLA */}
                    <Box sx={{ display:'flex', gap:2, p:2.5, borderBottom:`1px solid ${t.glassBorder}`, background:darkMode?'rgba(129,140,248,0.04)':'rgba(99,102,241,0.02)', flexWrap:'wrap' }}>
                      
                      <TextField
                        size="small"
                        placeholder="Pesquisar..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        sx={{ flex:1.5, minWidth:180, background:t.surface }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box sx={{ color:t.textSub, mt:0.5 }}><IcoSearch s={16}/></Box>
                            </InputAdornment>
                          ),
                        }}
                      />
                      
                      <FormControl size="small" sx={{ flex:1, minWidth:160, background:t.surface }}>
                        <Select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          displayEmpty
                          startAdornment={
                            <InputAdornment position="start">
                              <Box sx={{ color:t.textSub, ml:1, mt:0.5 }}><IcoDomain s={15}/></Box>
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="ALL">Departamentos</MenuItem>
                          {departmentsList.map(dep => (
                            <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ flex:1, minWidth:160, background:t.surface }}>
                        <Select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          displayEmpty
                          startAdornment={
                            <InputAdornment position="start">
                              <Box sx={{ color:t.textSub, ml:1, mt:0.5 }}><IcoFilter s={15}/></Box>
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="ALL">Status Geral</MenuItem>
                          <MenuItem value="SUCCESS">Concedidos</MenuItem>
                          <MenuItem value="DENIED">Negados</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ flex:1, minWidth:160, background:t.surface }}>
                        <Select
                          value={filterTime}
                          onChange={(e) => setFilterTime(e.target.value)}
                          displayEmpty
                          startAdornment={
                            <InputAdornment position="start">
                              <Box sx={{ color:t.textSub, ml:1, mt:0.5 }}><IcoClock s={15}/></Box>
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="ALL">Todos os Turnos</MenuItem>
                          <MenuItem value="MORNING">Manhã (06h - 14h)</MenuItem>
                          <MenuItem value="AFTERNOON">Tarde (14h - 22h)</MenuItem>
                          <MenuItem value="NIGHT">Noite (22h - 06h)</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ flex:1, minWidth:160, background:t.surface }}>
                        <Select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          displayEmpty
                          startAdornment={
                            <InputAdornment position="start">
                              <Box sx={{ color:t.textSub, ml:1, mt:0.5 }}><IcoSort s={15}/></Box>
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="DESC">Mais Recentes</MenuItem>
                          <MenuItem value="ASC">Mais Antigos</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <TextField
                        size="small"
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        sx={{ flex:1, minWidth:140, background:t.surface }}
                        InputLabelProps={{ shrink: true }}
                      />
                      
                      {(filterText || filterStatus !== 'ALL' || filterDepartment !== 'ALL' || filterDate || filterTime !== 'ALL' || sortOrder !== 'DESC') && (
                        <Button 
                          className="btn-act"
                          onClick={() => { setFilterText(''); setFilterStatus('ALL'); setFilterDepartment('ALL'); setFilterTime('ALL'); setSortOrder('DESC'); setFilterDate(''); }}
                          sx={{ minWidth:'auto', color:t.textSub, fontSize:'0.75rem', '&:hover':{color:t.red} }}
                        >
                          LIMPAR
                        </Button>
                      )}
                    </Box>
                    {/* FIM BARRA DE FILTRAGEM */}

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Data e Hora</TableCell>
                            <TableCell>Identidade</TableCell>
                            <TableCell>Departamento</TableCell>
                            <TableCell>UID Lido</TableCell>
                            <TableCell>Detalhe do Evento</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredLogs.length===0?(
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{py:8,border:'none'}}>
                                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:1.5}}>
                                  <Box className="float"><IlluFile dark={darkMode}/></Box>
                                  <Typography sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.75rem',color:t.textSub,letterSpacing:'0.12em'}}>
                                    {logs.length === 0 ? 'SEM HISTÓRICO DE ACESSOS' : 'NENHUM REGISTO CORRESPONDE AOS FILTROS'}
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ):filteredLogs.map(log=>{
                            const isAlarm = false; 
                            const isOk   =log.success===1;
                            return(
                              <TableRow key={log.id} className={isAlarm?'row-alarm':isOk?'row-tr':'row-warn row-tr'}>
                                <TableCell sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.78rem',color:t.textSub}}>
                                  {new Date(log.timestamp).toLocaleString('pt-PT')}
                                </TableCell>
                                <TableCell>
                                  <Box sx={{display:'flex',alignItems:'center',gap:1.3}}>
                                    <Avatar name={log.nome||'?'} size={30} dark={darkMode}/>
                                    <Typography sx={{fontWeight:700,fontSize:'0.91rem',color:t.text}}>{log.nome||'Não Registado'}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell sx={{fontSize:'0.88rem',color:t.textSub}}>{log.department||'—'}</TableCell>
                                <TableCell sx={{fontFamily:'"JetBrains Mono",monospace',fontSize:'0.78rem',color:t.textSub}}>
                                  {log.uid?log.uid.split('-REMOVIDO-')[0]:'N/A'}
                                </TableCell>
                                <TableCell>
                                  <Chip label={log.method} sx={{
                                    fontWeight:700,fontSize:'0.7rem',maxWidth:260,height:24,
                                    ...(isOk
                                        ?{background:'rgba(52,211,153,0.12)',color:t.green,border:'1px solid rgba(52,211,153,0.3)'}
                                        :{background:'rgba(251,191,36,0.12)',color:t.amber,border:'1px solid rgba(251,191,36,0.3)'})
                                  }}/>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar open={popup.open} autoHideDuration={6000}
        onClose={(e,r)=>r!=='clickaway'&&setPopup({...popup,open:false})}
        anchorOrigin={{vertical:'top',horizontal:'right'}} TransitionComponent={Slide} sx={{mt:8}}>
        <Alert onClose={()=>setPopup({...popup,open:false})} severity={popup.severity} variant="filled"
          sx={{width:'100%',boxShadow:'0 8px 32px rgba(0,0,0,0.3)',fontWeight:700,
            fontFamily:'"Sora",sans-serif',fontSize:'0.88rem',borderRadius:'10px'}}>
          {popup.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;