/**
 * AUREVIA — Premium Skincare 3D Scene Engine
 * File: scene.js
 * 
 * Cinematic 3D product visualization built with Three.js (ES Module via CDN importmap).
 * Provides procedural luxury product models, studio lighting rig, dynamic animated
 * luxury background shader, atmospheric golden dust particles, scroll-driven camera
 * choreography, and interactive 360-degree product detail inspection.
 */

import * as THREE from 'three';

/* ==========================================================================
   1. DEVICE CAPABILITIES & PERFORMANCE CONFIGURATION
   ========================================================================== */

/**
 * Detects whether WebGL (WebGL 1 or 2) is supported and operational.
 * @returns {boolean}
 */
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const available = !!(window.WebGLRenderingContext && gl);
    window.WEBGL_AVAILABLE = available;
    return available;
  } catch (e) {
    window.WEBGL_AVAILABLE = false;
    return false;
  }
}

// Immediately evaluate and expose global WebGL availability flag
window.WEBGL_AVAILABLE = isWebGLAvailable();

/**
 * Helper to test if device is mobile / low power.
 * @returns {boolean}
 */
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isSmallScreen = window.innerWidth < 768;
  const isTouchCapable = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  return (isMobileUA || (isSmallScreen && isTouchCapable));
}

/**
 * Checks if the user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ==========================================================================
   2. PROCEDURAL TEXTURE GENERATORS (CANVAS TEXTURES)
   ========================================================================== */

/**
 * Creates high-resolution canvas texture for the Radiance Serum label.
 * Produces an elegant obsidian and champagne gold foil design with crisp typography.
 * @returns {THREE.CanvasTexture}
 */
function createSerumLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background - Deep obsidian with warm charcoal vignette
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  bgGrad.addColorStop(0, '#0c0b0a');
  bgGrad.addColorStop(0.5, '#141311');
  bgGrad.addColorStop(1, '#090807');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle frosted noise / micro-grain overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  for (let i = 0; i < 3500; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 512;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // Outer border - Ultra-thin gold foil frame
  ctx.strokeStyle = '#cba36b';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 952, 440);

  // Inner border - Delicate micro-line
  ctx.strokeStyle = 'rgba(203, 163, 107, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 936, 424);

  // Decorative corner corner accents
  const cornerSize = 14;
  ctx.fillStyle = '#dfbe88';
  // Top-left
  ctx.fillRect(34, 34, cornerSize, 3);
  ctx.fillRect(34, 34, 3, cornerSize);
  // Top-right
  ctx.fillRect(990 - cornerSize, 34, cornerSize, 3);
  ctx.fillRect(987, 34, 3, cornerSize);
  // Bottom-left
  ctx.fillRect(34, 475, cornerSize, 3);
  ctx.fillRect(34, 478 - cornerSize, 3, cornerSize);
  // Bottom-right
  ctx.fillRect(990 - cornerSize, 475, cornerSize, 3);
  ctx.fillRect(987, 478 - cornerSize, 3, cornerSize);

  // Brand emblem: 4-pointed radiant luxury star
  const cx = 512;
  const cy = 115;
  ctx.save();
  ctx.fillStyle = '#dfbe88';
  ctx.beginPath();
  // Star geometry
  ctx.moveTo(cx, cy - 28);
  ctx.quadraticCurveTo(cx, cy, cx + 22, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + 28);
  ctx.quadraticCurveTo(cx, cy, cx - 22, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - 28);
  ctx.fill();

  // Star core sparkle dot
  ctx.fillStyle = '#fff8ee';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Brand Name - A U R E V I A
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 46px "Italiana", "Playfair Display", "Cinzel", "Georgia", serif';
  
  // Gold foil gradient text fill
  const textGrad = ctx.createLinearGradient(300, 180, 724, 180);
  textGrad.addColorStop(0, '#d8b276');
  textGrad.addColorStop(0.5, '#fff1db');
  textGrad.addColorStop(1, '#c59a58');
  ctx.fillStyle = textGrad;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  
  // Letter spaced brand title
  const brandTitle = 'A U R E V I A';
  ctx.fillText(brandTitle, 512, 195);
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Subtitle: Maison de Beauté Paris
  ctx.font = '300 15px "Inter", "Helvetica Neue", sans-serif';
  ctx.fillStyle = 'rgba(216, 178, 118, 0.75)';
  ctx.fillText('M A I S O N   D E   B E A U T É   —   P A R I S', 512, 245);

  // Fine separator line with center diamond
  ctx.strokeStyle = 'rgba(203, 163, 107, 0.45)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(320, 275);
  ctx.lineTo(485, 275);
  ctx.moveTo(539, 275);
  ctx.lineTo(704, 275);
  ctx.stroke();

  // Diamond accent in divider
  ctx.save();
  ctx.translate(512, 275);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = '#dfbe88';
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();

  // Product Name: RADIANCE CELLULAR SERUM
  ctx.font = '500 24px "Italiana", "Cinzel", "Georgia", serif';
  ctx.fillStyle = '#f5f0e8';
  ctx.fillText('R A D I A N C E   S E R U M', 512, 320);

  // French Subtitle
  ctx.font = 'italic 16px "Georgia", serif';
  ctx.fillStyle = '#c5a77c';
  ctx.fillText("L'Élixir Cellulaire de Jeunesse", 512, 355);

  // Active Key Ingredients
  ctx.font = '400 12px "Inter", "Helvetica Neue", sans-serif';
  ctx.fillStyle = 'rgba(245, 240, 232, 0.6)';
  ctx.fillText('TRIPLE PEPTIDE  •  24K BIO-GOLD  •  ECTOIN', 512, 395);

  // Bottom Volume & Metric
  ctx.font = '400 13px "Inter", "Helvetica Neue", sans-serif';
  ctx.fillStyle = 'rgba(203, 163, 107, 0.85)';
  ctx.fillText('30 ml  /  1.0 fl. oz. e', 512, 435);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates canvas texture for Velvet Renewal Cream Jar.
 * @returns {THREE.CanvasTexture}
 */
function createCreamLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 380;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Frosted parchment dark background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 380);
  bgGrad.addColorStop(0, '#0e0d0c');
  bgGrad.addColorStop(0.5, '#181614');
  bgGrad.addColorStop(1, '#0e0d0c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 380);

  // Double gold border
  ctx.strokeStyle = '#c5a36b';
  ctx.lineWidth = 1.8;
  ctx.strokeRect(30, 24, 964, 332);
  ctx.strokeStyle = 'rgba(197, 163, 107, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(38, 32, 948, 316);

  // Brand Name
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 42px "Italiana", "Georgia", serif';
  ctx.fillStyle = '#ebd1a7';
  ctx.fillText('A U R E V I A', 512, 95);

  ctx.font = '300 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(203, 163, 107, 0.7)';
  ctx.fillText('P A R I S', 512, 140);

  // Divider
  ctx.strokeStyle = 'rgba(203, 163, 107, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(350, 168);
  ctx.lineTo(674, 168);
  ctx.stroke();

  // Product Name
  ctx.font = '500 24px "Italiana", "Georgia", serif';
  ctx.fillStyle = '#f7f4ed';
  ctx.fillText('VELVET RENEWAL CREAM', 512, 215);

  ctx.font = 'italic 15px "Georgia", serif';
  ctx.fillStyle = '#c5a77c';
  ctx.fillText('Crème Régénérante Ultime', 512, 255);

  ctx.font = '400 12px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(203, 163, 107, 0.85)';
  ctx.fillText('50 ml  /  1.7 fl. oz. e', 512, 305);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates canvas texture for Hydra-Gentle Cleanser.
 * @returns {THREE.CanvasTexture}
 */
function createCleanserLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Matte ivory slate background
  const bgGrad = ctx.createLinearGradient(0, 0, 768, 768);
  bgGrad.addColorStop(0, '#101012');
  bgGrad.addColorStop(0.5, '#17171a');
  bgGrad.addColorStop(1, '#0c0c0e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 768, 768);

  // Gold border
  ctx.strokeStyle = '#cba36b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, 704, 704);

  // Star Emblem
  const cx = 384;
  const cy = 130;
  ctx.fillStyle = '#dfbe88';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 22);
  ctx.quadraticCurveTo(cx, cy, cx + 18, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + 22);
  ctx.quadraticCurveTo(cx, cy, cx - 18, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - 22);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 40px "Italiana", "Georgia", serif';
  ctx.fillStyle = '#eed6b0';
  ctx.fillText('A U R E V I A', 384, 220);

  ctx.font = '300 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(203, 163, 107, 0.7)';
  ctx.fillText('S U B L I M E   P U R E T É', 384, 270);

  // Divider
  ctx.strokeStyle = 'rgba(203, 163, 107, 0.4)';
  ctx.beginPath();
  ctx.moveTo(260, 310);
  ctx.lineTo(508, 310);
  ctx.stroke();

  ctx.font = '500 24px "Italiana", "Georgia", serif';
  ctx.fillStyle = '#f5f0e8';
  ctx.fillText('HYDRA-GENTLE CLEANSER', 384, 380);

  ctx.font = 'italic 16px "Georgia", serif';
  ctx.fillStyle = '#c5a77c';
  ctx.fillText('Gelée Purifiante Botanique', 384, 430);

  ctx.font = '400 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(245, 240, 232, 0.65)';
  ctx.fillText('ROSE HYDROSOL  •  NIACINAMIDE  •  CENTELLA', 384, 520);

  ctx.font = '400 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(203, 163, 107, 0.85)';
  ctx.fillText('150 ml  /  5.1 fl. oz. e', 384, 620);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates canvas texture for Botanical Infusion Oil.
 * @returns {THREE.CanvasTexture}
 */
function createOilLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 896;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const bgGrad = ctx.createLinearGradient(0, 0, 896, 512);
  bgGrad.addColorStop(0, '#0a0806');
  bgGrad.addColorStop(0.5, '#130f0a');
  bgGrad.addColorStop(1, '#0a0806');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 896, 512);

  ctx.strokeStyle = '#dfa856';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 836, 452);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '600 44px "Italiana", "Georgia", serif';
  ctx.fillStyle = '#f3ca85';
  ctx.fillText('A U R E V I A', 448, 120);

  ctx.font = '300 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(223, 168, 86, 0.7)';
  ctx.fillText('H U I L E   P R É C I E U S E', 448, 175);

  ctx.strokeStyle = 'rgba(223, 168, 86, 0.4)';
  ctx.beginPath();
  ctx.moveTo(300, 215);
  ctx.lineTo(596, 215);
  ctx.stroke();

  ctx.font = '500 25px "Italiana", "Georgia", serif';
  ctx.fillStyle = '#fff4e3';
  ctx.fillText('BOTANICAL INFUSION OIL', 448, 280);

  ctx.font = 'italic 16px "Georgia", serif';
  ctx.fillStyle = '#dfa856';
  ctx.fillText('Nectar Nourrissant aux 12 Fleurs', 448, 330);

  ctx.font = '400 13px "Inter", sans-serif';
  ctx.fillStyle = 'rgba(243, 202, 133, 0.85)';
  ctx.fillText('30 ml  /  1.0 fl. oz. e', 448, 410);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates circular embossed Aurevia seal medallion texture for lid tops.
 * @returns {THREE.CanvasTexture}
 */
function createMedallionTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Concentric radial rings
  const cx = 256;
  const cy = 256;

  ctx.fillStyle = '#c79c5c';
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ddb476';
  ctx.beginPath();
  ctx.arc(cx, cy, 235, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#8c6630';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 215, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#fae1b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 205, 0, Math.PI * 2);
  ctx.stroke();

  // Central embossed 'A' monogram
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 170px "Italiana", "Cinzel", "Georgia", serif';
  ctx.fillStyle = '#64471f';
  ctx.fillText('A', cx + 2, cy + 8);

  ctx.fillStyle = '#fff0d2';
  ctx.fillText('A', cx, cy + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

/* ==========================================================================
   3. MATERIAL FACTORY (CAPABILITY-AWARE MATERIALS)
   ========================================================================== */

/**
 * Material generator providing premium luxury materials with graceful
 * fallback on mobile or lower-spec graphics devices.
 */
const MaterialFactory = {
  /**
   * Luxury transparent glass material.
   * Uses MeshPhysicalMaterial with transmission, IOR, and clearcoat on desktop.
   */
  createGlassMaterial(options = {}) {
    const isMobile = isMobileDevice();
    const defaults = {
      color: 0xf5e6c8,
      transmission: isMobile ? 0.0 : 0.65,
      opacity: isMobile ? 0.6 : 0.8,
      transparent: true,
      roughness: isMobile ? 0.15 : 0.08,
      metalness: 0.08,
      ior: 1.52,
      thickness: isMobile ? 0.0 : 0.75,
      attenuationColor: new THREE.Color(0xfcf6ee),
      attenuationDistance: 1.5,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: isMobile ? 0.0 : 1.0,
      clearcoatRoughness: 0.05
    };
    const config = Object.assign({}, defaults, options);
    return new THREE.MeshPhysicalMaterial(config);
  },

  /**
   * Amber golden serum fluid inside bottle.
   */
  createSerumLiquidMaterial(options = {}) {
    const isMobile = isMobileDevice();
    const defaults = {
      color: 0xd9a85d,
      emissive: 0x422606,
      emissiveIntensity: 0.18,
      transmission: isMobile ? 0.0 : 0.35,
      opacity: 0.94,
      transparent: true,
      roughness: 0.18,
      metalness: 0.04,
      ior: 1.35,
      thickness: isMobile ? 0.0 : 1.1,
      attenuationColor: new THREE.Color(0xb57827),
      attenuationDistance: 0.9
    };
    return new THREE.MeshPhysicalMaterial(Object.assign({}, defaults, options));
  },

  /**
   * Polished champagne gold metal for caps, collars, and accents.
   */
  createGoldMaterial(options = {}) {
    const defaults = {
      color: 0xdfb878,
      metalness: 0.88,
      roughness: 0.18,
      emissive: 0x241808,
      emissiveIntensity: 0.05
    };
    return new THREE.MeshStandardMaterial(Object.assign({}, defaults, options));
  },

  /**
   * Soft matte charcoal rubber for dropper bulb.
   */
  createRubberMaterial(options = {}) {
    const defaults = {
      color: 0x1d1b19,
      roughness: 0.68,
      metalness: 0.05
    };
    return new THREE.MeshStandardMaterial(Object.assign({}, defaults, options));
  },

  /**
   * Velvety rich ivory cosmetic cream material.
   */
  createCreamMaterial(options = {}) {
    const defaults = {
      color: 0xfbf8f1,
      roughness: 0.52,
      metalness: 0.02,
      bumpScale: 0.02
    };
    return new THREE.MeshStandardMaterial(Object.assign({}, defaults, options));
  },

  /**
   * Deep botanical amber glass for oil bottle.
   */
  createAmberGlassMaterial(options = {}) {
    const isMobile = isMobileDevice();
    const defaults = {
      color: 0xa45214,
      transmission: isMobile ? 0.0 : 0.55,
      opacity: isMobile ? 0.75 : 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.05,
      ior: 1.54,
      thickness: isMobile ? 0.0 : 0.85,
      attenuationColor: new THREE.Color(0x733207),
      attenuationDistance: 0.8
    };
    return new THREE.MeshPhysicalMaterial(Object.assign({}, defaults, options));
  }
};

/* ==========================================================================
   4. PROCEDURAL PRODUCT MODEL BUILDERS (NO EXTERNAL GLTF REQUIRED)
   ========================================================================== */

/**
 * Builds the Hero Radiance Serum Bottle.
 * Detailed 3D procedural model featuring:
 * - Thick-walled transparent glass bottle with luxury punt base and shoulders
 * - Golden amber liquid reservoir with concave surface meniscus
 * - Glass dropper pipette tube extending into liquid
 * - Champagne gold metallic collar ring and threaded cap
 * - Soft-touch charcoal dropper squeeze bulb
 * - High-res canvas textured label wrapping front
 * - Fine decorative gold toruses and accents
 * 
 * Total height: ~4.0 units, centered at origin (0, 0, 0).
 * 
 * @param {Object} options Configuration overrides
 * @returns {THREE.Group}
 */
export function createSerumBottle(options = {}) {
  const group = new THREE.Group();
  group.name = 'SerumBottle_Hero';

  const segments = isMobileDevice() ? 36 : 64;

  // -------------------------------------------------------------
  // 1. BASE PUCK (Thick heavy crystal bottom of luxury bottle)
  // -------------------------------------------------------------
  const baseGeom = new THREE.CylinderGeometry(0.96, 0.94, 0.35, segments);
  const glassMat = MaterialFactory.createGlassMaterial();
  const baseMesh = new THREE.Mesh(baseGeom, glassMat);
  baseMesh.position.y = -1.65;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Bottom concave bevel (recessed punt)
  const puntGeom = new THREE.CylinderGeometry(0.65, 0.45, 0.15, segments, 1, true);
  const puntMat = MaterialFactory.createGlassMaterial({ roughness: 0.25 });
  const puntMesh = new THREE.Mesh(puntGeom, puntMat);
  puntMesh.position.y = -1.78;
  group.add(puntMesh);

  // -------------------------------------------------------------
  // 2. MAIN BOTTLE BODY (Slight elegant taper upwards)
  // -------------------------------------------------------------
  const bodyRadiusTop = 0.91;
  const bodyRadiusBottom = 0.96;
  const bodyHeight = 2.1;
  const bodyGeom = new THREE.CylinderGeometry(bodyRadiusTop, bodyRadiusBottom, bodyHeight, segments);
  const bodyMesh = new THREE.Mesh(bodyGeom, glassMat);
  bodyMesh.position.y = -0.45;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // -------------------------------------------------------------
  // 3. INNER LIQUID (Golden Amber Serum)
  // -------------------------------------------------------------
  const liquidRadiusTop = 0.81;
  const liquidRadiusBottom = 0.85;
  const liquidHeight = 1.75;
  const liquidGeom = new THREE.CylinderGeometry(liquidRadiusTop, liquidRadiusBottom, liquidHeight, segments);
  const liquidMat = MaterialFactory.createSerumLiquidMaterial();
  const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
  liquidMesh.position.y = -0.58;
  group.add(liquidMesh);

  // Liquid Meniscus Surface (Curved top of the fluid)
  const meniscusGeom = new THREE.CylinderGeometry(liquidRadiusTop, liquidRadiusTop, 0.05, segments);
  const meniscusMat = MaterialFactory.createSerumLiquidMaterial({ roughness: 0.08 });
  const meniscusMesh = new THREE.Mesh(meniscusGeom, meniscusMat);
  meniscusMesh.position.y = -0.58 + (liquidHeight / 2);
  group.add(meniscusMesh);

  // -------------------------------------------------------------
  // 4. INNER DROPPER PIPETTE STEM & INNER LIQUID CORE
  // -------------------------------------------------------------
  const pipetteGeom = new THREE.CylinderGeometry(0.065, 0.065, 2.4, 24);
  const pipetteMat = MaterialFactory.createGlassMaterial({ opacity: 0.6, roughness: 0.05 });
  const pipetteMesh = new THREE.Mesh(pipetteGeom, pipetteMat);
  pipetteMesh.position.y = -0.3;
  group.add(pipetteMesh);

  // Golden column of serum inside pipette
  const pipetteFluidGeom = new THREE.CylinderGeometry(0.045, 0.045, 1.8, 16);
  const pipetteFluidMat = MaterialFactory.createSerumLiquidMaterial({ emissiveIntensity: 0.3 });
  const pipetteFluidMesh = new THREE.Mesh(pipetteFluidGeom, pipetteFluidMat);
  pipetteFluidMesh.position.y = -0.45;
  group.add(pipetteFluidMesh);

  // -------------------------------------------------------------
  // 5. SHOULDER & NECK ASSEMBLY
  // -------------------------------------------------------------
  // Rounded curved shoulder transition
  const shoulderGeom = new THREE.CylinderGeometry(0.52, bodyRadiusTop, 0.35, segments);
  const shoulderMesh = new THREE.Mesh(shoulderGeom, glassMat);
  shoulderMesh.position.y = 0.75;
  shoulderMesh.castShadow = true;
  group.add(shoulderMesh);

  // Glass neck ring
  const neckGeom = new THREE.CylinderGeometry(0.48, 0.50, 0.32, segments);
  const neckMesh = new THREE.Mesh(neckGeom, glassMat);
  neckMesh.position.y = 1.05;
  group.add(neckMesh);

  // -------------------------------------------------------------
  // 6. METALLIC GOLD COLLAR & ACCENT RINGS
  // -------------------------------------------------------------
  const goldMat = MaterialFactory.createGoldMaterial();

  // Shoulder accent ring
  const shoulderRingGeom = new THREE.TorusGeometry(0.52, 0.035, 16, segments);
  shoulderRingGeom.rotateX(Math.PI / 2);
  const shoulderRing = new THREE.Mesh(shoulderRingGeom, goldMat);
  shoulderRing.position.y = 0.92;
  group.add(shoulderRing);

  // Neck collar band
  const collarGeom = new THREE.CylinderGeometry(0.53, 0.53, 0.22, segments);
  const collarMesh = new THREE.Mesh(collarGeom, goldMat);
  collarMesh.position.y = 1.22;
  collarMesh.castShadow = true;
  group.add(collarMesh);

  // Fine bead ring on collar
  const beadGeom = new THREE.TorusGeometry(0.54, 0.02, 16, segments);
  beadGeom.rotateX(Math.PI / 2);
  const beadMesh = new THREE.Mesh(beadGeom, goldMat);
  beadMesh.position.y = 1.33;
  group.add(beadMesh);

  // -------------------------------------------------------------
  // 7. DROPPER CAP & BULB
  // -------------------------------------------------------------
  // Main metallic cap cylinder
  const capGeom = new THREE.CylinderGeometry(0.47, 0.49, 0.88, segments);
  const capMesh = new THREE.Mesh(capGeom, goldMat);
  capMesh.position.y = 1.76;
  capMesh.castShadow = true;
  group.add(capMesh);

  // Cap top bevel rim
  const capBevelGeom = new THREE.CylinderGeometry(0.42, 0.47, 0.08, segments);
  const capBevelMesh = new THREE.Mesh(capBevelGeom, goldMat);
  capBevelMesh.position.y = 2.22;
  group.add(capBevelMesh);

  // Dropper squeeze bulb (soft charcoal rubber dome)
  const bulbGeom = new THREE.SphereGeometry(0.39, 32, 24);
  bulbGeom.scale(1.0, 1.45, 1.0);
  const rubberMat = MaterialFactory.createRubberMaterial();
  const bulbMesh = new THREE.Mesh(bulbGeom, rubberMat);
  bulbMesh.position.y = 2.45;
  bulbMesh.castShadow = true;
  group.add(bulbMesh);

  // -------------------------------------------------------------
  // 8. LUXURY CANVAS TEXTURED BRAND LABEL
  // -------------------------------------------------------------
  // Curved cylindrical sleeve wrapping front ~150 degrees of bottle
  const labelArc = Math.PI * 0.82; // ~148 degrees coverage
  const labelRadius = bodyRadiusBottom + 0.015;
  const labelHeight = 1.35;
  const labelGeom = new THREE.CylinderGeometry(
    labelRadius * 0.98,
    labelRadius,
    labelHeight,
    segments,
    1,
    true,
    -labelArc / 2 + Math.PI / 2,
    labelArc
  );

  const labelTexture = createSerumLabelTexture();
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    transparent: true,
    roughness: 0.35,
    metalness: 0.15,
    side: THREE.DoubleSide
  });

  const labelMesh = new THREE.Mesh(labelGeom, labelMat);
  labelMesh.position.y = -0.42;
  group.add(labelMesh);

  // Gold trim bands on top & bottom edge of label
  const labelTopTrimGeom = new THREE.TorusGeometry(labelRadius, 0.012, 12, segments, labelArc);
  labelTopTrimGeom.rotateX(Math.PI / 2);
  labelTopTrimGeom.rotateZ(-labelArc / 2 + Math.PI / 2);
  const labelTopTrim = new THREE.Mesh(labelTopTrimGeom, goldMat);
  labelTopTrim.position.y = -0.42 + (labelHeight / 2);
  group.add(labelTopTrim);

  const labelBottomTrim = new THREE.Mesh(labelTopTrimGeom, goldMat);
  labelBottomTrim.position.y = -0.42 - (labelHeight / 2);
  group.add(labelBottomTrim);

  // Center group origin around its aesthetic focal point
  group.position.y = 0;
  return group;
}

