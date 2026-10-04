import * as T from './vendor/three/three.module.min.js';
import { RoomEnvironment } from './vendor/three/RoomEnvironment.js';
import { createLaptop } from './vendor/macbook-studio/laptop.js';

export async function mountLaptop(stage) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
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
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.append(renderer.domElement);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(33, 1, .1, 30);
  camera.position.set(.4, 3.25, 7.8);
  camera.lookAt(0, 1.05, 0);
  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 1.25;
  room.dispose();
  pmrem.dispose();
  scene.add(new T.HemisphereLight(0xfff3e2, 0x403c37, 2.2));
  const light = new T.DirectionalLight(0xffe3c6, 4);
  light.position.set(-3, 5, 6);
  scene.add(light);
  const rim = new T.DirectionalLight(0xffffff, 3);
  rim.position.set(4, 3, -3);
  scene.add(rim);

  const laptop = createLaptop();
  laptop.setLid(105);
  laptop.root.rotation.y = -.14;
  laptop.materials.setFinish(0);
  scene.add(laptop.root);
  await laptop.screenMaterial.map.userData.ready;
  let visible = true;
  let frame = 0;
  let targetX = 0;
  let targetY = -.14;
  let disposed = false;

  // Render only while the view changes. No perpetual animation or hidden GPU work.
  function draw() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    laptop.root.rotation.y += (targetY - laptop.root.rotation.y) * .13;
    laptop.root.rotation.x += (targetX - laptop.root.rotation.x) * .13;
    renderer.render(scene, camera);
    if (Math.abs(targetY - laptop.root.rotation.y) + Math.abs(targetX - laptop.root.rotation.x) > .0006) requestDraw();
  }
  function requestDraw() { if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(draw); }
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestDraw();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
    else requestDraw();
  });
  visibilityObserver.observe(stage);

  function move(event) {
    if (motion.matches || event.pointerType === 'touch') return;
    const bounds = stage.getBoundingClientRect();
    targetY = -.14 + ((event.clientX - bounds.left) / bounds.width - .5) * .5;
    targetX = ((event.clientY - bounds.top) / bounds.height - .5) * .13;
    requestDraw();
  }
  function reset() { targetY = -.14; targetX = 0; requestDraw(); }
  function keyboard(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') { reset(); return; }
    targetY = T.MathUtils.clamp(targetY + (event.key === 'ArrowLeft' ? -.12 : .12), -.6, .6);
    if (motion.matches) laptop.root.rotation.y = targetY;
    requestDraw();
  }
  function onVisibility() {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else requestDraw();
  }
  stage.addEventListener('pointermove', move, { passive: true });
  stage.addEventListener('pointerleave', reset);
  stage.addEventListener('keydown', keyboard);
  motion.addEventListener('change', reset);
  document.addEventListener('visibilitychange', onVisibility);
  stage.tabIndex = 0;
  stage.setAttribute('role', 'group');
  stage.setAttribute('aria-label', 'MacBook 3D. Use as setas esquerda e direita para girar; Home para restaurar.');
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
  renderer.render(scene, camera);
  stage.classList.add('is-ready');
  stage.dataset.renderMode = 'webgl';

  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    motion.removeEventListener('change', reset);
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
