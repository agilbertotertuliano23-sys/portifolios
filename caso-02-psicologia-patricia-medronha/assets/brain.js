import * as T from './vendor/three/three.module.min.js';
import { RoomEnvironment } from './vendor/three/RoomEnvironment.js';
import { GLTFLoader } from './vendor/three/GLTFLoader.js';

const GLOW = new T.Color(0xf6f1ea);
// Profile view, frontal lobe to the left, as in the reference illustration.
const BASE_YAW = -1.38;

// Shared uniforms: brain lines, filaments and dust react to the same pointer.
function createUniforms() {
  return {
    uTime: { value: 0 },
    uHover: { value: 0 },
    uHit: { value: new T.Vector3(0, 0, 9) },
    uPulseOrigin: { value: new T.Vector3(0, 0, 9) },
    uPulseAge: { value: 9 },
    uFill: { value: 0 },
    uFillOrigin: { value: new T.Vector3() },
    uGlow: { value: GLOW },
  };
}

// Line drawing of the brain: sulci (dark strokes in the albedo map) become luminous white lines.
// The body stays hollow (page shows through); selecting lights the lines outward from the selection point.
function enhanceMaterial(material, uniforms) {
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vBrainWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBrainWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
uniform float uTime, uHover, uPulseAge, uFill;
uniform vec3 uHit, uPulseOrigin, uFillOrigin, uGlow;
varying vec3 vBrainWorld;`)
      .replace('#include <map_fragment>', `#include <map_fragment>
float brainLuma = dot(diffuseColor.rgb, vec3(.299, .587, .114));
float brainLine = smoothstep(.36, .16, brainLuma);
float brainGrain = smoothstep(.5, .3, brainLuma) * .5;
diffuseColor.rgb = vec3(.018, .016, .015) + vec3(brainLuma * .035);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
vec3 p = vBrainWorld;
float wave = sin(p.y * 4.0 + p.x * 2.5 - uTime * 1.4) * sin(p.z * 3.5 + uTime * .9);
float idle = pow(max(wave, 0.0), 5.0);
float hitDistance = distance(p, uHit);
float spot = (1.0 - smoothstep(0.0, .9, hitDistance)) * uHover;
float rings = spot * pow(.5 + .5 * sin(hitDistance * 26.0 - uTime * 7.0), 3.0);
float pulseDistance = distance(p, uPulseOrigin);
float pulse = (1.0 - smoothstep(0.0, .22, abs(pulseDistance - uPulseAge * 2.0))) * (1.0 - clamp(uPulseAge / 1.6, 0.0, 1.0));
float fresnel = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 4.5);
// Fold walls bend the mapped normal away from the surface normal: that bend draws the sulci as strokes.
float crease = smoothstep(.2, .5, 1.0 - dot(normal, nonPerturbedNormal));
float lines = max(crease, brainLine * .2) + brainGrain * spot * .5;
float fillDistance = distance(p, uFillOrigin);
float fillRadius = uFill * 4.4;
float filled = 1.0 - smoothstep(fillRadius - .35, fillRadius, fillDistance);
float frontier = (1.0 - smoothstep(0.0, .1, abs(fillDistance - fillRadius))) * step(.001, uFill) * (1.0 - uFill);
totalEmissiveRadiance += uGlow * (lines * (.7 + filled * .6 + idle * .6 + spot * 1.2 + rings * 1.2 + pulse * 2.6) + fresnel * (.6 + .35 * filled) + frontier * 1.4);
// Only strokes and the silhouette are opaque; everything else stays hollow.
diffuseColor.a = clamp(lines * 1.25 + fresnel * .9 + frontier, 0.0, 1.0);`);
  };
  material.customProgramCacheKey = () => 'brain-lines';
  material.envMapIntensity = .35;
  material.transparent = true;
  // The canvas composites premultiplied colour; without this, hollow pixels still add light.
  material.premultipliedAlpha = true;
  // Hollow but still writes depth, so only the facing side's lines are drawn.
  material.depthWrite = true;
}

// Thin white strands drifting off the brain, like the loose wisps in the reference.
function createFilaments(uniforms, count) {
  const positions = [], progress = [], seeds = [];
  const point = new T.Vector3(), direction = new T.Vector3(), turn = new T.Vector3();
  for (let s = 0; s < count; s++) {
    const seed = Math.random();
    direction.randomDirection();
    direction.y *= .75;
    point.copy(direction).multiply(new T.Vector3(1.35, 1.05, 1.15)).multiplyScalar(.82 + Math.random() * .12);
    direction.normalize();
    const steps = 30 + Math.floor(Math.random() * 34);
    const length = .035 + Math.random() * .05;
    let previous = point.clone();
    for (let i = 1; i <= steps; i++) {
      turn.randomDirection().multiplyScalar(.62);
      direction.add(turn).normalize();
      direction.addScaledVector(point.clone().normalize(), .18).normalize();
      point.addScaledVector(direction, length);
      positions.push(previous.x, previous.y, previous.z, point.x, point.y, point.z);
      progress.push((i - 1) / steps, i / steps);
      seeds.push(seed, seed);
      previous = point.clone();
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('aT', new T.Float32BufferAttribute(progress, 1));
  geometry.setAttribute('aSeed', new T.Float32BufferAttribute(seeds, 1));
  const material = new T.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    vertexShader: `uniform float uTime, uHover;