/**
 * Builds the Velvet Renewal Cream Jar.
 * Wide, heavy crystal glass jar with champagne gold screw lid.
 * Total height: ~2.3 units, radius: ~1.65 units.
 * 
 * @param {Object} options
 * @returns {THREE.Group}
 */
export function createCreamJar(options = {}) {
  const group = new THREE.Group();
  group.name = 'CreamJar';

  const segments = isMobileDevice() ? 36 : 56;
  const glassMat = MaterialFactory.createGlassMaterial();
  const goldMat = MaterialFactory.createGoldMaterial();

  // 1. Heavy Glass Base
  const baseGeom = new THREE.CylinderGeometry(1.58, 1.50, 0.35, segments);
  const baseMesh = new THREE.Mesh(baseGeom, glassMat);
  baseMesh.position.y = -0.85;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // 2. Outer Jar Wall
  const jarGeom = new THREE.CylinderGeometry(1.62, 1.58, 1.25, segments);
  const jarMesh = new THREE.Mesh(jarGeom, glassMat);
  jarMesh.position.y = -0.05;
  jarMesh.castShadow = true;
  jarMesh.receiveShadow = true;
  group.add(jarMesh);

  // 3. Inner Cosmetic Cream Body (Ivory velvet cream reservoir)
  const innerCreamGeom = new THREE.CylinderGeometry(1.36, 1.28, 1.05, segments);
  const creamMat = MaterialFactory.createCreamMaterial();
  const creamMesh = new THREE.Mesh(innerCreamGeom, creamMat);
  creamMesh.position.y = -0.15;
  group.add(creamMesh);

  // Whipped cream surface wave
  const creamTopGeom = new THREE.CylinderGeometry(1.34, 1.36, 0.08, segments);
  const creamTopMesh = new THREE.Mesh(creamTopGeom, creamMat);
  creamTopMesh.position.y = 0.38;
  group.add(creamTopMesh);

  // Soft cream center swirl peak
  const swirlGeom = new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.42);
  swirlGeom.scale(1.0, 0.35, 1.0);
  const swirlMesh = new THREE.Mesh(swirlGeom, creamMat);
  swirlMesh.position.y = 0.36;
  group.add(swirlMesh);

  // 4. Gold Gasket / Neck Collar
  const neckGeom = new THREE.CylinderGeometry(1.48, 1.52, 0.22, segments);
  const neckMesh = new THREE.Mesh(neckGeom, goldMat);
  neckMesh.position.y = 0.65;
  group.add(neckMesh);

  // 5. Metallic Champagne Gold Screw Lid
  const lidGeom = new THREE.CylinderGeometry(1.65, 1.65, 0.46, segments);
  const lidMesh = new THREE.Mesh(lidGeom, goldMat);
  lidMesh.position.y = 0.94;
  lidMesh.castShadow = true;
  group.add(lidMesh);

  // Lid Bevel Chamfer
  const lidBevelGeom = new THREE.CylinderGeometry(1.56, 1.65, 0.08, segments);
  const lidBevelMesh = new THREE.Mesh(lidBevelGeom, goldMat);
  lidBevelMesh.position.y = 1.20;
  group.add(lidBevelMesh);

  // Top Embossed Monogram Medallion
  const medallionGeom = new THREE.CircleGeometry(1.22, segments);
  medallionGeom.rotateX(-Math.PI / 2);
  const medallionTex = createMedallionTexture();
  const medallionMat = new THREE.MeshStandardMaterial({
    map: medallionTex,
    roughness: 0.25,
    metalness: 0.85
  });
  const medallionMesh = new THREE.Mesh(medallionGeom, medallionMat);
  medallionMesh.position.y = 1.245;
  group.add(medallionMesh);

  // 6. Front Canvas Label
  const labelArc = Math.PI * 0.85;
  const labelRadius = 1.635;
  const labelGeom = new THREE.CylinderGeometry(
    labelRadius,
    labelRadius,
    0.85,
    segments,
    1,
    true,
    -labelArc / 2 + Math.PI / 2,
    labelArc
  );
  const labelTex = createCreamLabelTexture();
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTex,
    transparent: true,
    roughness: 0.35,
    metalness: 0.12,
    side: THREE.DoubleSide
  });
  const labelMesh = new THREE.Mesh(labelGeom, labelMat);
  labelMesh.position.y = -0.15;
  group.add(labelMesh);

  return group;
}

