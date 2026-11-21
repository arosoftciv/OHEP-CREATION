import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F} from '../theme';

/** Panneaux latéraux de la version ordinateur (16:9) : fond transparent, le film vertical est incrusté au centre. */
const CENTER_W = 608; // 1080 × 1920 réduit à 1080 px de haut

export const DesktopSides: React.FC = () => {
	const side = (1920 - CENTER_W) / 2;
	const row = (label: string, big = false) => (
		<div style={{fontFamily: F.title, fontWeight: big ? 900 : 700, fontSize: big ? 44 : 30, color: C.cream, marginTop: big ? 18 : 12, whiteSpace: 'nowrap'}}>{label}</div>
	);
	return (
		<AbsoluteFill>
			{/* légères ombres pour détacher le film du fond */}
			<div style={{position: 'absolute', left: side - 30, top: 0, width: 30, height: 1080, background: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.45))'}} />
			<div style={{position: 'absolute', left: side + CENTER_W, top: 0, width: 30, height: 1080, background: 'linear-gradient(90deg, rgba(0,0,0,0.45), rgba(0,0,0,0))'}} />
			{/* panneau gauche : identité */}
			<div style={{position: 'absolute', left: 0, top: 0, width: side, height: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
				<Img src={staticFile('img/logo_ohel_transparent.png')} style={{width: 420, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.5))'}} />
				<div style={{marginTop: 60, fontFamily: F.title, fontWeight: 900, fontSize: 58, lineHeight: 1.05, color: C.cream, textShadow: '0 4px 18px rgba(0,0,0,0.6)'}}>
					L'HISTOIRE
					<br />
					DU <span style={{color: C.ochre}}>BTCS</span>
				</div>
				<div style={{marginTop: 22, fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 36, color: C.sand}}>De la terre à l'architecture</div>
			</div>
			{/* panneau droit : contact */}
			<div style={{position: 'absolute', left: side + CENTER_W, top: 0, width: side, height: 1080, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
				<div style={{fontFamily: F.title, fontWeight: 900, fontSize: 30, letterSpacing: 2, color: C.deep, background: C.ochre, padding: '10px 26px', borderRadius: 30}}>DEMANDEZ VOTRE DEVIS</div>
				{row('+225 07 07 63 03 35', true)}
				{row('Appel ou WhatsApp')}
				<div style={{height: 26}} />
				{row('contact@ohelintermondial.com')}
				{row('ohelintermondial.com')}
				<div style={{marginTop: 40, fontFamily: F.title, fontWeight: 600, fontSize: 24, letterSpacing: 3, lineHeight: 1.6, color: C.sand}}>ÉCOLES · HÔTELS · LOGEMENTS<br />BUREAUX · COMMERCES</div>
			</div>
		</AbsoluteFill>
	);
};
