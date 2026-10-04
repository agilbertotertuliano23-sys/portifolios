// Original display composition for this landing page; no external UI assets.
import * as T from '../three/three.module.min.js';

export function createDisplayTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1440;
  canvas.height = 936;
  const ctx = canvas.getContext('2d');
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  texture.anisotropy = 4;
  const portrait = new Image();
  const circle = (x, y, radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  };
  function draw() {
    ctx.fillStyle = '#141916'; ctx.fillRect(0, 0, 1440, 936);
    ctx.fillStyle = '#f4eadd'; ctx.fillRect(0, 0, 1440, 80);
    ctx.font = '500 23px Arial'; ctx.fillStyle = '#473d32';
    ctx.fillText('Patrícia Medronha  /  Psicologia', 38, 50);
    circle(1220, 40, 6, '#687e5a');
    ctx.font = '19px Arial'; ctx.fillText('Atendimento online', 1240, 47, 174);
    // Warm office backdrop behind the cut-out portrait.
    const room = ctx.createRadialGradient(535, 330, 40, 535, 420, 620);
    room.addColorStop(0, '#6b5443'); room.addColorStop(.55, '#3a2d24'); room.addColorStop(1, '#1d1714');
    ctx.fillStyle = room; ctx.fillRect(20, 100, 1030, 728);
    circle(170, 230, 90, '#f2c98a14'); circle(900, 190, 120, '#f2c98a10'); circle(960, 560, 70, '#f2c98a0c');
    if (portrait.complete && portrait.naturalWidth) {
      // Head-and-shoulders crop of the portrait, scaled to the call frame.
      const sourceWidth = portrait.naturalWidth;
      const sourceHeight = sourceWidth * 728 / 1030;
      ctx.save();
      ctx.beginPath(); ctx.rect(20, 100, 1030, 728); ctx.clip();
      ctx.drawImage(portrait, 0, sourceWidth * .03, sourceWidth, sourceHeight, 20, 100, 1030, 728);
      ctx.restore();
    }
    const shade = ctx.createLinearGradient(0, 690, 0, 828);
    shade.addColorStop(0, 'transparent'); shade.addColorStop(1, '#000b');
    ctx.fillStyle = shade; ctx.fillRect(20, 690, 1030, 138);
    ctx.fillStyle = '#fff6eb'; ctx.font = '24px Arial'; ctx.fillText('Patrícia Medronha', 51, 792);
    ctx.fillStyle = '#ece0d0'; ctx.fillRect(1070, 100, 350, 728);
    circle(1245, 327, 78, '#d6b694');
    ctx.textAlign = 'center'; ctx.fillStyle = '#594534'; ctx.font = '300 52px Georgia'; ctx.fillText('PM', 1245, 345);
    ctx.font = '27px Arial'; ctx.fillText('Seu espaço', 1245, 477); ctx.fillText('de cuidado.', 1245, 514);
    ctx.font = '18px Arial'; ctx.fillStyle = '#796953'; ctx.fillText('Escuta. Presença. Acolhimento.', 1245, 568, 298);
    ctx.textAlign = 'left'; ctx.fillStyle = '#c5c9c3'; ctx.font = '20px Arial'; ctx.fillText('Conexão com privacidade', 35, 892);
    circle(631, 882, 29, '#39413c'); circle(711, 882, 29, '#39413c'); circle(801, 882, 32, '#ba5a48');
    ctx.strokeStyle = '#f8f0e5'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.roundRect(625, 869, 12, 20, 6); ctx.stroke();
    ctx.beginPath(); ctx.arc(631, 883, 11, 0, Math.PI); ctx.moveTo(631, 894); ctx.lineTo(631, 901); ctx.stroke();
    ctx.strokeRect(698, 873, 19, 17); ctx.beginPath(); ctx.moveTo(717, 878); ctx.lineTo(726, 873); ctx.lineTo(726, 892); ctx.lineTo(717, 886); ctx.stroke();
    ctx.beginPath(); ctx.arc(801, 890, 15, Math.PI * 1.17, Math.PI * 1.83); ctx.stroke();
    texture.needsUpdate = true;
  }
  texture.userData.ready = new Promise(resolve => {
    portrait.onload = () => { draw(); resolve(); };
    portrait.onerror = () => { draw(); resolve(); };
  });
  portrait.src = new URL('../../hero_patricia.webp', import.meta.url).href;
  draw();
  return texture;
}