/**
 * Builds the Hydra-Gentle Cleanser Pump Bottle.
 * Tall slender frosted bottle with dispenser pump mechanism.
 * Total height: ~4.5 units, radius: ~1.0 unit.
 * 
 * @param {Object} options
 * @returns {THREE.Group}
 */
export function createCleanserBottle(options = {}) {
  const group = new THREE.Group();
  group.name = 'CleanserBottle';

  const segments = isMobileDevice() ? 36 : 48;
  const goldMat = MaterialFactory.createGoldMaterial();

  // 1. Frosted Glass Body
  const glassMat = MaterialFactory.createGlassMaterial({
    color: 0xfaeee6,
    roughness: 0.22,
    transmission: 0.55
  });

  const bodyHeight = 3.2;
  const bodyGeom = new THREE.CylinderGeometry(0.96, 1.0, bodyHeight, segments);
  const bodyMesh = new THREE.Mesh(bodyGeom, glassMat);
  bodyMesh.position.y = -0.4;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // 2. Inner Pearlescent Fluid Column
  const liquidMat = MaterialFactory.createSerumLiquidMaterial({
    color: 0xf5dfd3,
    emissive: 0x301810,
    emissiveIntensity: 0.1,
    roughness: 0.3
  });
  const liquidGeom = new THREE.CylinderGeometry(0.85, 0.88, 2.9, segments);
  const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
  liquidMesh.position.y = -0.52;
  group.add(liquidMesh);

  // 3. Rounded Bottle Shoulder
  const shoulderGeom = new THREE.CylinderGeometry(0.50, 0.96, 0.42, segments);
  const shoulderMesh = new THREE.Mesh(shoulderGeom, glassMat);
  shoulderMesh.position.y = 1.38;
  group.add(shoulderMesh);

  // 4. Gold Dispenser Pump Collar
  const collarGeom = new THREE.CylinderGeometry(0.54, 0.54, 0.35, segments);
  const collarMesh = new THREE.Mesh(collarGeom, goldMat);
  collarMesh.position.y = 1.72;
  collarMesh.castShadow = true;
  group.add(collarMesh);

  // 5. Vertical Actuator Stem
  const stemGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.42, 24);
  const stemMesh = new THREE.Mesh(stemGeom, goldMat);
  stemMesh.position.y = 2.05;
  group.add(stemMesh);

  // 6. Pump Dispenser Head with Spout
  const pumpHeadGroup = new THREE.Group();
  pumpHeadGroup.position.y = 2.28;

  // Dispenser Top Cap
  const headGeom = new THREE.CylinderGeometry(0.38, 0.36, 0.28, 32);
  const headMesh = new THREE.Mesh(headGeom, goldMat);
  pumpHeadGroup.add(headMesh);

  // Ergonomic angled depression pad
  const fingerPadGeom = new THREE.CylinderGeometry(0.34, 0.37, 0.06, 32);
  fingerPadGeom.rotateX(-0.1);
  const fingerPad = new THREE.Mesh(fingerPadGeom, goldMat);
  fingerPad.position.set(0, 0.16, 0.02);
  pumpHeadGroup.add(fingerPad);

  // Forward dispensing spout
  const spoutGeom = new THREE.CylinderGeometry(0.12, 0.15, 0.58, 20);
  spoutGeom.rotateX(Math.PI / 2);
  spoutGeom.rotateX(-0.18); // slight downward slope
  const spoutMesh = new THREE.Mesh(spoutGeom, goldMat);
  spoutMesh.position.set(0, 0.02, 0.38);
  pumpHeadGroup.add(spoutMesh);

  // Spout aperture tip
  const tipGeom = new THREE.TorusGeometry(0.11, 0.025, 12, 20);
  tipGeom.rotateX(-0.18);
  const tipMesh = new THREE.Mesh(tipGeom, goldMat);
  tipMesh.position.set(0, -0.04, 0.65);
  pumpHeadGroup.add(tipMesh);

  group.add(pumpHeadGroup);

  // 7. Internal Dip Tube
  const tubeGeom = new THREE.CylinderGeometry(0.05, 0.05, 3.4, 16);
  const tubeMat = MaterialFactory.createGlassMaterial({ opacity: 0.5, roughness: 0.2 });
  const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
  tubeMesh.position.y = -0.2;
  group.add(tubeMesh);

  // 8. Front Label
  const labelArc = Math.PI * 0.85;
  const labelRadius = 0.98;
  const labelGeom = new THREE.CylinderGeometry(
    labelRadius,
    labelRadius,
    2.1,
    segments,
    1,
    true,
    -labelArc / 2 + Math.PI / 2,
    labelArc
  );
  const labelTex = createCleanserLabelTexture();
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTex,
    transparent: true,
    roughness: 0.32,
    metalness: 0.1,
    side: THREE.DoubleSide
  });
  const labelMesh = new THREE.Mesh(labelGeom, labelMat);
  labelMesh.position.y = -0.4;
  group.add(labelMesh);

  return group;
}

/**
 * Builds the Botanical Infusion Oil Dropper Bottle.
 * Deep amber luxury bottle with dropper pipette.
 * Total height: ~3.8 units, radius: ~0.9 units.
 * 
 * @param {Object} options
 * @returns {THREE.Group}
 */
export function createOilBottle(options = {}) {
  const group = new THREE.Group();
  group.name = 'OilBottle';

  const segments = isMobileDevice() ? 36 : 48;
  const amberGlassMat = MaterialFactory.createAmberGlassMaterial();
  const goldMat = MaterialFactory.createGoldMaterial();

  // 1. Heavy Amber Glass Base
  const baseGeom = new THREE.CylinderGeometry(0.88, 0.86, 0.35, segments);
  const baseMesh = new THREE.Mesh(baseGeom, amberGlassMat);
  baseMesh.position.y = -1.45;
  baseMesh.castShadow = true;
  group.add(baseMesh);

  // 2. Amber Glass Body (Slightly squatter apothecary bottle proportion)
  const bodyGeom = new THREE.CylinderGeometry(0.84, 0.88, 1.85, segments);
  const bodyMesh = new THREE.Mesh(bodyGeom, amberGlassMat);
  bodyMesh.position.y = -0.45;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // 3. Golden Oil Interior Liquid
  const oilFluidMat = MaterialFactory.createSerumLiquidMaterial({
    color: 0xdf8f28,
    emissive: 0x5a2d04,
    emissiveIntensity: 0.22,
    roughness: 0.15
  });
  const oilGeom = new THREE.CylinderGeometry(0.74, 0.77, 1.55, segments);
  const oilMesh = new THREE.Mesh(oilGeom, oilFluidMat);
  oilMesh.position.y = -0.55;
  group.add(oilMesh);

  // 4. Bottle Shoulder Curve
  const shoulderGeom = new THREE.CylinderGeometry(0.46, 0.84, 0.42, segments);
  const shoulderMesh = new THREE.Mesh(shoulderGeom, amberGlassMat);
  shoulderMesh.position.y = 0.65;
  group.add(shoulderMesh);

  // 5. Ribbed Gold Collar
  const collarGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.26, segments);
  const collarMesh = new THREE.Mesh(collarGeom, goldMat);
  collarMesh.position.y = 0.98;
  collarMesh.castShadow = true;
  group.add(collarMesh);

  // 6. Dropper Cap
  const capGeom = new THREE.CylinderGeometry(0.44, 0.46, 0.75, segments);
  const capMesh = new THREE.Mesh(capGeom, goldMat);
  capMesh.position.y = 1.45;
  capMesh.castShadow = true;
  group.add(capMesh);

  // 7. Textured Rubber Pipette Bulb
  const bulbGeom = new THREE.SphereGeometry(0.35, 32, 24);
  bulbGeom.scale(1.0, 1.35, 1.0);
  const rubberMat = MaterialFactory.createRubberMaterial();
  const bulbMesh = new THREE.Mesh(bulbGeom, rubberMat);
  bulbMesh.position.y = 2.05;
  bulbMesh.castShadow = true;
  group.add(bulbMesh);

  // 8. Pipette Stem Inside
  const pipetteGeom = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 20);
  const pipetteMat = MaterialFactory.createGlassMaterial({ opacity: 0.5 });
  const pipetteMesh = new THREE.Mesh(pipetteGeom, pipetteMat);
  pipetteMesh.position.y = -0.3;
  group.add(pipetteMesh);

  // Amber oil drop at pipette tip
  const dropletGeom = new THREE.SphereGeometry(0.08, 16, 16);
  dropletGeom.scale(0.8, 1.3, 0.8);
  const dropMesh = new THREE.Mesh(dropletGeom, oilFluidMat);
  dropMesh.position.y = -1.45;
  group.add(dropMesh);

  // 9. Front Botanical Label
  const labelArc = Math.PI * 0.85;
  const labelRadius = 0.865;
  const labelGeom = new THREE.CylinderGeometry(
    labelRadius * 0.98,
    labelRadius,
    1.25,
    segments,
    1,
    true,
    -labelArc / 2 + Math.PI / 2,
    labelArc
  );
  const labelTex = createOilLabelTexture();
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTex,
    transparent: true,
    roughness: 0.35,
    metalness: 0.12,
    side: THREE.DoubleSide
  });
  const labelMesh = new THREE.Mesh(labelGeom, labelMat);
  labelMesh.position.y = -0.45;
  group.add(labelMesh);

  return group;
}

