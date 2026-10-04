/* =========================================================
   Laboratório · motor das bibliotecas (home e páginas de catálogo)
   Cada grade [data-lab="3d|pixel|vector|materials"] recebe os cartões do catálogo;
   com [data-home] mostra só os itens marcados home: true.
   - 3D e materiais: UM canvas WebGL fixo do tamanho da janela; cada modelo é desenhado no recorte do seu cartão
   - pixel art: um canvas por cartão, um só laço de animação
   - formas 2D: SVG + CSS (o JS só inclina com o mouse e troca o acabamento)
   ========================================================= */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { DATA, LIBRARIES, TYPES } from './catalog.js?v=32';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = n => String(n).padStart(2, '0');
const mouse = { x: -1e4, y: -1e4 };
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
const onScreen = new Set();                         // palcos visíveis agora (mantido pelo IntersectionObserver)
const screenIO = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));

/* ---------- cartões ---------- */
// [data-lab="objects"] junta modelos + formas + materiais; [data-lab="<tipo>"] mostra um tipo só
const typesOf = lab => LIBRARIES[lab]?.sections ? LIBRARIES[lab].sections.map(([t]) => t) : [lab];
const cardHTML = ({ item, i, type }) => type === 'artifacts' ? `
    <article class="lab-card lab-card--artifacts" style="--mc:${item.color}">
      <header class="lab-card__top"><span class="lab-num">${pad(i + 1)}</span><span class="lab-chip">${item.tags}</span></header>
      <div class="lab-stage" data-tag="${item.tag}" data-src="${new URL(item.src, import.meta.url).href}"></div>
      <div class="lab-card__bottom">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <span class="lab-mode"><i></i><b>Mova o cursor</b> · a cena inclina com você</span>
      </div>
    </article>` : `
    <article class="lab-card lab-card--${type}" style="--mc:${item.color}" tabindex="0" aria-label="${item.name} — clique para trocar">
      <header class="lab-card__top"><span class="lab-num">${pad(i + 1)}</span><span class="lab-chip" data-info>${TYPES[type].label}</span></header>
      <div class="lab-stage">${type === 'pixel' ? '<canvas></canvas>' : type === 'vector' ? vectorSVG(item, `${type}-${i}`) : ''}</div>
      <div class="lab-card__bottom">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <span class="lab-mode"><i></i><b data-mode>${TYPES[type].modes[0]}</b> · clique para trocar</span>
      </div>
    </article>`;
const grids = [...document.querySelectorAll('[data-lab]')].map(grid => {
  const list = typesOf(grid.dataset.lab).flatMap(type => DATA[type].map((item, i) => ({ item, i, type })))
    .filter(({ item }) => !('home' in grid.dataset) || item.home);
  grid.innerHTML = list.map(cardHTML).join('');
  const cards = [...grid.children];
  const items = list.map((e, k) => ({ ...e, card: cards[k], stage: cards[k].querySelector('.lab-stage'), mode: 0 }));
  items.forEach(it => {
    if (it.type === 'artifacts') return;
    const cycle = () => {
      it.mode = (it.mode + 1) % 3;
      it.card.querySelector('[data-mode]').textContent = TYPES[it.type].modes[it.mode];
      it.onMode?.(it.mode);
    };
    it.card.addEventListener('click', cycle);
    it.card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycle(); } });
  });
  return { grid, items };
});
// créditos dos modelos: guardados em catalog.js (campo credit) e em lab/CREDITOS.txt, não aparecem na página
const allItems = grids.flatMap(g => g.items);
const ofType = (...t) => allItems.filter(it => t.includes(it.type));

/* ---------- artefatos: web component só com os objetos (sem fundo/chão), direto no cartão.
   O script (Three.js embutido) só é baixado quando o cartão chega perto da tela. ---------- */
const loaded = new Set();
const arts = ofType('artifacts');
if (arts.length) {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const { tag, src } = e.target.dataset;
    if (!loaded.has(src)) { loaded.add(src); const sc = document.createElement('script'); sc.src = src; document.head.append(sc); }
    const el = document.createElement(tag);
    el.setAttribute('speed', '1');
    el.setAttribute('aria-label', e.target.closest('.lab-card').querySelector('h3').textContent);
    e.target.append(el);
  }), { rootMargin: '400px' });
  arts.forEach(it => io.observe(it.stage));
}