uniform vec3 uHit;
attribute float aT, aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  p += vec3(sin(uTime * .8 + aSeed * 31.0 + aT * 5.0), cos(uTime * .6 + aSeed * 17.0 + aT * 4.0), sin(uTime * .7 + aSeed * 23.0)) * .07 * aT;
  vec4 world = modelMatrix * vec4(p, 1.0);
  float near = uHover * (1.0 - smoothstep(0.0, 1.5, distance(world.xyz, uHit)));
  world.xyz += normalize(world.xyz - uHit + 1e-4) * near * .25 * aT;
  float flow = pow(fract(aT * 1.4 - uTime * (.25 + aSeed * .2) + aSeed * 7.0), 10.0);
  float ends = sin(aT * 3.14159);
  vAlpha = ends * (.3 + flow * .8 + near * .9);
  gl_Position = projectionMatrix * viewMatrix * world;
}`,
    fragmentShader: `uniform vec3 uGlow;
varying float vAlpha;
void main() { gl_FragColor = vec4(uGlow, vAlpha); }`,
  });
  return new T.LineSegments(geometry, material);
}

function createDust(uniforms, count) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const angle = Math.random() * Math.PI * 2;
    const ring = Math.sqrt(1 - u * u);
    const radius = 1.7 + Math.random() * 1.1;
    positions.set([Math.cos(angle) * ring * radius * 1.2, u * radius * .85, Math.sin(angle) * ring * radius], i * 3);
    seeds[i] = Math.random();
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position', new T.BufferAttribute(positions, 3));
  geometry.setAttribute('aSeed', new T.BufferAttribute(seeds, 1));
  const material = new T.ShaderMaterial({
    uniforms: { ...uniforms, uSize: { value: 18 * Math.min(devicePixelRatio, 1.75) } },
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    vertexShader: `uniform float uTime, uHover, uSize;
uniform vec3 uHit;
attribute float aSeed;
varying float vAlpha;
void main() {
  vec3 p = position;
  float a = uTime * (.04 + .1 * aSeed) * (1.0 + uHover * 2.5);
  p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
  p.y += sin(uTime * .7 + aSeed * 20.0) * .06;
  vec3 toHit = uHit - p;
  float pull = uHover * (1.0 - smoothstep(0.0, 1.7, length(toHit)));
  p += normalize(toHit + 1e-4) * pull * .4;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vAlpha = (.2 + .8 * pow(.5 + .5 * sin(uTime * 2.0 + aSeed * 40.0), 3.0)) * (1.0 + pull * 1.5);
  gl_PointSize = uSize * (.3 + aSeed * .7) * (1.0 + pull) / -mv.z;
  gl_Position = projectionMatrix * mv;
}`,
    fragmentShader: `uniform vec3 uGlow;