/**
 * Factory to build product 3D model based on identifier.
 * @param {string} productId
 * @param {Object} options
 * @returns {THREE.Group}
 */
export function createProductModel(productId = 'serum', options = {}) {
  const normalized = String(productId).toLowerCase().trim();
  if (normalized.includes('cream') || normalized.includes('velvet') || normalized.includes('jar')) {
    return createCreamJar(options);
  } else if (normalized.includes('cleanse') || normalized.includes('wash') || normalized.includes('pump')) {
    return createCleanserBottle(options);
  } else if (normalized.includes('oil') || normalized.includes('botanical') || normalized.includes('nectar')) {
    return createOilBottle(options);
  } else {
    // Default hero serum
    return createSerumBottle(options);
  }
}

/* ==========================================================================
   5. STUDIO LIGHTING RIG
   ========================================================================== */

/**
 * Creates professional studio lighting setup configured for luxury cosmetics.
 * Returns reference bundle so lights can be dynamically modulated during scroll.
 * 
 * @param {THREE.Scene} scene
 * @returns {Object} Light references
 */
export function createStudioLighting(scene) {
  // 1. Ambient Light - very subtle, prevents complete black shadows
  const ambientLight = new THREE.AmbientLight(0x121118, 0.18);
  scene.add(ambientLight);

  // 2. Key Light - Warm directional light mimicking high-end softbox
  const keyLight = new THREE.DirectionalLight(0xfffaee, 1.35);
  keyLight.position.set(5.0, 8.0, 5.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 1.0;
  keyLight.shadow.camera.far = 25.0;
  keyLight.shadow.camera.left = -3.5;
  keyLight.shadow.camera.right = 3.5;
  keyLight.shadow.camera.top = 4.5;
  keyLight.shadow.camera.bottom = -4.5;
  keyLight.shadow.bias = -0.00015;
  keyLight.shadow.radius = 3.5;
  scene.add(keyLight);

  // 3. Fill Light - Cooler directional light for shadow contrast balance
  const fillLight = new THREE.DirectionalLight(0xd4e4f7, 0.45);
  fillLight.position.set(-4.0, 4.0, -2.0);
  scene.add(fillLight);

  // 4. Rim / Kicker Light - Strong rear-side highlight highlighting glass silhouettes
  const rimLight = new THREE.DirectionalLight(0xffeed6, 0.75);
  rimLight.position.set(0.0, 5.0, -8.0);
  scene.add(rimLight);

  // 5. Point Light Bounce - Warm golden under-lighting near product base
  const bounceLight = new THREE.PointLight(0xe8be78, 0.45, 7.0);
  bounceLight.position.set(0.0, -1.8, 1.2);
  scene.add(bounceLight);

  // 6. Accent Top Spotlight - Precision highlight for cap & dropper bulb
  const topLight = new THREE.DirectionalLight(0xfff5ea, 0.5);
  topLight.position.set(0.0, 10.0, 1.0);
  scene.add(topLight);

  return {
    ambientLight,
    keyLight,
    fillLight,
    rimLight,
    bounceLight,
    topLight
  };
}

/* ==========================================================================
   6. CONTACT GROUND SHADOW & PEDESTAL
   ========================================================================== */

/**
 * Creates soft procedural contact shadow on ground beneath product.
 * @returns {THREE.Mesh}
 */
function createGroundShadow() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.5)');
    grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  const geom = new THREE.PlaneGeometry(3.8, 3.8);
  geom.rotateX(-Math.PI / 2);

  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.y = -1.88;
  return mesh;
}

/* ==========================================================================
   7. ANIMATED BACKGROUND SHADER
   ========================================================================== */

/**
 * Vertex Shader for background plane.
 */
const backgroundVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

/**
 * Fragment Shader for luxury organic gradient background.
 * Creates smooth simplex-approximation FBM noise in dark charcoal,
 * deep obsidian, warm bronze, and champagne tones.
 */
const backgroundFragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_scroll;
  uniform vec2 u_mouse;
  uniform float u_intensity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // 2D Rotation matrix
  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  // Smooth pseudo-noise using harmonic trigonometric summation
  float hashNoise(vec2 p, float t) {
    vec2 p2 = p * 1.5;
    float n = 0.0;
    
    // Octave 1
    n += 0.50 * sin(p2.x * 1.8 + t * 0.35) * cos(p2.y * 1.6 - t * 0.28);
    p2 = rot(0.65) * p2 * 2.05 + vec2(42.3, 17.8);
    
    // Octave 2
    n += 0.25 * sin(p2.x * 2.2 - t * 0.42) * cos(p2.y * 2.1 + t * 0.38);
    p2 = rot(-0.55) * p2 * 1.95 + vec2(12.7, 89.1);
    
    // Octave 3
    n += 0.125 * sin(p2.x * 3.4 + t * 0.5) * cos(p2.y * 3.1 - t * 0.45);
    
    return n;
  }

  void main() {
    // Normalized centered UV coordinates
    vec2 uv = vUv - 0.5;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    uv.x *= aspect;

    // Slow dreamlike time scale
    float t = u_time * 0.22;

    // Cursor influence (subtle interactive flow distortion)
    vec2 mouseOffset = (u_mouse - 0.5) * 0.15;
    vec2 sampleCoord = uv + mouseOffset;

    // Multi-layered organic turbulence
    float n1 = hashNoise(sampleCoord * 1.2, t);
    float n2 = hashNoise((sampleCoord + vec2(n1 * 0.4, -n1 * 0.3)) * 1.8, t * 1.2);
    float wavePattern = smoothstep(-0.6, 0.8, n1 + n2 * 0.5);

    // Luxury Dark Color Palette
    // Base 0: Pure dark obsidian
    vec3 colObsidian = vec3(0.035, 0.035, 0.040);
    // Base 1: Dark charcoal velvet
    vec3 colCharcoal = vec3(0.065, 0.063, 0.072);
    // Accent 1: Deep smoky bronze
    vec3 colBronze   = vec3(0.145, 0.095, 0.055);
    // Accent 2: Warm champagne gold mist
    vec3 colGold     = vec3(0.240, 0.170, 0.090);
    // Scroll tint: Subtle deep amethyst night
    vec3 colNight    = vec3(0.050, 0.045, 0.075);

    // Dynamic blend based on noise pattern and scroll position
    vec3 baseCol = mix(colObsidian, colCharcoal, clamp(vUv.y + 0.2, 0.0, 1.0));
    baseCol = mix(baseCol, colNight, u_scroll * 0.35);

    // Warm highlights flowing through the background
    vec3 highlight = mix(colBronze, colGold, clamp(n2 + 0.4, 0.0, 1.0));
    vec3 finalColor = mix(baseCol, highlight, wavePattern * (0.35 + u_scroll * 0.15));

    // Radial vignette centered around product showcase
    float distFromCenter = length(uv);
    float vignette = smoothstep(1.3, 0.25, distFromCenter);
    finalColor *= (0.55 + 0.45 * vignette);

    // Soft warm center spotlight bloom
    float centerGlow = exp(-distFromCenter * 2.2) * 0.12;
    finalColor += colGold * centerGlow;

    gl_FragColor = vec4(finalColor * u_intensity, 1.0);
  }
`;

/**
 * Creates custom background plane with the animated shader.
 * @param {THREE.Camera} camera
 * @returns {Object}
 */
export function createBackgroundShaderPlane(camera) {
  const uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_scroll: { value: 0.0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_intensity: { value: 1.0 }
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: backgroundVertexShader,
    fragmentShader: backgroundFragmentShader,
    uniforms: uniforms,
    depthWrite: false,
    depthTest: false
  });

  // Large plane positioned behind scene
  const geometry = new THREE.PlaneGeometry(36, 36);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, -6.5);
  mesh.name = 'BackgroundShaderPlane';

  return {
    mesh,
    material,
    uniforms,
    update(time, scroll, mouse) {
      uniforms.u_time.value = time;
      if (scroll !== undefined) uniforms.u_scroll.value = scroll;
      if (mouse) {
        uniforms.u_mouse.value.set(mouse.x, mouse.y);
      }
    }
  };
}

/* ==========================================================================
   8. ATMOSPHERIC PARTICLES (FLOATING GOLD DUST)
   ========================================================================== */

/**
 * Creates delicate floating golden atmospheric dust motes.
 * Uses custom shader points for soft radial Gaussian falloff.
 * 
 * @param {THREE.Scene} scene
 * @returns {Object}
 */
export function createParticles(scene) {
  const isMobile = isMobileDevice();
  const particleCount = isMobile ? 16 : 32;

  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  const velocities = new Float32Array(particleCount * 3);
  const phases = new Float32Array(particleCount);

  const boundsX = 3.8;
  const boundsY = 4.2;
  const boundsZ = 3.5;

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3 + 0] = (Math.random() - 0.5) * boundsX * 2;
    positions[i3 + 1] = (Math.random() - 0.5) * boundsY * 2;
    positions[i3 + 2] = (Math.random() - 0.5) * boundsZ * 2;

    scales[i] = Math.random() * 0.04 + 0.02;
    phases[i] = Math.random() * Math.PI * 2;

    velocities[i3 + 0] = (Math.random() - 0.5) * 0.06;
    velocities[i3 + 1] = Math.random() * 0.08 + 0.03; // Gentle upward drift
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.05;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

  // Custom Point Shader for soft glowing circular motes
  const particleVertex = `
    attribute float scale;
    attribute float phase;
    uniform float u_time;
    varying float vAlpha;

    void main() {
      vec3 pos = position;
      // Gentle horizontal oscillation
      pos.x += sin(u_time * 0.5 + phase) * 0.15;
      pos.z += cos(u_time * 0.4 + phase) * 0.12;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Distance attenuation
      gl_PointSize = (scale * 280.0) / -mvPosition.z;

      // Soft breathing twinkle
      vAlpha = 0.35 + 0.25 * sin(u_time * 1.5 + phase);
    }
  `;

  const particleFragment = `
    precision mediump float;
    varying float vAlpha;

    void main() {
      // Soft circular gradient falloff
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float strength = smoothstep(0.5, 0.05, dist);
      // Warm champagne gold color
      vec3 gold = vec3(0.92, 0.78, 0.54);
      gl_FragColor = vec4(gold, strength * vAlpha * 0.45);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    uniforms: {
      u_time: { value: 0.0 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geometry, material);
  points.name = 'AtmosphericParticles';
  scene.add(points);

  return {
    points,
    geometry,
    material,
    update(time, delta) {
      material.uniforms.u_time.value = time;
      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3 + 1] += velocities[i3 + 1] * delta;

        // Wrap around vertically
        if (posArray[i3 + 1] > boundsY) {
          posArray[i3 + 1] = -boundsY;
          posArray[i3 + 0] = (Math.random() - 0.5) * boundsX * 2;
          posArray[i3 + 2] = (Math.random() - 0.5) * boundsZ * 2;
        }
      }
      posAttr.needsUpdate = true;
    },
    dispose() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    }
  };
}