/* ---------- formas 2D: cada composição alterna entre o estado A e o B (classe .is-b no cartão) ---------- */
function vectorSVG(item, id) {
  return `<svg class="lab-svg" viewBox="-6 -6 112 112" aria-hidden="true">
    <defs>
      <pattern id="s-${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="a" width="2.4" height="5"/></pattern>
      <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--k)"/><stop offset="1" style="stop-color:var(--b)"/></linearGradient>
    </defs>
    <g class="lab-svg__shape">${typeof item.svg === 'function' ? item.svg(id) : item.svg}</g></svg>`;
}
const vecItems = ofType('vector');
vecItems.forEach(it => {
  const pals = ['pal-memphis', 'pal-bauhaus', 'pal-neon'];
  it.card.classList.add(pals[0]);
  it.onMode = m => { it.card.classList.remove(...pals); it.card.classList.add(pals[m]); };
  screenIO.observe(it.stage);
  if (reduce) return;
  it.card.addEventListener('pointerenter', () => { it.hold = true; it.card.classList.toggle('is-b'); });   // hover = transforma na hora
  it.card.addEventListener('pointerleave', () => { it.hold = false; it.card.style.setProperty('--rx', '0deg'); it.card.style.setProperty('--ry', '0deg'); });
  it.card.addEventListener('pointermove', e => {
    const r = it.card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    it.card.style.setProperty('--rx', y * -22 + 'deg'); it.card.style.setProperty('--ry', x * 22 + 'deg');
    it.card.style.setProperty('--ex', x * 20 + 'px'); it.card.style.setProperty('--ey', y * 16 + 'px');   // pupila do Olho
  });
});
// como no vídeo: de tempos em tempos todas as composições visíveis se transformam, em cascata
if (vecItems.length && !reduce) setInterval(() => vecItems.forEach((it, k) => {
  if (it.hold || !onScreen.has(it.stage) || document.hidden) return;
  setTimeout(() => it.card.classList.toggle('is-b'), (k % 6) * 110 + Math.random() * 120);
}), 2800);

/* ---------- pixel art ---------- */
const shade = (hex, t) => {                         // t < 0 escurece, t > 0 clareia
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${[n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(t < 0 ? v * (1 + t) : v + (255 - v) * t)).join(',')})`;
};
const lum = hex => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * .3 + (n >> 8 & 255) * .59 + (n & 255) * .11) / 255; };
const pixelItems = ofType('pixel');
pixelItems.forEach(it => {
  const { map, pal } = it.item, gh = map.length, gw = Math.max(...map.map(r => r.length));
  const at = (x, y) => (map[y] || '')[x];
  const on = (x, y) => { const c = at(x, y); return !!c && c !== '.'; };
  // três paletas por pixel: original (com contorno/brilho), neon (claro) e mono (cinza)
  it.P = [];
  for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) {
    if (!on(x, y)) continue;
    const base = pal[at(x, y)] || '#ffffff';
    const edge = !on(x + 1, y) || !on(x, y + 1) ? -.55 : !on(x - 1, y) || !on(x, y - 1) ? .3 : -(y / gh) * .2;
    const g = Math.round(lum(base) * 255).toString(16).padStart(2, '0');
    it.P.push({ x, y, cols: [shade(base, edge), shade(base, Math.max(edge, 0) * .5 + .25), shade(`#${g}${g}${g}`, edge)],
      ox: reduce ? 0 : (Math.random() - .5) * gw * 2, oy: reduce ? 0 : (Math.random() - .5) * gh * 2, vx: 0, vy: 0, sp: 0 });
  }
  Object.assign(it, { gw, gh, burst: 0, cv: it.stage.querySelector('canvas') });
  it.ctx = it.cv.getContext('2d');
  it.card.addEventListener('pointerenter', () => { if (!reduce) it.burst = 1; });
  it.onMode = () => { it.burst = .6; if (reduce) drawPixel(it, 0); };
});
const PDPR = Math.min(devicePixelRatio || 1, 2);
pixelItems.forEach(it => screenIO.observe(it.stage));
const sizePixels = () => pixelItems.forEach(it => {
  it.W = it.stage.clientWidth; it.H = it.stage.clientHeight;
  it.cv.width = Math.round(it.W * PDPR); it.cv.height = Math.round(it.H * PDPR);
  it.c = Math.floor(Math.min(it.W / (it.gw + 4), it.H / (it.gh + 3)));
});
const drawPixel = (it, t) => {
  const { ctx, W, H, c, gw, gh } = it;
  if (!c) return;
  const x0 = (W - gw * c) / 2, y0 = (H - gh * c) / 2;
  const r = it.cv.getBoundingClientRect(), mx = mouse.x - r.left - x0, my = mouse.y - r.top - y0, R = c * 5;
  const burst = it.burst; it.burst *= .9;
  ctx.setTransform(PDPR, 0, 0, PDPR, 0, 0); ctx.clearRect(0, 0, W, H);
  const neon = it.mode === 1;
  if (neon) ctx.globalCompositeOperation = 'lighter';
  for (const p of it.P) {
    let tx = 0, ty = reduce ? 0 : Math.sin(t * 3 + p.x * .55 + p.y * .3) * .16;
    if (burst > .02) {
      const dx = p.x - gw / 2 + .5, dy = p.y - gh / 2 + .5, dd = Math.hypot(dx, dy) || 1;
      tx += dx / dd * burst * 4; ty += dy / dd * burst * 4;
    }
    if (!reduce) {
      const ex = (p.x + .5 + p.ox) * c - mx, ey = (p.y + .5 + p.oy) * c - my, de = Math.hypot(ex, ey) || 1;
      if (de < R) { const f = (1 - de / R) * .9; p.vx += ex / de * f; p.vy += ey / de * f; }
      p.vx = (p.vx + (tx - p.ox) * .12) * .78; p.vy = (p.vy + (ty - p.oy) * .12) * .78;
      p.ox += p.vx; p.oy += p.vy;
      if (Math.random() < .002) p.sp = 1;
    }
    const X = x0 + (p.x + p.ox) * c, Y = y0 + (p.y + p.oy) * c, col = p.cols[it.mode];
    if (neon) { ctx.globalAlpha = .18; ctx.fillStyle = col; ctx.fillRect(X - c * .6, Y - c * .6, c * 2.2, c * 2.2); ctx.globalAlpha = 1; }
    ctx.fillStyle = col; ctx.fillRect(X, Y, c, c);
    if (p.sp > .02) { ctx.fillStyle = `rgba(255,255,255,${p.sp * .8})`; ctx.fillRect(X, Y, c, c); p.sp *= .9; }
    if (!neon && c > 4) { ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1; ctx.strokeRect(X + .5, Y + .5, c - 1, c - 1); }
  }
  ctx.globalCompositeOperation = 'source-over';
};

