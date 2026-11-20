import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {LogoCard} from '../components/core';
import {C, F} from '../theme';

/** Couverture 1080×1920 : architecture en terre (haut) → bloc BTCS réel (centre) → chantier OHEL (bas). */
export const Cover: React.FC = () => {
	const tear = (y: number, amp: number, seed: number) => {
		let d = `M0,${y}`;
		for (let x = 0; x <= 1080; x += 30) {
			const n = Math.sin(x * 0.031 + seed) * amp + Math.sin(x * 0.117 + seed * 2) * amp * 0.4;
			d += ` L${x},${y + n}`;
		}
		return d;
	};
	return (
		<AbsoluteFill style={{background: C.night}}>
			{/* haut : architecture traditionnelle en terre (photo) */}
			<div style={{position: 'absolute', left: 0, top: -230, width: 1080, height: 1350}}>
				<Img src={staticFile('img/mosquee_ciel.jpg')} style={{position: 'absolute', width: '100%', height: '100%'}} />
				<Img src={staticFile('img/mosquee_edifice.png')} style={{position: 'absolute', width: '100%', height: '100%'}} />
			</div>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,5,0.15) 0%, rgba(20,10,5,0) 25%, rgba(20,10,5,0.25) 45%)'}} />
			{/* bas : chantier réel OHEL */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
				<defs>
					<clipPath id="bottomClip">
						<path d={`${tear(1300, 22, 2)} L1080,1920 L0,1920 Z`} />
					</clipPath>
					<linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#3B1F10" />
						<stop offset="1" stopColor={C.night} />
					</linearGradient>
				</defs>
				<image href={staticFile('img/chantier_ohel.jpg')} x={0} y={640} width={1080} height={1920} preserveAspectRatio="xMidYMin slice" clipPath="url(#bottomClip)" />
				<path d={`${tear(690, 18, 5)} L1080,1330 L0,1330 Z`} fill="url(#band)" />
				<path d={tear(690, 18, 5)} stroke={C.ochre} strokeWidth={6} fill="none" />
				<path d={tear(1300, 22, 2)} stroke={C.ochre} strokeWidth={6} fill="none" />
			</svg>
			<div style={{position: 'absolute', left: 0, top: 1580, width: 1080, height: 340, background: 'linear-gradient(180deg, rgba(20,10,5,0), rgba(20,10,5,0.7))'}} />

			{/* titre */}
			<div style={{position: 'absolute', top: 735, width: 1080, textAlign: 'center'}}>
				<div style={{fontFamily: F.title, fontWeight: 900, fontSize: 96, lineHeight: 1.0, color: C.cream, letterSpacing: 1, textShadow: '0 6px 24px rgba(0,0,0,0.6)'}}>
					DE LA TERRE
					<br />
					<span style={{color: C.ochre}}>À LA MAISON</span>
				</div>
				<div style={{marginTop: 16, fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 58, color: C.sand}}>L'histoire du BTCS</div>
			</div>
			{/* bloc BTCS réel */}
			<Img
				src={staticFile('img/btcs_bloc_detoure.png')}
				style={{position: 'absolute', left: 540 - 300, top: 1040, width: 600, transform: 'rotate(-4deg)', filter: 'drop-shadow(0 40px 40px rgba(0,0,0,0.65))'}}
			/>
			{/* logo officiel */}
			<div style={{position: 'absolute', top: 90, left: 540 - 230}}>
				<LogoCard width={460} />
			</div>
		</AbsoluteFill>
	);
};