/* ==========================================================================
   9. HERO SCENE CLASS (FULL CHOREOGRAPHY ENGINE)
   ========================================================================== */

/**
 * HeroScene orchestrates the primary cinematic 3D product showcase.
 * Features:
 * - High performance WebGL setup with ACESFilmic tone mapping
 * - Scroll-driven 5-stage camera & lighting transitions with exponential damping
 * - Interactive mouse/touch parallax offset
 * - Tab visibility change listener to pause rendering when inactive
 * - Full memory lifecycle teardown
 */
export class HeroScene {
  constructor(containerId = 'hero-canvas') {
    this.containerId = containerId;
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;

    if (!isWebGLAvailable()) {
      console.warn('[Aurevia 3D] WebGL not available on this device. Fallback static media active.');
      return;
    }

    if (!this.container) {
      console.warn(`[Aurevia 3D] Container element '#${containerId}' not found.`);
      return;
    }

    // Bind methods to preserve context
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

    // State
    this.isDisposed = false;
    this.isPaused = false;
    this.clock = new THREE.Clock();
    this.animFrameId = null;

    // Scroll state
    this.scrollProgress = 0.0;
    this.targetScrollProgress = 0.0;

    // Parallax mouse interaction
    this.mouse = { x: 0.5, y: 0.5 };
    this.mouseTarget = { x: 0.0, y: 0.0 };
    this.mouseCurrent = { x: 0.0, y: 0.0 };

    // Camera trajectory keyframes
    this.camPosCurrent = new THREE.Vector3(0.0, 0.8, 5.8);
    this.camPosTarget = new THREE.Vector3(0.0, 0.8, 5.8);
    this.camLookTarget = new THREE.Vector3(0.0, 0.0, 0.0);
    this.camLookCurrent = new THREE.Vector3(0.0, 0.0, 0.0);

    // Product orientation targets
    this.productRotCurrent = new THREE.Euler(0, 0, 0);
    this.productRotTarget = new THREE.Euler(0, 0, 0);
    this.productPosCurrent = new THREE.Vector3(0, 0, 0);
    this.productPosTarget = new THREE.Vector3(0, 0, 0);

    // Reduced motion preference
    this.reducedMotion = prefersReducedMotion();

    this.init();
  }