/* ---------- animações: elementos do Uiverse (github.com/uiverse-io/galaxy, MIT) em lab/uiverse.
   Cada um vai num Shadow DOM (o CSS dele não vaza para o site), é baixado quando chega perto da tela
   e escalado para caber no palco. Hover acelera; o clique troca a velocidade (1× · 2× · 0,5×). ---------- */
const animItems = ofType('anims');
const RATES = [1, 2, .5];
const setRate = it => it.root?.getAnimations?.().forEach(a => { a.playbackRate = RATES[it.mode] * (it.over ? 1.8 : 1); });
const fitAnim = it => {
  const box = it.box; if (!box) return;
  box.style.transform = 'none';
  const r = box.getBoundingClientRect(), W = it.stage.clientWidth, H = it.stage.clientHeight;
  if (!r.width || !r.height) return;
  box.style.transform = `scale(${Math.min(W * .78 / r.width, H * .78 / r.height, 2.4) * (it.item.fit || 1)})`;   // fit: ajuste fino (brilho/desfoque fora da caixa)
};
const animIO = new IntersectionObserver(es => es.forEach(async e => {
  if (!e.isIntersecting) return;
  animIO.unobserve(e.target);
  const it = animItems.find(a => a.stage === e.target);
  try {
    const src = await (await fetch(new URL(it.item.src, import.meta.url))).text();
    it.root = it.stage.attachShadow({ mode: 'open' });
    it.root.innerHTML = `<style>:host{display:grid;place-items:center;overflow:hidden}.uv-box{display:inline-block;transform-origin:center}</style><div class="uv-box">${src}</div>`;
    it.box = it.root.querySelector('.uv-box');
    requestAnimationFrame(() => { fitAnim(it); setRate(it); });
  } catch (err) { console.warn('Animação não carregou:', it.item.name, err); }
}), { rootMargin: '400px' });
animItems.forEach(it => {
  animIO.observe(it.stage);
  it.onMode = () => setRate(it);
  it.card.addEventListener('pointerenter', () => { it.over = true; setRate(it); });
  it.card.addEventListener('pointerleave', () => { it.over = false; setRate(it); });
});
const sizeAnims = () => animItems.forEach(fitAnim);