varying float vAlpha;
void main() {
  float disc = smoothstep(.5, 0.0, length(gl_PointCoord - .5));
  gl_FragColor = vec4(uGlow, disc * disc * vAlpha * .7);
}`,
  });
  return new T.Points(geometry, material);
}

export async function mountBrain(stage) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px)').matches;
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    stage.dataset.renderMode = 'fallback';
    return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(30, 1, .1, 40);
  camera.position.set(0, .3, 7.4);
  camera.lookAt(0, 0, 0);
  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new T.HemisphereLight(0xffffff, 0x0b0a09, .5));
  const key = new T.DirectionalLight(0xffffff, 1.4);
  key.position.set(-4, 4, 5);
  scene.add(key);
  const rim = new T.DirectionalLight(0xfff4ea, 2.4);
  rim.position.set(3, 3, -5);
  scene.add(rim);

  const uniforms = createUniforms();
  const gltf = await new GLTFLoader().loadAsync(new URL('./models/human_brain.glb', import.meta.url).href);
  const model = gltf.scene;
  const sphere = new T.Box3().setFromObject(model).getBoundingSphere(new T.Sphere());
  model.position.sub(sphere.center);
  const pivot = new T.Group();
  pivot.scale.setScalar(1.75 / sphere.radius);
  pivot.add(model);
  const brain = new T.Group();
  brain.add(pivot);
  brain.rotation.y = BASE_YAW;
  scene.add(brain);

  const meshes = [];
  const sparkPoints = [];
  model.traverse(object => {
    if (!object.isMesh) return;
    meshes.push(object);
    enhanceMaterial(object.material, uniforms);
    const position = object.geometry.attributes.position;
    for (let i = 0; i < 160; i++) sparkPoints.push({ mesh: object, index: Math.floor(Math.random() * position.count) });
  });
  const filaments = createFilaments(uniforms, compact ? 120 : 240);
  filaments.renderOrder = 1;
  brain.add(filaments);
  const dust = createDust(uniforms, compact ? 260 : 480);
  dust.renderOrder = 1;
  scene.add(dust);

  stage.append(renderer.domElement);

  const raycaster = new T.Raycaster();
  const pointer = new T.Vector2();
  const clock = new T.Clock();
  const scratch = new T.Vector3();
  let pointerInside = false, pointerDirty = false, hovering = false;
  let targetYaw = 0, targetPitch = 0, yaw = 0, pitch = 0;
  let spin = 0, spinVelocity = 0;
  let drag = null;
  let pinned = false;
  let nextSpark = 1.2;
  let visible = true, frame = 0, disposed = false;

  function pickSurface() {
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(meshes, false)[0];
    return hit ? hit.point : null;
  }
  function firePulse(point) {
    uniforms.uPulseOrigin.value.copy(point);
    uniforms.uPulseAge.value = 0;
  }
  function randomSpark() {
    const { mesh, index } = sparkPoints[Math.floor(Math.random() * sparkPoints.length)];
    scratch.fromBufferAttribute(mesh.geometry.attributes.position, index);
    firePulse(mesh.localToWorld(scratch));
  }

  function draw() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = Math.min(clock.getDelta(), .05);
    const still = motion.matches;
    if (!still) uniforms.uTime.value += delta;
    const time = uniforms.uTime.value;

    yaw += (targetYaw - yaw) * .08;
    pitch += (targetPitch - pitch) * .08;
    if (!drag) {
      spin += spinVelocity;
      spinVelocity *= .94;
      if (Math.abs(spinVelocity) < .0004) spin *= .985;
    }
    brain.rotation.y = BASE_YAW + (still ? 0 : Math.sin(time * .25) * .4) + yaw + spin;
    brain.rotation.x = pitch + (still ? 0 : Math.sin(time * .41) * .05);
    brain.position.y = still ? 0 : Math.sin(time * .9) * .06;
    brain.updateMatrixWorld();

    if (pointerInside && (pointerDirty || !still)) {
      const point = pickSurface();
      hovering = !!point;
      if (point) uniforms.uHit.value.lerp(point, uniforms.uHover.value < .05 ? 1 : .35);
      stage.classList.toggle('is-hovered', hovering);
      pointerDirty = false;
    }
    uniforms.uHover.value += ((hovering ? 1 : 0) - uniforms.uHover.value) * (still ? 1 : .09);
    const fillTarget = hovering || pinned ? 1 : 0;
    if (fillTarget && uniforms.uFill.value < .02) uniforms.uFillOrigin.value.copy(uniforms.uHit.value);
    uniforms.uFill.value += (fillTarget - uniforms.uFill.value) * (still ? 1 : .05);
    stage.classList.toggle('is-selected', !!fillTarget);
    dust.material.uniforms.uSize.value = 18 * Math.min(devicePixelRatio, 1.75) * (1 + uniforms.uHover.value * .3);

    if (!still) {
      uniforms.uPulseAge.value += delta;
      nextSpark -= delta;
      if (nextSpark <= 0 && !hovering) { randomSpark(); nextSpark = 2.2 + Math.random() * 2; }
    }
    renderer.render(scene, camera);
    const settling = Math.abs(targetYaw - yaw) + Math.abs(targetPitch - pitch) + Math.abs(spinVelocity) + Math.abs(spin) * .02 > .0005
      || Math.abs((hovering ? 1 : 0) - uniforms.uHover.value) > .002
      || Math.abs((hovering || pinned ? 1 : 0) - uniforms.uFill.value) > .002;
    if (!still || settling) requestDraw();
  }
  function requestDraw() { if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(draw); }
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width / height < 1 ? 7.4 / Math.max(width / height, .7) : 7.4;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
    else { clock.getDelta(); requestDraw(); }
  });
  visibilityObserver.observe(stage);

  function updatePointer(event) {
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    pointer.set(x * 2 - 1, -(y * 2 - 1));
    return { x, y };
  }
  // Drag rotates freely with inertia; a click or tap without dragging fires a synapse pulse.
  function down(event) {
    drag = { x: event.clientX, lastX: event.clientX, moved: 0, id: event.pointerId };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
  }
  function move(event) {
    const { x, y } = updatePointer(event);
    if (drag && event.pointerId === drag.id) {
      const step = (event.clientX - drag.lastX) / stage.clientWidth * 4.2;
      drag.lastX = event.clientX;
      drag.moved += Math.abs(step);
      spin += step;
      spinVelocity = step;
    }
    if (event.pointerType === 'touch') { requestDraw(); return; }
    pointerInside = true;
    pointerDirty = true;
    if (!motion.matches && !drag) {
      targetYaw = (x - .5) * .6;
      targetPitch = (y - .5) * .3;
    }
    requestDraw();
  }
  function up(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const tapped = drag.moved < .02;
    drag = null;
    stage.classList.remove('is-dragging');
    if (!tapped) { requestDraw(); return; }
    updatePointer(event);
    const point = pickSurface();
    if (!point) { pinned = false; requestDraw(); return; }
    // Click or tap selects (keeps it filled); selecting again releases it.
    pinned = !pinned;
    firePulse(point);
    uniforms.uHit.value.copy(point);
    if (pinned && uniforms.uFill.value < .02) uniforms.uFillOrigin.value.copy(point);
    requestDraw();
  }
  function leave() {
    if (drag) return;
    pointerInside = false;
    hovering = false;
    targetYaw = 0;
    targetPitch = 0;
    stage.classList.remove('is-hovered');
    requestDraw();
  }
  function keyboard(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') spin = spinVelocity = 0;
    else if (event.key === 'Enter' || event.key === ' ') {
      pinned = !pinned;
      uniforms.uHit.value.set(0, 0, 0);
      randomSpark();
    }
    else spinVelocity = event.key === 'ArrowLeft' ? -.06 : .06;
    requestDraw();
  }
  function onVisibility() {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else { clock.getDelta(); requestDraw(); }
  }
  stage.addEventListener('pointerdown', down);
  stage.addEventListener('pointermove', move, { passive: true });
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
  stage.addEventListener('pointerleave', leave);
  stage.addEventListener('keydown', keyboard);
  motion.addEventListener('change', requestDraw);
  document.addEventListener('visibilitychange', onVisibility);
  stage.tabIndex = 0;
  stage.setAttribute('role', 'group');
  stage.setAttribute('aria-label', 'Cérebro 3D interativo. Passe o mouse ou selecione para preencher. Arraste ou use as setas para girar; Enter seleciona; Home restaura.');
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    stage.classList.remove('is-ready');
    stage.dataset.renderMode = 'fallback';
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    resize();
    stage.classList.add('is-ready');
    stage.dataset.renderMode = 'webgl';
  });

  resize();
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  stage.classList.add('is-ready');
  stage.dataset.renderMode = 'webgl';
  requestDraw();

  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    motion.removeEventListener('change', requestDraw);
    const geometries = new Set(), materials = new Set(), textures = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    });
    materials.forEach(material => {
      for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      material.dispose();
    });
    textures.forEach(texture => texture.dispose());
    geometries.forEach(geometry => geometry.dispose());
    environment.dispose();
    renderer.dispose();
  });
}