  /**
   * Initializes WebGL scene, renderer, camera, models, and events.
   */
  init() {
    try {
      // 1. Determine dimensions
      let width = this.container.clientWidth;
      let height = this.container.clientHeight;

      // Handle cases where container is newly created or zero size
      if (!width || !height) {
        width = window.innerWidth;
        height = window.innerHeight;
      }

      // 2. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0a0a0c);

      // 3. Camera (FOV 45, luxury telephoto perspective)
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100.0);
      this.camera.position.copy(this.camPosCurrent);
      this.camera.lookAt(this.camLookCurrent);

      // 4. Renderer
      // Check if container is a canvas itself or a container element
      const isCanvasElement = this.container.tagName && this.container.tagName.toLowerCase() === 'canvas';
      const canvas = isCanvasElement ? this.container : undefined;

      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false
      });

      const maxPixelRatio = isMobileDevice() ? 1.5 : 2.0;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
      this.renderer.setSize(width, height);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Tone mapping & color space
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      if (THREE.SRGBColorSpace) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }

      // If container wasn't a canvas, append renderer canvas
      if (!isCanvasElement) {
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.display = 'block';
        this.container.appendChild(this.renderer.domElement);
      }

      // 5. Studio Lighting Rig
      this.lighting = createStudioLighting(this.scene);

      // 6. Ground Shadow Contact
      this.groundShadow = createGroundShadow();
      this.scene.add(this.groundShadow);

      // 7. Hero Product (Radiance Serum Bottle)
      this.product = createSerumBottle();
      this.scene.add(this.product);

      // 8. Background Shader Plane
      this.bgShader = createBackgroundShaderPlane(this.camera);
      this.scene.add(this.bgShader.mesh);

      // 9. Floating Atmospheric Particles
      this.particles = createParticles(this.scene);

      // 10. Event Listeners
      this.setupEventListeners();

      // Initial scroll progress check
      this.calculateScrollProgress();

      // Start animation loop
      this.clock.start();
      this.animate();

      console.log('[Aurevia 3D] Hero scene successfully initialized.');
    } catch (error) {
      console.error('[Aurevia 3D] Initialization failed:', error);
      this.dispose();
    }
  }

  /**
   * Sets up all DOM and interaction listeners.
   */
  setupEventListeners() {
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // ResizeObserver on container for dynamic responsive layouts
    if (window.ResizeObserver && this.container) {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);
    }
  }

  /**
   * Calculates scroll progress through the hero section.
   */
  calculateScrollProgress() {
    if (typeof window === 'undefined') return;
    const heroSection = document.getElementById('hero') || this.container.closest('section') || this.container;
    const rect = heroSection.getBoundingClientRect();
    const heroHeight = rect.height || window.innerHeight;
    const scrolledPast = -rect.top;
    
    // Progress normalized from 0.0 (top) to 1.0 (end of hero scroll track)
    let p = scrolledPast / Math.max(heroHeight, 1);
    p = Math.max(0.0, Math.min(1.0, p));
    this.targetScrollProgress = p;
  }

  handleScroll() {
    this.calculateScrollProgress();
  }

  /**
   * Normalizes mouse coordinates for parallax tilt.
   */
  handleMouseMove(event) {
    if (this.reducedMotion) return;
    const nx = (event.clientX / window.innerWidth) * 2 - 1;
    const ny = -(event.clientY / window.innerHeight) * 2 + 1;
    this.mouseTarget.x = nx * 0.28;
    this.mouseTarget.y = ny * 0.22;
    this.mouse.x = event.clientX / window.innerWidth;
    this.mouse.y = event.clientY / window.innerHeight;
  }

  /**
   * Touch support for mobile devices.
   */
  handleTouchMove(event) {
    if (this.reducedMotion || !event.touches[0]) return;
    const touch = event.touches[0];
    const nx = (touch.clientX / window.innerWidth) * 2 - 1;
    const ny = -(touch.clientY / window.innerHeight) * 2 + 1;
    this.mouseTarget.x = nx * 0.22;
    this.mouseTarget.y = ny * 0.16;
    this.mouse.x = touch.clientX / window.innerWidth;
    this.mouse.y = touch.clientY / window.innerHeight;
  }

  /**
   * Resizes renderer and camera to match updated viewport dimensions.
   */
  handleResize() {
    if (!this.renderer || !this.camera || !this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    if (this.bgShader && this.bgShader.uniforms) {
      this.bgShader.uniforms.u_resolution.value.set(width, height);
    }
  }

  /**
   * Pauses animation loop when tab is hidden to conserve power and battery.
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
      this.clock.start();
    }
  }

  /**
   * Updates camera, lighting, and product choreography based on scroll progress (0.0 to 1.0).
   * Keyframe stages:
   * - Stage 0.0 - 0.20: Front hero view, product rotates gently in
   * - Stage 0.20 - 0.40: Camera glides right, product tilts to catch key light
   * - Stage 0.40 - 0.60: Macro close-up on label typography & golden liquid
   * - Stage 0.60 - 0.80: Dramatic silhouette side view with intense rim lighting
   * - Stage 0.80 - 1.00: Pulls back into proud regal purchase view
   * 
   * @param {number} progress Normalized progress 0.0 to 1.0
   */
  updateScrollProgress(progress) {
    const p = Math.max(0.0, Math.min(1.0, progress));

    if (p < 0.20) {
      // Stage 1 (0.00 -> 0.20): Front view, graceful entrance
      const t = p / 0.20;
      this.camPosTarget.set(
        0.0 + t * 0.4,
        0.8 - t * 0.1,
        5.8 - t * 0.4
      );
      this.camLookTarget.set(0.0, 0.0, 0.0);
      this.productRotTarget.set(
        0.0,
        t * 0.35,
        0.0
      );
      this.productPosTarget.set(0.0, 0.0, 0.0);

      if (this.lighting) {
        this.lighting.keyLight.intensity = 1.35;
        this.lighting.rimLight.intensity = 0.75;
      }
    } else if (p < 0.40) {
      // Stage 2 (0.20 -> 0.40): 30-degree dynamic angle, light shimmer
      const t = (p - 0.20) / 0.20;
      this.camPosTarget.set(
        0.4 + t * 1.2,
        0.7 - t * 0.2,
        5.4 - t * 0.6
      );
      this.camLookTarget.set(0.0, -0.1, 0.0);
      this.productRotTarget.set(
        -0.08 * t,
        0.35 + t * 0.55,
        -0.04 * t
      );
      this.productPosTarget.set(-0.15 * t, 0.05 * t, 0.0);

      if (this.lighting) {
        this.lighting.keyLight.intensity = 1.35 + t * 0.25;
        this.lighting.bounceLight.intensity = 0.45 + t * 0.2;
      }
    } else if (p < 0.60) {
      // Stage 3 (0.40 -> 0.60): Macro detail view, label typography inspection
      const t = (p - 0.40) / 0.20;
      this.camPosTarget.set(
        1.6 - t * 1.2,
        0.5 - t * 0.3,
        4.8 - t * 1.6
      );
      this.camLookTarget.set(0.0, -0.3, 0.0);
      this.productRotTarget.set(
        -0.08 + t * 0.05,
        0.90 - t * 0.45,
        -0.04 + t * 0.04
      );
      this.productPosTarget.set(-0.15 + t * 0.2, 0.1, 0.0);

      if (this.lighting) {
        this.lighting.keyLight.intensity = 1.60 - t * 0.15;
        this.lighting.rimLight.intensity = 0.85;
      }
    } else if (p < 0.80) {
      // Stage 4 (0.60 -> 0.80): Side silhouette view, intense rim halo
      const t = (p - 0.60) / 0.20;
      this.camPosTarget.set(
        0.4 - t * 2.2,
        0.2 + t * 0.8,
        3.2 + t * 1.2
      );
      this.camLookTarget.set(0.0, 0.0, 0.0);
      this.productRotTarget.set(
        0.0,
        0.45 + t * 0.8,
        0.0
      );
      this.productPosTarget.set(0.05 - t * 0.1, 0.0, 0.0);

      if (this.lighting) {
        // High rim kicker light creates backlit halo
        this.lighting.rimLight.intensity = 0.85 + t * 0.65;
        this.lighting.fillLight.intensity = 0.35;
      }
    } else {
      // Stage 5 (0.80 -> 1.00): Grand pull back for purchase decision
      const t = (p - 0.80) / 0.20;
      this.camPosTarget.set(
        -1.8 + t * 1.8,
        1.0 - t * 0.2,
        4.4 + t * 1.0
      );
      this.camLookTarget.set(0.0, 0.0, 0.0);
      this.productRotTarget.set(
        0.0,
        1.25 - t * 0.85,
        0.0
      );
      this.productPosTarget.set(0.0, 0.0, 0.0);

      if (this.lighting) {
        this.lighting.keyLight.intensity = 1.45;
        this.lighting.rimLight.intensity = 0.80;
        this.lighting.bounceLight.intensity = 0.45;
      }
    }
  }

  /**
   * Main requestAnimationFrame rendering loop.
   */
  animate() {
    if (this.isDisposed) return;

    this.animFrameId = requestAnimationFrame(this.animate);

    if (this.isPaused) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Exponential smoothing damping for scroll progress
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * (1.0 - Math.exp(-9.0 * delta));
    this.updateScrollProgress(this.scrollProgress);

    // 2. Parallax mouse interpolation
    this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * (1.0 - Math.exp(-6.0 * delta));
    this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * (1.0 - Math.exp(-6.0 * delta));

    // 3. Camera position interpolation
    this.camPosCurrent.lerp(this.camPosTarget, 1.0 - Math.exp(-7.0 * delta));
    this.camLookCurrent.lerp(this.camLookTarget, 1.0 - Math.exp(-7.0 * delta));

    this.camera.position.set(
      this.camPosCurrent.x + this.mouseCurrent.x * 0.5,
      this.camPosCurrent.y + this.mouseCurrent.y * 0.4,
      this.camPosCurrent.z
    );
    this.camera.lookAt(this.camLookCurrent);

    // 4. Product orientation & idle floating
    if (this.product) {
      // Idle breathing float
      const idleFloatY = this.reducedMotion ? 0 : Math.sin(elapsedTime * 1.2) * 0.045;
      const idleTiltZ = this.reducedMotion ? 0 : Math.cos(elapsedTime * 0.9) * 0.015;
      const idleSlowTurn = this.reducedMotion ? 0 : elapsedTime * 0.05;

      this.productPosCurrent.lerp(this.productPosTarget, 1.0 - Math.exp(-7.0 * delta));
      this.product.position.set(
        this.productPosCurrent.x,
        this.productPosCurrent.y + idleFloatY,
        this.productPosCurrent.z
      );

      // Rotate with scroll + mouse parallax + idle
      this.productRotCurrent.x += (this.productRotTarget.x - this.productRotCurrent.x) * (1.0 - Math.exp(-7.0 * delta));
      this.productRotCurrent.y += (this.productRotTarget.y - this.productRotCurrent.y) * (1.0 - Math.exp(-7.0 * delta));
      this.productRotCurrent.z += (this.productRotTarget.z - this.productRotCurrent.z) * (1.0 - Math.exp(-7.0 * delta));

      this.product.rotation.set(
        this.productRotCurrent.x + this.mouseCurrent.y * 0.4,
        this.productRotCurrent.y + idleSlowTurn + this.mouseCurrent.x * 0.7,
        this.productRotCurrent.z + idleTiltZ
      );
    }

    // 5. Update ground shadow opacity & scale in sync with float
    if (this.groundShadow && this.product) {
      const shadowScale = 1.0 - (this.product.position.y * 0.1);
      this.groundShadow.scale.set(shadowScale, shadowScale, shadowScale);
    }

    // 6. Update background shader
    if (this.bgShader) {
      this.bgShader.update(elapsedTime, this.scrollProgress, this.mouse);
    }

    // 7. Update atmospheric particles
    if (this.particles) {
      this.particles.update(elapsedTime, delta);
    }

    // 8. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Complete memory cleanup and teardown.
   */
  dispose() {
    this.isDisposed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.particles) {
      this.particles.dispose();
      this.particles = null;
    }

    // Traverse scene and dispose geometries, materials, and textures
    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.isMesh || child.isPoints) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              child.material.dispose();
            }
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }

    console.log('[Aurevia 3D] Hero scene completely disposed.');
  }
}

/* ==========================================================================
   10. PRODUCT DETAIL SCENE (INTERACTIVE 360 DEGREE INSPECTOR)
   ========================================================================== */

/**
 * ProductDetailScene provides interactive 360-degree orbital rotation,
 * touch gestures, auto-rotation, and zoom for product modal or detail pages.
 */
export class ProductDetailScene {
  /**
   * @param {string|HTMLElement} containerId Target container or canvas
   * @param {string} productId Identifier for product model
   */
  constructor(containerId = 'detail-canvas', productId = 'serum') {
    this.containerId = containerId;
    this.productId = productId;
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;

    if (!isWebGLAvailable()) {
      console.warn('[Aurevia 3D] WebGL not available for detail scene.');
      return;
    }

    if (!this.container) {
      console.warn(`[Aurevia 3D] Detail container '#${containerId}' not found.`);
      return;
    }

    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onWheel = this.onWheel.bind(this);

    this.isDisposed = false;
    this.isPaused = false;
    this.clock = new THREE.Clock();
    this.animFrameId = null;

    // Interaction state
    this.isDragging = false;
    this.pointerStart = { x: 0, y: 0 };
    this.rotationVelocity = { x: 0, y: 0.005 };
    this.lastPointerTime = 0;
    this.lastPointerPos = { x: 0, y: 0 };
    this.idleTimer = 0;
    this.autoRotateSpeed = 0.006;

    // Zoom limits
    this.cameraDistance = 5.2;
    this.targetCameraDistance = 5.2;
    this.minDistance = 3.2;
    this.maxDistance = 7.5;

    this.init();
  }

  init() {
    try {
      let width = this.container.clientWidth || window.innerWidth;
      let height = this.container.clientHeight || window.innerHeight;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0a0a0c);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50.0);
      this.camera.position.set(0.0, 0.6, this.cameraDistance);
      this.camera.lookAt(0, 0, 0);

      // 3. Renderer
      const isCanvasElement = this.container.tagName && this.container.tagName.toLowerCase() === 'canvas';
      const canvas = isCanvasElement ? this.container : undefined;