/* ---------- 3D e materiais: um renderer, uma cena por cartão ---------- */
const glItems = ofType('models', '3d', 'materials');
let gl = null;
if (glItems.length) {
  try {
    const canvas = document.createElement('canvas');
    canvas.className = 'lab-gl'; canvas.setAttribute('aria-hidden', 'true');
    document.body.append(canvas);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setScissorTest(true);
    const env = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
    const A = { RoundedBoxGeometry };
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);   // modelos comprimidos com meshopt + texturas WebP
    // fila: um modelo por vez, para o download/decodificação não travar a rolagem
    const queue = []; let busy = false;
    const pump = () => {
      if (busy || !queue.length) return;
      busy = true;
      queue.shift().load(() => { busy = false; setTimeout(pump, 120); });
    };
    const nearIO = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      nearIO.unobserve(e.target);
      const it = glItems.find(g => g.stage === e.target);
      if (it?.load) { queue.push(it); pump(); }
    }), { rootMargin: '600px 0px' });

    const blobGeo = () => {
      const g = new THREE.IcosahedronGeometry(.85, 12);
      g.deleteAttribute('uv'); g.deleteAttribute('normal');
      const m = mergeVertices(g); m.computeVertexNormals();
      m.userData.base = m.attributes.position.array.slice();
      return m;
    };
    const canvasTex = draw => {                       // textura procedural (sem baixar imagem)
      const c = document.createElement('canvas'); c.width = c.height = 512;
      draw(c.getContext('2d'), 512);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    };
    const tex = {
      wood: () => canvasTex((g, S) => {
        g.fillStyle = '#b97a45'; g.fillRect(0, 0, S, S);
        for (let i = 0; i < 160; i++) {                 // veios: linhas onduladas mais escuras
          const x = Math.random() * S, a = .08 + Math.random() * .22, k = Math.random() * 6;
          g.strokeStyle = `rgba(70, 35, 12, ${a})`; g.lineWidth = 1 + Math.random() * 4; g.beginPath();
          for (let y = 0; y <= S; y += 8) g.lineTo(x + Math.sin(y / 60 + k) * 10 + Math.sin(y / 17 + k) * 3, y);
          g.stroke();
        }
      }),
      marble: () => canvasTex((g, S) => {
        g.fillStyle = '#ece9e2'; g.fillRect(0, 0, S, S);
        g.filter = 'blur(1px)';
        for (let i = 0; i < 26; i++) {                  // veios: caminhadas aleatórias
          let x = Math.random() * S, y = Math.random() * S, ang = Math.random() * 6.3;
          g.strokeStyle = `rgba(70, 72, 84, ${.12 + Math.random() * .3})`; g.lineWidth = .6 + Math.random() * 2.4;
          g.beginPath(); g.moveTo(x, y);
          for (let s = 0; s < 60; s++) { ang += (Math.random() - .5) * .6; x += Math.cos(ang) * 9; y += Math.sin(ang) * 9; g.lineTo(x, y); }
          g.stroke();
        }
      })
    };
    /* animações dedicadas de cada modelo GLB (catalog.js → motion). Cada fábrica recebe as peças do modelo
       e devolve (t, e, rig) => {…}: t = tempo próprio, e = energia do hover (0–1), rig = grupo com origem na base */
    const V3 = THREE.Vector3;
    const axisVec = a => new V3(+(a === 'x'), +(a === 'y'), +(a === 'z'));
    const longest = v => v.x >= v.y && v.x >= v.z ? 'x' : v.z >= v.y ? 'z' : 'y';
    const longH = v => v.x >= v.z ? 'x' : 'z';               // eixo horizontal mais comprido
    const otherH = a => a === 'x' ? 'z' : 'x';
    const pivotAt = (root, obj, worldPt) => {                 // pivô num ponto, mantendo a peça no lugar
      const p = new THREE.Object3D(); p.position.copy(root.worldToLocal(worldPt.clone()));
      root.add(p); p.updateMatrixWorld(true); p.attach(obj); return p;
    };
    const MOTIONS = {
      // borboleta: o corpo fica parado e as quatro asas batem juntas na junção com o corpo
      // (abertas/deitadas ↔ quase em pé), devagar, ~1,5 s por batida; as de baixo vêm um pouco atrás.
      flap: ({ root }) => {
        const body = root.getObjectByName('Body'); if (!body) return null;
        const bb = new THREE.Box3().setFromObject(body), bc = bb.getCenter(new V3()), L = longest(bb.getSize(new V3())), ax = axisVec(L);
        // o GLTFLoader troca espaços por "_" nos nomes (Upper right → Upper_right)
        const byName = n => root.getObjectByName(n) || root.getObjectByName(n.replace(/ /g, '_'));
        const wings = ['Upper right', 'Bottom right', 'Upper left', 'Bottom left'].map(byName).filter(Boolean).map(w => {
          const wb = new THREE.Box3().setFromObject(w), off = wb.getCenter(new V3()).sub(bc);
          const open = off.clone().applyAxisAngle(ax, .3).y < off.y ? 1 : -1;   // sinal que ABRE a asa (desce em direção à horizontal)
          const hinge = bc.clone(); hinge.y = wb.min.y;                         // dobradiça: junção da asa com o corpo
          return { p: pivotAt(root, w, hinge), open, lag: /^bottom/i.test(w.name) ? .12 : 0 };
        });
        const OPEN = .95, SHUT = .1;                                             // aberta = asa deitada; fechada = asa quase em pé (curso menor = mais suave)
        return t => {
          wings.forEach(({ p, open, lag }) => {
            const c = .5 - .5 * Math.cos(t * 4.2 - lag);                         // as duas asas juntas, ~1,5 s por batida; 0 = aberta, 1 = fechada
            p.rotation[L] = open * (OPEN - c * (OPEN - SHUT));
          });
        };
      },
      // lata: chacoalha, pula e dá um giro completo
      shake: ({ size }) => (t, e, rig) => {
        const c = t % 3;
        rig.rotation.z = c < .7 ? Math.sin(c * 60) * .1 * (1 - c / .7) : 0;
        const k = c >= .7 && c < 1.5 ? (c - .7) / .8 : 0;
        rig.position.y = Math.sin(k * Math.PI) * size.y * (.35 + e * .2);
        rig.rotation.y = k * Math.PI * 2;
      },
      // óculos: as hastes dobram e abrem na dobradiça; com o mouse em cima ficam abertas
      hinge: ({ root }) => {
        const frames = root.getObjectByName('Frames'); if (!frames) return null;
        const fc = new THREE.Box3().setFromObject(frames).getCenter(new V3());
        const arms = ['Right', 'Left'].map(side => {
          const temple = root.getObjectByName('Temple' + side), hook = root.getObjectByName('Earhook' + side);
          if (!temple) return null;
          const tb = new THREE.Box3().setFromObject(temple); if (hook) tb.expandByObject(hook);
          const tc = tb.getCenter(new V3()), D = longest(tb.getSize(new V3())), hingePt = tc.clone();
          hingePt[D] = Math.abs(tb.min[D] - fc[D]) < Math.abs(tb.max[D] - fc[D]) ? tb.min[D] : tb.max[D];
          const test = tc.clone().sub(hingePt).applyAxisAngle(new V3(0, 1, 0), .5).add(hingePt);
          const s = Math.abs(test.x - fc.x) < Math.abs(tc.x - fc.x) ? 1 : -1;    // sinal que dobra para dentro
          const p = pivotAt(root, temple, hingePt); if (hook) p.attach(hook);
          return { p, s };
        }).filter(Boolean);
        let fold = 0;
        return (t, e) => {
          const target = e > .3 ? 0 : Math.max(0, Math.sin(t * 1.3)) ** .7;
          fold += (target - fold) * .12;
          arms.forEach(({ p, s }) => { p.rotation.y = s * fold * 1.45; });
        };
      },
      // raposa: anda; com o mouse em cima, corre (troca suave entre as animações do arquivo)
      fox: ({ actions }) => {
        const walk = actions.Walk, run = actions.Run; if (!walk || !run) return null;
        let running = false;
        return (t, e) => {
          const want = e > .5; if (want === running) return;
          running = want; const [from, to] = want ? [walk, run] : [run, walk];
          to.reset().play(); from.crossFadeTo(to, .35, false);
        };
      },
      // vaso: as flores balançam a partir da boca do vaso
      sway: ({ root }) => {
        const fl = root.getObjectByName('Flowers1') || root.getObjectByName('Flowers2');
        let p = null;
        if (fl) { const b = new THREE.Box3().setFromObject(fl), base = b.getCenter(new V3()); base.y = b.min.y; p = pivotAt(root, fl, base); }
        return (t, e, rig) => {
          if (p) { p.rotation.z = Math.sin(t * 1.6) * (.09 + e * .12); p.rotation.x = Math.sin(t * 1.1 + 1) * (.05 + e * .06); }
          rig.rotation.z = Math.sin(t * 1.2) * .025;
        };
      },
      // cadeira: balança para frente e para trás sobre a base
      rock: () => (t, e, rig) => { rig.rotation.x = Math.sin(t * 1.8) * (.1 + e * .1); },
      // luminária: a película iridescente muda de cor e a cúpula acena
      shimmer: ({ root }) => {
        const mats = [];
        root.traverse(o => o.isMesh && (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.iridescence > 0 && mats.push(m)));
        return (t, e, rig) => {
          const th = 250 + 650 * (.5 + .5 * Math.sin(t * (1.4 + e * 2)));
          mats.forEach(m => { m.iridescenceThicknessRange = [100, th]; });
          rig.rotation.x = Math.sin(t * .9) * .06;
        };
      },
      // carrinho: anda para frente e para trás, com a suspensão quicando e inclinando na arrancada
      drive: ({ size }) => {
        const L = longH(size), P = otherH(L), sign = L === 'x' ? 1 : -1;
        return (t, e, rig) => {
          const w = 1.2 + e * 1.2;
          rig.position[L] = Math.sin(t * w) * size[L] * .2;
          rig.position.y = Math.abs(Math.sin(t * 9)) * size.y * .025;
          rig.rotation[P] = -Math.cos(t * w) * .05 * sign;
        };
      },
      // tênis: passo — rola do calcanhar para a ponta e dá um pulinho
      step: ({ size }) => {
        const L = longH(size), P = otherH(L), sign = L === 'x' ? -1 : 1;
        return (t, e, rig) => {
          const ph = t * (3 + e * 2);
          rig.rotation[P] = Math.sin(ph) * .2 * sign;
          rig.position.y = Math.max(0, Math.sin(ph)) * size.y * (.18 + e * .15);
        };
      },
      // abacate: quica com amassa-e-estica
      bounce: ({ size }) => (t, e, rig) => {
        const h = Math.abs(Math.sin(t * (2.6 + e * 1.5)));
        rig.position.y = h * size.y * (.3 + e * .2);
        const sy = .8 + h * .3, sx = 1 / Math.sqrt(sy);
        rig.scale.set(sx, sy, sx);
      }
    };

    const MAT_GEOS = [() => new THREE.SphereGeometry(.85, 64, 48), () => new THREE.TorusKnotGeometry(.55, .18, 200, 32), () => new RoundedBoxGeometry(1.05, 1.05, 1.05, 6, .16)];

    glItems.forEach((it, n) => {
      const { item } = it, color = new THREE.Color(item.color);
      const scene = new THREE.Scene(); scene.environment = env;
      const camera = new THREE.PerspectiveCamera(32, 1, .1, 20); camera.position.set(0, .1, 4.2);
      const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2, 3, 2); scene.add(key);
      const rim = new THREE.DirectionalLight(color, 2.2); rim.position.set(-3, 1, -2); scene.add(rim);
      const pivot = new THREE.Group(); scene.add(pivot);
      const mesh = new THREE.Mesh(); pivot.add(mesh);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const info = it.card.querySelector('[data-info]');
      const faces = g => `${Math.round((g.index ? g.index.count : g.attributes.position.count) / 3).toLocaleString('pt-BR')} faces`;

      if (it.type === 'models') {
        info.textContent = TYPES.models.label;
        it.ready = false;
        it.load = done => {                           // chamado pela fila quando o cartão chega a 600px da tela
          it.load = null; info.textContent = 'carregando…';
          loader.load(new URL(item.file, import.meta.url).href, gltf => {
            const root = gltf.scene, box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
            root.position.sub(center);                  // centraliza e cabe numa esfera de raio ~1
            root.updateMatrixWorld(true);
            const actions = {};
            if (gltf.animations.length) {             // animação do próprio arquivo (andar, ponteiros, tampa…)
              it.mixer = new THREE.AnimationMixer(root);
              gltf.animations.forEach(c => { actions[c.name] = it.mixer.clipAction(c); });
              const clip = THREE.AnimationClip.findByName(gltf.animations, item.anim) || gltf.animations[0];
              actions[clip.name].play();
            }
            it.motion = MOTIONS[item.motion]?.({ root, size, actions }) || null;
            // rig: origem na base do modelo, para balançar/quicar/inclinar apoiado no "chão"
            // (base centraliza no cartão; rig fica livre para as animações moverem/girarem/escalarem)
            const rig = new THREE.Group(); root.position.y += size.y / 2; rig.add(root);
            const base = new THREE.Group(); base.position.y = -size.y / 2; base.add(rig);
            it.rig = rig; it.mt = 0;
            const holder = new THREE.Group(); holder.add(base);
            if (item.glow) {                            // halo suave atrás do modelo, como na referência
              const c = document.createElement('canvas'); c.width = c.height = 128;
              const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
              gr.addColorStop(0, item.glow); gr.addColorStop(1, 'rgba(0,0,0,0)');
              g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
              const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, opacity: .35, depthWrite: false, blending: THREE.AdditiveBlending }));
              halo.scale.setScalar(2.6); halo.position.z = -.9; scene.add(halo);
            }
            holder.scale.setScalar(1.9 / Math.max(size.x, size.y, size.z));
            holder.rotation.set(...(item.tilt || [0, 0, 0]));
            mesh.add(holder);                           // ainda não desenhado: it.ready = false até compilar
            const meshes = []; root.traverse(o => { if (o.isMesh) meshes.push([o, o.material]); });
            // vidro transmissivo → vidro por transparência (mais leve e funciona no canvas compartilhado)
            meshes.forEach(([, m]) => (Array.isArray(m) ? m : [m]).forEach(mt => {
              if (mt.transmission > 0) { mt.transmission = 0; mt.transparent = true; mt.opacity = Math.min(mt.opacity, .38); mt.depthWrite = false; mt.envMapIntensity = 2; }
            }));
            const clay = new THREE.MeshStandardMaterial({ color: '#d9d4cc', roughness: .75 });
            const wire = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: .8 });
            it.onMode = m => { meshes.forEach(([o, orig]) => { o.material = m === 0 ? orig : m === 1 ? clay : wire; }); it.pop = 1; };
            it.onMode(it.mode);
            // shaders compilados e texturas enviadas à GPU ANTES de aparecer: sem engasgo no primeiro quadro
            renderer.compileAsync(scene, camera).catch(() => {}).then(() => {
              root.traverse(o => o.isMesh && (Array.isArray(o.material) ? o.material : [o.material])
                .forEach(m => Object.values(m).forEach(v => v?.isTexture && renderer.initTexture(v))));
              it.ready = true; info.textContent = TYPES.models.label; done();
            });
          }, undefined, err => { info.textContent = 'erro ao carregar'; console.warn(item.file, err); done(); });
        };
        mesh.rotation.set(0, 0, 0);
      } else if (it.type === '3d') {
        const geo = item.blob ? blobGeo() : item.geo(THREE, A);
        const mats = [
          new THREE.MeshPhysicalMaterial({ color, roughness: .18, clearcoat: 1, clearcoatRoughness: .08, flatShading: !!item.flat }),
          new THREE.MeshStandardMaterial({ color, metalness: 1, roughness: .22, flatShading: !!item.flat, envMapIntensity: 1.4 }),
          new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: .9 })
        ];
        it.mode = item.start || 0;                                         // start: acabamento inicial (0 brilho, 1 metal, 2 wireframe)
        mesh.geometry = geo; mesh.material = mats[it.mode];
        it.card.querySelector('[data-mode]').textContent = TYPES['3d'].modes[it.mode];
        if (item.flat) mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35 })));
        info.textContent = faces(geo);
        it.onMode = m => { mesh.material = mats[m]; it.pop = 1; };
        it.blob = !!item.blob; it.geo = geo;
      } else {
        const geos = MAT_GEOS.map(f => f());
        it.mode = item.start || 0;                                         // start: forma inicial (0 esfera, 1 nó, 2 cubo)
        mesh.geometry = geos[it.mode]; mesh.material = item.mat(THREE, tex);
        info.textContent = TYPES.materials.modes[it.mode];
        it.card.querySelector('[data-mode]').textContent = TYPES.materials.modes[it.mode];
        it.onMode = m => { mesh.geometry = geos[m]; info.textContent = TYPES.materials.modes[m]; it.pop = 1; };
      }
      Object.assign(it, { scene, camera, mesh, pivot, hover: 0, hoverT: 0, mx: 0, my: 0, tx: 0, ty: 0, pop: 0, seed: n });
      it.card.addEventListener('pointermove', e => {
        const r = it.card.getBoundingClientRect();
        it.tx = (e.clientX - r.left) / r.width * 2 - 1; it.ty = (e.clientY - r.top) / r.height * 2 - 1;
      });
      it.card.addEventListener('pointerenter', () => { it.hoverT = 1; });
      it.card.addEventListener('pointerleave', () => { it.hoverT = 0; it.tx = it.ty = 0; });
      screenIO.observe(it.stage);
      if (it.load) nearIO.observe(it.stage);
    });

    const deform = (it, time) => {                    // blob: ondas somadas empurram cada vértice ao longo do raio
      const pos = it.geo.attributes.position, base = it.geo.userData.base, a = pos.array;
      for (let i = 0; i < a.length; i += 3) {
        const x = base[i], y = base[i + 1], z = base[i + 2];
        const k = 1 + .09 * (Math.sin(x * 3.1 + time * 1.4) + Math.sin(y * 3.7 + time * 1.1) + Math.sin(z * 4.3 + time * .8)) * (1 + it.hover * .8);
        a[i] = x * k; a[i + 1] = y * k; a[i + 2] = z * k;
      }
      pos.needsUpdate = true; it.geo.computeVertexNormals();
    };
    let lastY = scrollY, spin = 0, dirty = true, slow = 0, frames = 0;
    gl = {
      size: () => renderer.setSize(innerWidth, innerHeight, false),
      frame: (t, dt) => {
        if (dt > 0 && renderer.getPixelRatio() > 1) {   // máquina sofrendo: baixa a resolução uma vez
          frames++; slow += dt > .024 ? 1 : 0;
          if (frames >= 90) { if (slow > 45) { renderer.setPixelRatio(1); gl.size(); } frames = slow = 0; }
        }
        const dy = scrollY - lastY; lastY = scrollY;
        spin += (Math.min(Math.abs(dy) * .004, .25) - spin) * .1;     // rolagem acelera o giro
        const vis = glItems.filter(it => onScreen.has(it.stage) && it.ready !== false);
        if (!vis.length) {                               // nada na tela: limpa uma vez e descansa
          if (dirty) { renderer.setScissor(0, 0, innerWidth, innerHeight); renderer.clear(); dirty = false; }
          return;
        }
        dirty = true;
        renderer.setScissor(0, 0, innerWidth, innerHeight); renderer.clear();
        for (const it of vis) {
          it.hover += (it.hoverT - it.hover) * .08;
          it.mx += (it.tx - it.mx) * .08; it.my += (it.ty - it.my) * .08;
          it.pop *= .9;
          if (it.item.spin !== false) it.mesh.rotation.y += dt * (it.type === 'models' ? .15 + it.hover * .35 : .35 + it.hover * 1.4) + (reduce ? 0 : spin);
          if (it.type !== 'models') it.mesh.rotation.x += dt * .12;
          it.pivot.rotation.set(it.my * .5, it.mx * .7, 0);
          it.pivot.scale.setScalar(1 + it.hover * .1 + Math.sin(it.pop * Math.PI) * .12);
          it.pivot.position.y = reduce || it.item.still ? 0 : Math.sin(t * 1.3 + it.seed * 1.1) * .06;   // still: sem flutuar (borboleta)
          if (it.blob && !reduce) deform(it, t);
          if (it.mixer) { it.mixer.timeScale = it.item.motion === 'fox' ? 1 : 1 + it.hover * 1.5; it.mixer.update(dt); }   // hover acelera prato e relógio
          if (it.motion && !reduce) { it.mt += dt * (1 + it.hover * .8); it.motion(it.mt, it.hover, it.rig); }
          const r = it.stage.getBoundingClientRect(), y = innerHeight - r.bottom;
          renderer.setViewport(r.left, y, r.width, r.height);
          renderer.setScissor(r.left, y, r.width, r.height);
          it.camera.aspect = r.width / r.height; it.camera.updateProjectionMatrix();
          renderer.render(it.scene, it.camera);
        }
      }
    };
  } catch (err) {
    console.warn('Laboratório 3D desativado:', err);  // sem WebGL: ficam só os cartões
  }
}

/* ---------- um só laço para tudo ---------- */
const sizeAll = () => { sizePixels(); sizeAnims(); gl?.size(); };
sizeAll();
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(sizeAll, 150); });
document.fonts?.ready.then(sizeAll);
let t = 0, prev = 0;
const loop = now => {
  requestAnimationFrame(loop);
  const dt = reduce ? 0 : Math.min((now - (prev || now)) / 1000, .05); prev = now; t += dt;
  for (const it of pixelItems) if (onScreen.has(it.stage)) drawPixel(it, t);
  gl?.frame(t, dt);
};
requestAnimationFrame(loop);