      this.renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });

      const maxRatio = isMobileDevice() ? 1.5 : 2.0;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxRatio));
      this.renderer.setSize(width, height);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.18;
      if (THREE.SRGBColorSpace) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }

      if (!isCanvasElement) {
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        this.renderer.domElement.style.display = 'block';
        this.container.appendChild(this.renderer.domElement);
      }

      // 4. Lighting Rig
      this.setupDetailLighting();

      // 5. Product Model Group
      this.productGroup = new THREE.Group();
      this.product = createProductModel(this.productId);
      this.productGroup.add(this.product);
      this.scene.add(this.productGroup);

      // 6. Ground Shadow
      this.groundShadow = createGroundShadow();
      this.scene.add(this.groundShadow);

      // 7. Atmospheric Dust Particles
      this.particles = createParticles(this.scene);

      // 8. Event listeners
      this.setupEventListeners();

      // Start loop
      this.clock.start();
      this.animate();
    } catch (error) {
      console.error('[Aurevia 3D] Detail Scene init error:', error);
      this.dispose();
    }
  }

  setupDetailLighting() {
    const ambient = new THREE.AmbientLight(0x18161f, 0.35);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xfffaea, 1.4);
    key.position.set(4, 7, 5);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xd4e4f7, 0.55);
    fill.position.set(-4, 3, -2);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffeed6, 0.85);
    rim.position.set(0, 4, -6);
    this.scene.add(rim);

    const bottomGlow = new THREE.PointLight(0xe8be78, 0.4, 6.0);
    bottomGlow.position.set(0, -1.6, 1.0);
    this.scene.add(bottomGlow);
  }

  setupEventListeners() {
    const el = this.renderer.domElement;
    el.style.touchAction = 'none'; // Prevent scrolling during 3D inspection

    el.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('resize', this.handleResize);

    if (window.ResizeObserver && this.container) {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);
    }
  }

  onPointerDown(e) {
    this.isDragging = true;
    this.pointerStart.x = e.clientX;
    this.pointerStart.y = e.clientY;
    this.lastPointerPos.x = e.clientX;
    this.lastPointerPos.y = e.clientY;
    this.lastPointerTime = performance.now();
    this.rotationVelocity.x = 0;
    this.rotationVelocity.y = 0;
    this.idleTimer = 0;
  }

  onPointerMove(e) {
    if (!this.isDragging || !this.productGroup) return;

    const dx = e.clientX - this.lastPointerPos.x;
    const dy = e.clientY - this.lastPointerPos.y;
    const now = performance.now();
    const dt = Math.max(1, now - this.lastPointerTime);

    // Apply rotation
    this.productGroup.rotation.y += dx * 0.007;
    this.productGroup.rotation.x += dy * 0.005;

    // Clamp vertical tilt to prevent inverted view
    this.productGroup.rotation.x = Math.max(-0.6, Math.min(0.6, this.productGroup.rotation.x));

    // Calculate drag velocity for smooth inertia on release
    this.rotationVelocity.y = (dx / dt) * 0.04;
    this.rotationVelocity.x = (dy / dt) * 0.03;

    this.lastPointerPos.x = e.clientX;
    this.lastPointerPos.y = e.clientY;
    this.lastPointerTime = now;
    this.idleTimer = 0;
  }

  onPointerUp() {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.003;
    this.targetCameraDistance = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.targetCameraDistance + zoomDelta)
    );
  }

  handleResize() {
    if (!this.renderer || !this.camera || !this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Changes the displayed product model dynamically.
   * @param {string} productId
   */
  switchProduct(productId) {
    if (!this.scene || !this.productGroup) return;
    this.productId = productId;

    // Remove existing child
    while (this.productGroup.children.length > 0) {
      const child = this.productGroup.children[0];
      this.productGroup.remove(child);
      if (child.traverse) {
        child.traverse((c) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) {
            if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
            else c.material.dispose();
          }
        });
      }
    }

    // Build new product
    this.product = createProductModel(productId);
    this.productGroup.add(this.product);
    this.productGroup.rotation.set(0, 0, 0);
  }

  animate() {
    if (this.isDisposed) return;
    this.animFrameId = requestAnimationFrame(this.animate);

    if (this.isPaused) return;

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth zoom interpolation
    this.cameraDistance += (this.targetCameraDistance - this.cameraDistance) * (1.0 - Math.exp(-8.0 * delta));
    this.camera.position.z = this.cameraDistance;

    // Apply inertia and auto-rotation
    if (!this.isDragging) {
      this.idleTimer += delta;

      // Friction on velocity
      this.rotationVelocity.x *= 0.92;
      this.rotationVelocity.y *= 0.92;

      this.productGroup.rotation.x += this.rotationVelocity.x;
      this.productGroup.rotation.y += this.rotationVelocity.y;

      // Restore tilt back towards horizontal slowly
      this.productGroup.rotation.x *= 0.96;

      // Auto-rotation kicks in after 1.5s of idle
      if (this.idleTimer > 1.5 && !prefersReducedMotion()) {
        this.productGroup.rotation.y += this.autoRotateSpeed;
      }
    }

    // Idle subtle vertical float
    if (!prefersReducedMotion()) {
      this.productGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.035;
    }

    // Update particles
    if (this.particles) {
      this.particles.update(elapsedTime, delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isDisposed = true;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.renderer && this.renderer.domElement) {
      const el = this.renderer.domElement;
      el.removeEventListener('pointerdown', this.onPointerDown);
      window.removeEventListener('pointermove', this.onPointerMove);
      window.removeEventListener('pointerup', this.onPointerUp);
      el.removeEventListener('wheel', this.onWheel);
    }
    window.removeEventListener('resize', this.handleResize);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.particles) {
      this.particles.dispose();
      this.particles = null;
    }

    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.isMesh || child.isPoints) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
            else child.material.dispose();
          }
        }
      });
    }

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }

    console.log('[Aurevia 3D] Detail scene completely disposed.');
  }
}

/* ==========================================================================
   11. PRODUCT CARD MINI 3D PREVIEW (LIGHTWEIGHT HOVER ENGINE)
   ========================================================================== */

/**
 * Lightweight micro-renderer for interactive product card hovers.
 * Only renders on hover to keep page frame rate locked at 60fps.
 */
export class ProductCardMiniPreview {
  constructor(canvasElement, productId = 'serum') {
    if (!canvasElement || !isWebGLAvailable()) return;

    this.canvas = canvasElement;
    this.productId = productId;
    this.isHovered = false;
    this.animFrameId = null;

    this.init();
  }

  init() {
    const width = this.canvas.clientWidth || 280;
    const height = this.canvas.clientHeight || 280;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 20);
    this.camera.position.set(0, 0.5, 5.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1.0);

    // Simple lighting
    const amb = new THREE.AmbientLight(0x22222a, 0.5);
    this.scene.add(amb);
    const dir = new THREE.DirectionalLight(0xfffaea, 1.2);
    dir.position.set(3, 5, 4);
    this.scene.add(dir);

    // Add model
    this.product = createProductModel(this.productId);
    this.scene.add(this.product);

    // Initial render
    this.renderer.render(this.scene, this.camera);

    // Hover listeners
    this.canvas.addEventListener('mouseenter', () => this.start());
    this.canvas.addEventListener('mouseleave', () => this.stop());
  }

  start() {
    this.isHovered = true;
    const loop = () => {
      if (!this.isHovered) return;
      if (this.product) this.product.rotation.y += 0.015;
      this.renderer.render(this.scene, this.camera);
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.isHovered = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  dispose() {
    this.stop();
    if (this.scene) {
      this.scene.traverse((c) => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) {
          if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
          else c.material.dispose();
        }
      });
    }
    if (this.renderer) this.renderer.dispose();
  }
}

/* ==========================================================================
   12. GLOBAL SCENE MANAGEMENT & INITIALIZATION API
   ========================================================================== */

let activeHeroScene = null;
let activeDetailScene = null;

/**
 * Initializes the main hero section 3D experience.
 * @param {string} containerId Element ID or element (default 'hero-canvas')
 * @returns {HeroScene|null}
 */
export function initHeroScene(containerId = 'hero-canvas') {
  if (activeHeroScene) {
    activeHeroScene.dispose();
    activeHeroScene = null;
  }

  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) {
    console.warn(`[Aurevia 3D] Target container #${containerId} not present in DOM.`);
    return null;
  }

  activeHeroScene = new HeroScene(containerId);
  return activeHeroScene;
}

/**
 * Initializes the 3D product detail / modal inspector.
 * @param {string} productId Product identifier ('serum', 'cream', 'cleanser', 'oil')
 * @param {string} containerId Element ID (default 'detail-canvas')
 * @returns {ProductDetailScene|null}
 */
export function initDetailScene(productId = 'serum', containerId = 'detail-canvas') {
  if (activeDetailScene) {
    activeDetailScene.dispose();
    activeDetailScene = null;
  }

  const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  if (!container) {
    console.warn(`[Aurevia 3D] Target detail container #${containerId} not present in DOM.`);
    return null;
  }

  activeDetailScene = new ProductDetailScene(containerId, productId);
  return activeDetailScene;
}

/**
 * Disposes all active Three.js scenes to free GPU and memory resources.
 */
export function disposeScenes() {
  if (activeHeroScene) {
    activeHeroScene.dispose();
    activeHeroScene = null;
  }
  if (activeDetailScene) {
    activeDetailScene.dispose();
    activeDetailScene = null;
  }
}

/**
 * Returns currently running hero scene instance.
 * @returns {HeroScene|null}
 */
export function getHeroScene() {
  return activeHeroScene;
}

/**
 * Returns currently running detail scene instance.
 * @returns {ProductDetailScene|null}
 */
export function getDetailScene() {
  return activeDetailScene;
}

// Attach to window for seamless integration with non-module scripts and app.js
if (typeof window !== 'undefined') {
  window.SceneManager = {
    initHeroScene,
    initDetailScene,
    disposeScenes,
    getHeroScene,
    getDetailScene,
    createProductModel,
    createSerumBottle,
    createCreamJar,
    createCleanserBottle,
    createOilBottle,
    HeroScene,
    ProductDetailScene,
    ProductCardMiniPreview,
    isWebGLAvailable
  };

  window.Aurevia3D = window.SceneManager;
}

// Auto-boot hero scene if canvas element already exists in document
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('hero-canvas')) {
        initHeroScene('hero-canvas');
      }
    });
  } else {
    if (document.getElementById('hero-canvas')) {
      initHeroScene('hero-canvas');
    }
  }
}
