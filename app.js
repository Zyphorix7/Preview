/**
 * AUREVIA — Fine Fragrance & Luxury Botanical Atelier
 * Main Application Engine (app.js)
 * 
 * Strict US Market E-Commerce:
 * - Integer-cent monetary precision & en-US currency formatting ($)
 * - Official Sketchfab 3D Perfume Model (CC-BY 4.0 ChristyMathews) + Three.js studio rig
 * - Clean solid luxury design (Liquid Glass UI completely removed)
 * - Firebase Authentication & Cloud Firestore data persistence
 * - US Domestic Shipping & Location-dependent State Sales Tax
 * - Client Hash Router, Interactive Bag, Live Search, Wishlist & Customer Accounts
 */

import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCurrentCustomer,
  subscribeToAuth,
  saveOrder,
  fetchUserOrders,
  getWishlist,
  toggleWishlistItem,
  isLiveFirebase
} from './firebase-config.js';

/* ==========================================================================
   1. US CURRENCY & LOCALIZATION UTILITIES
   ========================================================================== */

/**
 * Format integer cents into US currency string: e.g. 14500 -> "$145.00"
 * @param {number} cents
 * @returns {string}
 */
export function formatUSD(cents) {
  const dollars = (cents || 0) / 100;
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * 50 US States + DC Sales Tax Rate Table
 */
export const US_STATES = [
  { code: 'AL', name: 'Alabama', tax: 0.0400 },
  { code: 'AK', name: 'Alaska', tax: 0.0000 },
  { code: 'AZ', name: 'Arizona', tax: 0.0560 },
  { code: 'AR', name: 'Arkansas', tax: 0.0650 },
  { code: 'CA', name: 'California', tax: 0.0725 },
  { code: 'CO', name: 'Colorado', tax: 0.0290 },
  { code: 'CT', name: 'Connecticut', tax: 0.0635 },
  { code: 'DE', name: 'Delaware', tax: 0.0000 },
  { code: 'DC', name: 'District of Columbia', tax: 0.0600 },
  { code: 'FL', name: 'Florida', tax: 0.0600 },
  { code: 'GA', name: 'Georgia', tax: 0.0400 },
  { code: 'HI', name: 'Hawaii', tax: 0.0400 },
  { code: 'ID', name: 'Idaho', tax: 0.0600 },
  { code: 'IL', name: 'Illinois', tax: 0.0625 },
  { code: 'IN', name: 'Indiana', tax: 0.0700 },
  { code: 'IA', name: 'Iowa', tax: 0.0600 },
  { code: 'KS', name: 'Kansas', tax: 0.0650 },
  { code: 'KY', name: 'Kentucky', tax: 0.0600 },
  { code: 'LA', name: 'Louisiana', tax: 0.0445 },
  { code: 'ME', name: 'Maine', tax: 0.0550 },
  { code: 'MD', name: 'Maryland', tax: 0.0600 },
  { code: 'MA', name: 'Massachusetts', tax: 0.0625 },
  { code: 'MI', name: 'Michigan', tax: 0.0600 },
  { code: 'MN', name: 'Minnesota', tax: 0.06875 },
  { code: 'MS', name: 'Mississippi', tax: 0.0700 },
  { code: 'MO', name: 'Missouri', tax: 0.04225 },
  { code: 'MT', name: 'Montana', tax: 0.0000 },
  { code: 'NE', name: 'Nebraska', tax: 0.0550 },
  { code: 'NV', name: 'Nevada', tax: 0.0685 },
  { code: 'NH', name: 'New Hampshire', tax: 0.0000 },
  { code: 'NJ', name: 'New Jersey', tax: 0.06625 },
  { code: 'NM', name: 'New Mexico', tax: 0.0500 },
  { code: 'NY', name: 'New York', tax: 0.08875 },
  { code: 'NC', name: 'North Carolina', tax: 0.0475 },
  { code: 'ND', name: 'North Dakota', tax: 0.0500 },
  { code: 'OH', name: 'Ohio', tax: 0.0575 },
  { code: 'OK', name: 'Oklahoma', tax: 0.0450 },
  { code: 'OR', name: 'Oregon', tax: 0.0000 },
  { code: 'PA', name: 'Pennsylvania', tax: 0.0600 },
  { code: 'RI', name: 'Rhode Island', tax: 0.0700 },
  { code: 'SC', name: 'South Carolina', tax: 0.0600 },
  { code: 'SD', name: 'South Dakota', tax: 0.0450 },
  { code: 'TN', name: 'Tennessee', tax: 0.0700 },
  { code: 'TX', name: 'Texas', tax: 0.0625 },
  { code: 'UT', name: 'Utah', tax: 0.0610 },
  { code: 'VT', name: 'Vermont', tax: 0.0600 },
  { code: 'VA', name: 'Virginia', tax: 0.0530 },
  { code: 'WA', name: 'Washington', tax: 0.0650 },
  { code: 'WV', name: 'West Virginia', tax: 0.0600 },
  { code: 'WI', name: 'Wisconsin', tax: 0.0500 },
  { code: 'WY', name: 'Wyoming', tax: 0.0400 }
];

/* ==========================================================================
   2. PRODUCT CATALOG DATA (STORED IN INTEGER CENTS)
   ========================================================================== */

const PRODUCTS = [
  {
    id: 'radiance-serum',
    name: 'Aurevia Radiance Serum',
    tagline: 'L\'Élixir Solaire Extrait & Serum',
    priceCents: 14500, // $145.00 USD
    category: 'serums',
    categoryLabel: 'Signature Extrait',
    theme: 'luminescence',
    rating: 4.9,
    reviewCount: 128,
    stock: 24,
    inStock: true,
    description: 'An artisanal solar brightening elixir blending 15% stabilized liposomal vitamin C, triple-weight hyaluronic acid, and micronized 24K colloidal gold. Complemented by notes of wild Sicilian bergamot, orange blossom, and golden Mysore sandalwood.',
    shortDescription: 'Stabilized Vitamin C, 24K gold & bergamot nectar',
    featured: true,
    fragranceNotes: {
      top: 'Solar Bergamot, Neroli & Crisp Petitgrain',
      heart: 'French Orange Blossom & Damask Jasmine',
      base: 'Warm Sandalwood, 24K Amber & Solar Musk'
    },
    // Sketchfab 3D Perfume Model Integration (CC-BY 4.0 ChristyMathews)
    sketchfabModel: {
      title: 'Perfume',
      creator: 'ChristyMathews',
      uid: 'c66ebff390eb4790a836d2f3d5054874',
      embedUrl: 'https://sketchfab.com/models/c66ebff390eb4790a836d2f3d5054874/embed?autostart=1&camera=0&ui_infos=0&ui_controls=1&ui_watermark=0',
      modelUrl: 'https://sketchfab.com/3d-models/perfume-c66ebff390eb4790a836d2f3d5054874',
      creatorUrl: 'https://sketchfab.com/ChristyMathews',
      license: 'CC Attribution 4.0',
      licenseUrl: 'http://creativecommons.org/licenses/by/4.0/'
    },
    ingredients: [
      { name: 'Stabilized Vitamin C (15%)', origin: 'Formulated in France', benefit: 'Neutralizes free radicals & revives radiance', detail: 'Liposomal 3-O-Ethyl Ascorbic Acid' },
      { name: 'Multi-Weight Hyaluronate', origin: 'Swiss Bio-Ferment', benefit: 'Deep cellular plumpness & prolonged hydration', detail: 'Triple molecular matrix (5kDa – 1.8MDa)' },
      { name: '24K Gold Suspension', origin: 'Ethically Sourced', benefit: 'Instant radiant sheen & micro-circulation', detail: 'Pharmaceutical-grade gold leaf particulate' },
      { name: 'Niacinamide (5%)', origin: 'Pharmaceutical Grade', benefit: 'Refines pore texture & balances sebum', detail: 'Ultra-pure Vitamin B3 derivative' }
    ],
    details: {
      size: '30 ml / 1.0 fl oz',
      skinType: 'All skin types, especially fatigued & dull',
      usage: 'Dispense 2–3 drops onto clean fingertips morning and evening. Press gently into face and neck before moisturizing.',
      texture: 'Silk-weight liquid with warm champagne luminescence',
      shelfLife: '12 months after opening'
    },
    colors: { primary: '#d4af7a', secondary: '#b8956a', accent: '#f5e6c8', dark: '#1e1810' }
  },
  {
    id: 'hydration-cream',
    name: 'Aurevia Hydration Cream',
    tagline: 'Crème Céleste Barrier Recovery',
    priceCents: 12800, // $128.00 USD
    category: 'moisturizers',
    categoryLabel: 'Barrier Recovery',
    theme: 'celestial',
    rating: 4.8,
    reviewCount: 94,
    stock: 18,
    inStock: true,
    description: 'A decadent moisture cocoon enriched with cold-pressed arctic cloudberry, biomimetic ceramides, and olive squalane. Infused with delicate notes of frosted wild berries, white cedar, and powdery cashmere musk.',
    shortDescription: 'Biomimetic ceramides & arctic cloudberry barrier cream',
    featured: false,
    fragranceNotes: {
      top: 'Frosted Cloudberry & Wild Alpine Mint',
      heart: 'White Cedarwood & Dewy Water Lily',
      base: 'Cashmere Musk & Bourbon Vanilla Pod'
    },
    ingredients: [
      { name: 'Triple Ceramide Complex', origin: 'Bio-Fermented', benefit: 'Repairs and reinforces lipid moisture mantle', detail: 'Ceramides NP, AP, EOP with Phytosphingosine' },
      { name: 'Arctic Cloudberry Extract', origin: 'Wild Nordic Harvest', benefit: 'Super-antioxidant high in Vitamins A, C, E', detail: 'Cold-pressed wild Rubus chamaemorus' },
      { name: 'Olive-Derived Squalane', origin: 'Spanish Olive Orchards', benefit: 'Weightless lipid mimic for satin finish', detail: '100% plant-based squalane' },
      { name: 'Shea Butter Ester', origin: 'West African Co-op', benefit: 'Velvety comfort without greasy residue', detail: 'Purified unsaponifiable fractions' }
    ],
    details: {
      size: '50 ml / 1.7 fl oz',
      skinType: 'Dry, dehydrated, or sensitive skin',
      usage: 'Warm a pea-sized amount between fingertips and massage across cleansed face and décolletage as the final ritual step.',
      texture: 'Whipped cloud-velvet emulsion',
      shelfLife: '12 months after opening'
    },
    colors: { primary: '#dfbfa8', secondary: '#bfa088', accent: '#f8ece1', dark: '#1c1714' }
  },
  {
    id: 'botanical-cleanser',
    name: 'Aurevia Botanical Cleanser',
    tagline: 'Purifiant Botanique Hydro-Gel',
    priceCents: 6800, // $68.00 USD
    category: 'cleansers',
    categoryLabel: 'Gentle Purifier',
    theme: 'botanical',
    rating: 4.7,
    reviewCount: 156,
    stock: 35,
    inStock: true,
    description: 'A sulfate-free crystalline gel fusing ceremonial matcha, German chamomile bisabolol, and phospholipid micellar matrices. Scented naturally with crushed green tea leaves, soothing chamomile blossoms, and vetiver root.',
    shortDescription: 'Ceremonial matcha & chamomile gentle wash',
    featured: false,
    fragranceNotes: {
      top: 'Ceremonial Uji Matcha & Crushed Tea Leaves',
      heart: 'Bavarian Chamomile Flower & Vetiver Root',
      base: 'Clean White Woods & Bamboo Mist'
    },
    ingredients: [
      { name: 'Ceremonial Matcha EGCG', origin: 'Uji, Kyoto Japan', benefit: 'Potent polyphenols soothe oxidative stress', detail: 'Organic shade-grown Camellia sinensis' },
      { name: 'German Chamomile Bisabolol', origin: 'Bavarian Alps', benefit: 'Calms redness, irritation, and sensitivity', detail: 'Pure natural isolated (-)-alpha-bisabolol' },
      { name: 'Phospholipid Micelles', origin: 'Plant Bio-Tech', benefit: 'Traps impurities while reinforcing lipids', detail: 'Biomimetic lecithin micro-capsules' },
      { name: 'Aloe Barbadensis Gel', origin: 'Californian Desert', benefit: 'Deep hydration and barrier soothing', detail: 'Cold-pressed inner leaf fillet' }
    ],
    details: {
      size: '150 ml / 5.1 fl oz',
      skinType: 'All skin types, including reactive & blemish-prone',
      usage: 'Lather one pump into damp palms, massage gently for 60 seconds, and rinse with lukewarm water.',
      texture: 'Refreshing crystalline gel that blossoms into micro-cushion foam',
      shelfLife: '12 months after opening'
    },
    colors: { primary: '#8fa88b', secondary: '#6e886a', accent: '#dbe8d8', dark: '#121a13' }
  },
  {
    id: 'renewal-oil',
    name: 'Aurevia Renewal Oil',
    tagline: 'Nectar Nocturne Midnight Treatment',
    priceCents: 18500, // $185.00 USD
    category: 'oils',
    categoryLabel: 'Nocturne Treatment',
    theme: 'nocturne',
    rating: 4.9,
    reviewCount: 88,
    stock: 14,
    inStock: true,
    description: 'An opulent midnight recovery nectar combining Patagonian wild rosehip, organic Moroccan argan, bakuchiol, and golden jojoba esters. Infused with dark amber, wild cardamom, and midnight Damascus rose.',
    shortDescription: 'Bakuchiol & virgin argan midnight recovery elixir',
    featured: false,
    fragranceNotes: {
      top: 'Wild Cardamom & Pink Peppercorn',
      heart: 'Damascus Night Rose & Smoked Fig',
      base: 'Dark Amber, Aged Agarwood & Cedar'
    },
    ingredients: [
      { name: 'Patagonian Rosehip Oil', origin: 'Chilean Andes', benefit: 'Rich in Pro-Vitamin A and Omega 3-6-9', detail: 'Cold-pressed certified organic Rosa rubiginosa' },
      { name: 'Bakuchiol (2%)', origin: 'Ayurvedic Babchi Seed', benefit: 'Clinically proven botanical retinol alternative', detail: '99% pure mono-terpene phenol' },
      { name: 'Hand-Harvested Argan Oil', origin: 'Souss Valley, Morocco', benefit: 'Intense lipid restoration & elasticity', detail: 'Virgin cold-pressed Argania spinosa kernel' },
      { name: 'Golden Jojoba Wax Esters', origin: 'Sonoran Desert', benefit: 'Mimics natural dermal sebum structure', detail: 'Unrefined cold-pressed liquid wax' }
    ],
    details: {
      size: '30 ml / 1.0 fl oz',
      skinType: 'Mature, combination, and environmentally stressed skin',
      usage: 'Press 3–4 drops into palms to warm, cup over face, and inhale deeply before sleep.',
      texture: 'Sublime golden satin dry-oil with immediate absorption',
      shelfLife: '12 months after opening'
    },
    colors: { primary: '#b8956a', secondary: '#8a6840', accent: '#ecd2b4', dark: '#1b140b' }
  }
];

window.PRODUCTS = PRODUCTS;

/* ==========================================================================
   3. HIGH-FIDELITY VECTOR PRODUCT RENDERERS (FALLBACK & THUMBNAILS)
   ========================================================================== */

function generateProductSVG(product) {
  const id = product.id;
  if (id === 'radiance-serum') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e1810" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="serumLiquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5e6c8"/>
      <stop offset="40%" stop-color="#d4af7a"/>
      <stop offset="100%" stop-color="#967240"/>
    </linearGradient>
    <linearGradient id="goldCap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8a693b"/><stop offset="35%" stop-color="#f5e6c8"/><stop offset="70%" stop-color="#d4af7a"/><stop offset="100%" stop-color="#694d25"/>
    </linearGradient>
    <filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  <rect width="400" height="500" fill="#0d0d0f"/>
  <circle cx="200" cy="270" r="160" fill="url(#bgGlow)"/>
  <ellipse cx="200" cy="440" rx="70" ry="12" fill="#000" opacity="0.6" filter="url(#shadow)"/>
  <rect x="150" y="160" width="100" height="260" rx="16" fill="#141416" stroke="#26262a" stroke-width="1.5"/>
  <rect x="156" y="200" width="88" height="212" rx="10" fill="url(#serumLiquid)"/>
  <rect x="165" y="275" width="70" height="85" rx="3" fill="#0f0f11" stroke="rgba(212,175,122,0.4)" stroke-width="0.8"/>
  <text x="200" y="303" font-family="serif" font-size="10" fill="#f5f0e8" letter-spacing="3" text-anchor="middle">AUREVIA</text>
  <line x1="175" y1="313" x2="225" y2="313" stroke="#d4af7a" stroke-width="0.5"/>
  <text x="200" y="328" font-family="sans-serif" font-size="5.5" fill="#d4af7a" letter-spacing="2" text-anchor="middle">RADIANCE SERUM</text>
  <text x="200" y="344" font-family="sans-serif" font-size="4.5" fill="#888" letter-spacing="1" text-anchor="middle">30 ML / 1.0 FL. OZ</text>
  <rect x="170" y="142" width="60" height="22" rx="3" fill="url(#goldCap)"/>
  <rect x="176" y="90" width="48" height="54" rx="4" fill="url(#goldCap)"/>
  <path d="M 186 90 C 186 65, 214 65, 214 90 Z" fill="#18181a" stroke="#2a2a2e" stroke-width="1.5"/>
</svg>`)}`;
  }
  if (id === 'hydration-cream') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="creamGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#241c18" stop-opacity="0.8"/><stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lidGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8a693b"/><stop offset="35%" stop-color="#f5e6c8"/><stop offset="70%" stop-color="#dfbfa8"/><stop offset="100%" stop-color="#694d25"/>
    </linearGradient>
    <filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  <rect width="400" height="500" fill="#0d0d0f"/>
  <circle cx="200" cy="300" r="160" fill="url(#creamGlow)"/>
  <ellipse cx="200" cy="425" rx="90" ry="14" fill="#000" opacity="0.6" filter="url(#shadow)"/>
  <rect x="110" y="240" width="180" height="170" rx="16" fill="#151312" stroke="#2b2522" stroke-width="1.5"/>
  <text x="200" y="325" font-family="serif" font-size="13" fill="#f5f0e8" letter-spacing="4" text-anchor="middle">AUREVIA</text>
  <line x1="160" y1="337" x2="240" y2="337" stroke="#bfa088" stroke-width="0.8"/>
  <text x="200" y="354" font-family="sans-serif" font-size="6.5" fill="#dfbfa8" letter-spacing="2" text-anchor="middle">HYDRATION CREAM</text>
  <text x="200" y="372" font-family="sans-serif" font-size="5" fill="#888" letter-spacing="1" text-anchor="middle">50 ML / 1.7 FL. OZ</text>
  <rect x="100" y="195" width="200" height="48" rx="8" fill="url(#lidGold)"/>
</svg>`)}`;
  }
  if (id === 'botanical-cleanser') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="botGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#142016" stop-opacity="0.8"/><stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="botLiquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dbe8d8"/><stop offset="50%" stop-color="#8fa88b"/><stop offset="100%" stop-color="#4e684a"/>
    </linearGradient>
    <filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  <rect width="400" height="500" fill="#0d0d0f"/>
  <circle cx="200" cy="280" r="160" fill="url(#botGlow)"/>
  <ellipse cx="200" cy="450" rx="65" ry="12" fill="#000" opacity="0.6" filter="url(#shadow)"/>
  <rect x="145" y="170" width="110" height="270" rx="16" fill="#131714" stroke="#252e26" stroke-width="1.5"/>
  <rect x="151" y="195" width="98" height="235" rx="12" fill="url(#botLiquid)"/>
  <rect x="160" y="275" width="80" height="90" rx="3" fill="#0d120e" stroke="rgba(143,168,139,0.4)" stroke-width="0.8"/>
  <text x="200" y="303" font-family="serif" font-size="10" fill="#f5f0e8" letter-spacing="3" text-anchor="middle">AUREVIA</text>
  <line x1="172" y1="313" x2="228" y2="313" stroke="#8fa88b" stroke-width="0.6"/>
  <text x="200" y="328" font-family="sans-serif" font-size="5" fill="#8fa88b" letter-spacing="1.5" text-anchor="middle">BOTANICAL CLEANSER</text>
  <text x="200" y="344" font-family="sans-serif" font-size="4.5" fill="#888" letter-spacing="1" text-anchor="middle">150 ML / 5.1 FL. OZ</text>
  <rect x="175" y="145" width="50" height="26" rx="3" fill="#4e684a"/>
  <rect x="188" y="110" width="24" height="38" rx="2" fill="#4e684a"/>
  <path d="M 160 118 L 220 118 Q 230 118 230 126 L 160 126 Z" fill="#4e684a"/>
</svg>`)}`;
  }
  if (id === 'renewal-oil') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="oilGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#241a0e" stop-opacity="0.85"/><stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="richOil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ecd2b4"/><stop offset="35%" stop-color="#c98a44"/><stop offset="100%" stop-color="#693c12"/>
    </linearGradient>
    <linearGradient id="oilGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6e4f2b"/><stop offset="35%" stop-color="#ffdca8"/><stop offset="70%" stop-color="#b8956a"/><stop offset="100%" stop-color="#543b1e"/>
    </linearGradient>
    <filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  <rect width="400" height="500" fill="#0d0d0f"/>
  <circle cx="200" cy="275" r="160" fill="url(#oilGlow)"/>
  <ellipse cx="200" cy="445" rx="68" ry="12" fill="#000" opacity="0.6" filter="url(#shadow)"/>
  <rect x="150" y="170" width="100" height="260" rx="16" fill="#18130d" stroke="#2e2217" stroke-width="1.5"/>
  <rect x="156" y="200" width="88" height="220" rx="10" fill="url(#richOil)"/>
  <rect x="165" y="275" width="70" height="85" rx="3" fill="#120d08" stroke="rgba(184,149,106,0.5)" stroke-width="0.8"/>
  <text x="200" y="303" font-family="serif" font-size="10" fill="#f5f0e8" letter-spacing="3" text-anchor="middle">AUREVIA</text>
  <line x1="175" y1="313" x2="225" y2="313" stroke="#b8956a" stroke-width="0.5"/>
  <text x="200" y="328" font-family="sans-serif" font-size="5.5" fill="#b8956a" letter-spacing="1.8" text-anchor="middle">RENEWAL OIL</text>
  <text x="200" y="344" font-family="sans-serif" font-size="4.5" fill="#888" letter-spacing="1" text-anchor="middle">30 ML / 1.0 FL. OZ</text>
  <rect x="170" y="150" width="60" height="22" rx="3" fill="url(#oilGold)"/>
  <rect x="176" y="95" width="48" height="56" rx="4" fill="url(#oilGold)"/>
  <path d="M 186 95 C 186 70, 214 70, 214 95 Z" fill="#14100c" stroke="#2a2016" stroke-width="1.5"/>
</svg>`)}`;
  }
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#141416"/><text x="200" y="250" fill="#f5f0e8" font-family="serif" text-anchor="middle">AUREVIA</text></svg>`)}`;
}

/* ==========================================================================
   4. CLIENT SHOPPING CART ENGINE (INTEGER CENTS + TAX + US SHIPPING)
   ========================================================================== */

class CartManager {
  constructor() {
    this.items = [];
    this.selectedShipping = 'standard'; // 'standard' or 'express'
    this.selectedState = 'NY';
    this.appliedPromo = null; // { code: 'AUREVIA10', discountPercent: 10 }
    this.storageKey = 'aurevia_luxury_cart_v2';
    this.load();
  }

  getItems() {
    return this.items;
  }

  findItem(productId) {
    return this.items.find(item => item.productId === productId);
  }

  addItem(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = this.findItem(productId);
    const maxQty = product.stock || 10;
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, maxQty);
    } else {
      this.items.push({ productId, quantity: Math.min(quantity, maxQty) });
    }

    this.save();
    this.dispatch();
    showToast(product.name, 'Added to your luxury bag');
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.save();
    this.dispatch();
  }

  updateQuantity(productId, quantity) {
    const item = this.findItem(productId);
    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const product = PRODUCTS.find(p => p.id === productId);
    const maxQty = product ? (product.stock || 10) : 10;
    item.quantity = Math.min(Math.max(1, quantity), maxQty);
    this.save();
    this.dispatch();
  }

  setShippingMethod(method) {
    this.selectedShipping = method === 'express' ? 'express' : 'standard';
    this.dispatch();
  }

  setState(stateCode) {
    if (US_STATES.some(s => s.code === stateCode)) {
      this.selectedState = stateCode;
      this.dispatch();
    }
  }

  applyPromoCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'AUREVIA10') {
      this.appliedPromo = { code: 'AUREVIA10', discountPercent: 10, label: '10% Welcome Connoisseur Privilege' };
      this.dispatch();
      showToast('Promo Code Applied', '10% privilege discount applied to your bag.');
      return true;
    } else if (cleanCode === 'WELCOME15') {
      this.appliedPromo = { code: 'WELCOME15', discountPercent: 15, label: '15% Atelier Privilege' };
      this.dispatch();
      showToast('Promo Code Applied', '15% atelier discount applied.');
      return true;
    } else {
      showToast('Invalid Code', 'Please enter a valid promotion code (try AUREVIA10).');
      return false;
    }
  }

  removePromoCode() {
    this.appliedPromo = null;
    this.dispatch();
  }

  getSubtotalCents() {
    return this.items.reduce((total, item) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      return total + (product ? product.priceCents * item.quantity : 0);
    }, 0);
  }

  getDiscountCents() {
    if (!this.appliedPromo) return 0;
    const subtotal = this.getSubtotalCents();
    return Math.round(subtotal * (this.appliedPromo.discountPercent / 100));
  }

  getShippingCents() {
    if (this.items.length === 0) return 0;
    const subtotal = this.getSubtotalCents();
    if (this.selectedShipping === 'express') {
      return 1499; // $14.99 USD
    }
    // Standard Shipping: Complimentary on orders >= $150.00 (15000 cents), otherwise $5.99 (599 cents)
    return subtotal >= 15000 ? 0 : 599;
  }

  getTaxRate() {
    const stateObj = US_STATES.find(s => s.code === this.selectedState);
    return stateObj ? stateObj.tax : 0.065;
  }

  getTaxCents() {
    if (this.items.length === 0) return 0;
    const taxableSubtotal = Math.max(0, this.getSubtotalCents() - this.getDiscountCents());
    return Math.round(taxableSubtotal * this.getTaxRate());
  }

  getTotalCents() {
    return Math.max(0, this.getSubtotalCents() - this.getDiscountCents()) + this.getShippingCents() + this.getTaxCents();
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  clear() {
    this.items = [];
    this.save();
    this.dispatch();
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.items = parsed.filter(i => PRODUCTS.some(p => p.id === i.productId));
        }
      }
    } catch {
      this.items = [];
    }
  }

  dispatch() {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart: this } }));
  }
}

const cart = new CartManager();
window.cart = cart;

/* ==========================================================================
   5. APPLICATION STATE
   ========================================================================== */

const AppState = {
  currentView: 'home',
  currentProductId: null,
  searchQuery: '',
  activeFilter: 'all',
  sortBy: 'featured',
  cartOpen: false,
  searchOpen: false,
  mobileNavOpen: false,
  accountOpen: false,
  accountTab: 'login',
  activeDetailMediaMode: 'sketchfab' // 'sketchfab', 'three', or 'image'
};

/* ==========================================================================
   6. TOAST NOTIFICATIONS & UTILITIES
   ========================================================================== */

function showToast(title, desc = '') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="toast-icon">✦</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHTML(title)}</div>
      ${desc ? `<div class="toast-desc">${escapeHTML(desc)}</div>` : ''}
    </div>
  `;

  toast.classList.add('visible');

  if (toast._timer) clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 3200);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '★';
  for (let i = full + (half ? 1 : 0); i < 5; i++) s += '☆';
  return `<span class="product-stars" aria-label="${rating} out of 5 stars">${s}</span>`;
}

/* ==========================================================================
   7. CLIENT ROUTER
   ========================================================================== */

function navigateTo(path) {
  if (window.location.hash !== '#' + path) {
    window.location.hash = path;
  } else {
    handleRouteChange();
  }
}

function parseRoute() {
  const hash = window.location.hash.slice(1) || '/';
  if (hash.startsWith('/product/')) {
    const id = hash.replace('/product/', '').trim();
    return { view: 'product', productId: id };
  }
  if (hash === '/checkout') {
    return { view: 'checkout' };
  }
  if (hash === '/admin') {
    return { view: 'admin' };
  }
  return { view: 'home' };
}

function handleRouteChange() {
  const route = parseRoute();
  AppState.currentView = route.view;
  AppState.currentProductId = route.productId || null;

  closeAllOverlays();

  const main = document.getElementById('main-content');
  if (!main) return;

  if (route.view === 'product') {
    renderProductDetailView(route.productId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (route.view === 'checkout') {
    renderCheckoutView();
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (route.view === 'admin') {
    renderAdminDashboardView();
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    renderHomeView();
  }
}

/* ==========================================================================
   8. HEADER & NAVIGATION
   ========================================================================== */

function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const user = getCurrentCustomer();
  const wishlist = getWishlist();

  header.innerHTML = `
    <div class="demo-banner" id="demo-banner">
      <span class="demo-banner-pill">✦ United States Boutique</span>
      <span class="demo-banner-text">Complimentary US Ground Shipping on orders over $150.00. Real-time state tax estimation.</span>
      <button class="demo-banner-close" id="demo-banner-close" aria-label="Dismiss banner">×</button>
    </div>
    <div class="header-inner">
      <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <a href="#/" class="logo" aria-label="Aurevia Homepage">AUREVIA</a>
      <nav class="nav-links" aria-label="Primary Navigation">
        <a href="#/" data-nav="shop">Boutique</a>
        <a href="#/" data-nav="collection">The Collection</a>
        <a href="#/" data-nav="about">Atelier</a>
        <a href="#/admin" style="opacity: 0.6; font-size: 0.75rem;">Admin</a>
      </nav>
      <div class="header-actions">
        <!-- Search Trigger -->
        <button class="header-icon-btn" id="search-btn" aria-label="Search Formulations">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>

        <!-- Wishlist Button -->
        <button class="header-icon-btn" id="wishlist-btn" aria-label="View Saved Favorites">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="${wishlist.length ? 'var(--accent-champagne)' : 'none'}" stroke="currentColor" stroke-width="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${wishlist.length ? `<span class="cart-count" style="display:flex;">${wishlist.length}</span>` : ''}
        </button>

        <!-- Customer Account Trigger -->
        <button class="header-icon-btn" id="account-btn" aria-label="Customer Account">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </button>

        <!-- Bag Trigger -->
        <button class="header-icon-btn cart-btn" id="cart-btn" aria-label="Open Shopping Bag">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="cart-count" id="cart-count" style="display:none">0</span>
        </button>
      </div>
    </div>
  `;

  // Header Scroll Transition
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Banner dismiss
  document.getElementById('demo-banner-close')?.addEventListener('click', () => {
    const banner = document.getElementById('demo-banner');
    if (banner) banner.style.display = 'none';
  });

  // Action Triggers
  document.getElementById('cart-btn')?.addEventListener('click', () => toggleCart());
  document.getElementById('search-btn')?.addEventListener('click', () => toggleSearch());
  document.getElementById('account-btn')?.addEventListener('click', () => toggleAccountModal());
  document.getElementById('wishlist-btn')?.addEventListener('click', () => {
    showToast('Your Favorites', `${wishlist.length} saved formulation(s) in your private collection.`);
  });
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => toggleMobileNav());

  // Navigation Links
  header.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.nav;
      if (AppState.currentView !== 'home') {
        navigateTo('/');
        setTimeout(() => scrollToSection(target), 200);
      } else {
        e.preventDefault();
        scrollToSection(target);
      }
    });
  });

  updateCartCount();
}

function scrollToSection(target) {
  let el = null;
  if (target === 'shop' || target === 'collection') {
    el = document.getElementById('collection-section');
  } else if (target === 'about') {
    el = document.getElementById('about-section');
  }
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateCartCount() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const count = cart.getItemCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

/* ==========================================================================
   9. MOBILE NAVIGATION OVERLAY
   ========================================================================== */

function renderMobileNav() {
  const root = document.getElementById('mobile-nav-root');
  if (!root) return;

  root.innerHTML = `
    <div class="mobile-nav" id="mobile-nav" aria-hidden="true">
      <div class="mobile-nav-header">
        <span class="logo">AUREVIA</span>
        <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close navigation">×</button>
      </div>
      <nav class="mobile-nav-links" aria-label="Mobile Navigation Menu">
        <a href="#/" data-mobilenav="shop">The Boutique</a>
        <a href="#/" data-mobilenav="collection">Full Fragrance Suite</a>
        <a href="#/" data-mobilenav="about">Brand Atelier</a>
        <a href="#/checkout" data-mobilenav="checkout">US Checkout</a>
        <a href="#/admin" data-mobilenav="admin">Atelier Dashboard</a>
      </nav>
      <div class="mobile-nav-footer">
        <p class="mobile-nav-demo">✦ US Domestic Storefront · USD Currency ($)</p>
      </div>
    </div>
  `;

  document.getElementById('mobile-nav-close')?.addEventListener('click', closeMobileNav);

  root.querySelectorAll('[data-mobilenav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = e.currentTarget.dataset.mobilenav;
      closeMobileNav();
      if (target === 'checkout') {
        navigateTo('/checkout');
      } else if (target === 'admin') {
        navigateTo('/admin');
      } else if (AppState.currentView !== 'home') {
        navigateTo('/');
        setTimeout(() => scrollToSection(target), 200);
      } else {
        e.preventDefault();
        scrollToSection(target);
      }
    });
  });
}

function toggleMobileNav() {
  AppState.mobileNavOpen = !AppState.mobileNavOpen;
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('mobile-menu-btn');
  if (nav) nav.classList.toggle('active', AppState.mobileNavOpen);
  if (btn) btn.setAttribute('aria-expanded', AppState.mobileNavOpen);
  document.body.style.overflow = AppState.mobileNavOpen ? 'hidden' : '';
}

function closeMobileNav() {
  AppState.mobileNavOpen = false;
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('mobile-menu-btn');
  if (nav) nav.classList.remove('active');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ==========================================================================
   10. SHOPPING CART DRAWER (WITH US TAX & PROMO CODE)
   ========================================================================== */

function renderCartDrawer() {
  const root = document.getElementById('cart-drawer-root');
  if (!root) return;

  const items = cart.getItems();
  const isEmpty = items.length === 0;
  const subtotalCents = cart.getSubtotalCents();
  const discountCents = cart.getDiscountCents();
  const shippingCents = cart.getShippingCents();
  const taxCents = cart.getTaxCents();
  const totalCents = cart.getTotalCents();
  const freeShippingThresholdCents = 15000; // $150.00
  const progressPercent = Math.min(100, Math.round((subtotalCents / freeShippingThresholdCents) * 100));

  let itemsHTML = '';
  items.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return;

    itemsHTML += `
      <div class="cart-item" data-cart-id="${product.id}">
        <div class="cart-item-img-wrap">
          <img class="cart-item-img" src="${generateProductSVG(product)}" alt="${escapeHTML(product.name)}" width="82" height="100" loading="lazy">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-name">${escapeHTML(product.name)}</h4>
          <span class="cart-item-variant">${escapeHTML(product.details.size)}</span>
          <span class="cart-item-price">${formatUSD(product.priceCents)}</span>
          <div class="cart-item-actions">
            <div class="qty-selector-sm">
              <button class="qty-btn" aria-label="Decrease quantity" data-action="qty-minus" data-id="${product.id}">−</button>
              <span class="qty-input">${item.quantity}</span>
              <button class="qty-btn" aria-label="Increase quantity" data-action="qty-plus" data-id="${product.id}">+</button>
            </div>
            <button class="cart-item-remove" data-action="remove" data-id="${product.id}">Remove</button>
          </div>
        </div>
      </div>
    `;
  });

  root.innerHTML = `
    <div class="cart-overlay ${AppState.cartOpen ? 'active' : ''}" id="cart-overlay">
      <div class="cart-drawer" id="cart-drawer" role="dialog" aria-label="Luxury Shopping Bag" aria-modal="true">
        <div class="cart-header">
          <div class="cart-title-wrap">
            <h3 class="cart-title">Your Bag</h3>
            <span class="cart-badge">${cart.getItemCount()} ${cart.getItemCount() === 1 ? 'Item' : 'Items'}</span>
          </div>
          <button class="cart-close-btn" id="cart-close-btn" aria-label="Close bag">×</button>
        </div>

        <div class="free-shipping-bar">
          <div class="free-shipping-text">
            ${subtotalCents >= freeShippingThresholdCents 
              ? `<strong>Complimentary US Ground Shipping</strong> Unlocked` 
              : `Add <strong>${formatUSD(freeShippingThresholdCents - subtotalCents)}</strong> more for complimentary shipping`}
          </div>
          <div class="shipping-progress-track">
            <div class="shipping-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <div class="cart-items-list">
          ${isEmpty ? `
            <div class="cart-empty">
              <div class="cart-empty-icon">✦</div>
              <h4 class="cart-empty-title">Your Bag is Empty</h4>
              <p class="cart-empty-desc">Discover our four master formulations designed for radiant, timeless skin.</p>
              <button class="btn-primary" data-action="shop-now" style="width:100%;max-width:260px;">Explore Collection</button>
            </div>
          ` : itemsHTML}
        </div>

        ${!isEmpty ? `
          <div class="cart-footer">
            <!-- Promo Code Input -->
            ${!cart.appliedPromo ? `
              <div class="promo-box">
                <input type="text" class="promo-input" id="cart-promo-input" placeholder="Promo code (e.g. AUREVIA10)">
                <button type="button" class="promo-btn" id="cart-promo-apply">Apply</button>
              </div>
            ` : `
              <div class="promo-applied-tag">
                <span>✦ ${escapeHTML(cart.appliedPromo.label)}</span>
                <button type="button" id="cart-promo-remove" style="background:none;border:none;color:inherit;cursor:pointer;font-size:0.75rem;">✕ Remove</button>
              </div>
            `}

            <div class="cart-summary-row" style="margin-top: 1rem;">
              <span>Subtotal</span>
              <span>${formatUSD(subtotalCents)}</span>
            </div>

            ${discountCents > 0 ? `
              <div class="cart-summary-row" style="color: #a4cca8;">
                <span>Privilege Discount</span>
                <span>-${formatUSD(discountCents)}</span>
              </div>
            ` : ''}

            <div class="cart-summary-row">
              <span>Standard US Ground</span>
              <span>${shippingCents === 0 ? 'Complimentary' : formatUSD(shippingCents)}</span>
            </div>

            <div class="cart-summary-row">
              <span>Est. US Sales Tax (${cart.selectedState} ${(cart.getTaxRate() * 100).toFixed(2)}%)</span>
              <span>${formatUSD(taxCents)}</span>
            </div>

            <div class="cart-summary-row total">
              <span>Estimated Total (USD)</span>
              <span class="price">${formatUSD(totalCents)}</span>
            </div>

            <button class="btn-checkout" id="cart-checkout-btn">Proceed to US Checkout</button>
            <button class="cart-item-remove" data-action="clear-all" style="width:100%;text-align:center;margin-top:10px;">Clear Bag</button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Overlay dismissal
  const overlay = document.getElementById('cart-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeCart();
  });

  document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    closeCart();
    navigateTo('/checkout');
  });

  // Promo Code Handlers
  document.getElementById('cart-promo-apply')?.addEventListener('click', () => {
    const input = document.getElementById('cart-promo-input');
    if (input && input.value) {
      cart.applyPromoCode(input.value);
    }
  });

  document.getElementById('cart-promo-remove')?.addEventListener('click', () => {
    cart.removePromoCode();
  });

  // Action delegations
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === 'qty-minus' && id) {
      const item = cart.findItem(id);
      if (item) cart.updateQuantity(id, item.quantity - 1);
    } else if (action === 'qty-plus' && id) {
      const item = cart.findItem(id);
      if (item) cart.updateQuantity(id, item.quantity + 1);
    } else if (action === 'remove' && id) {
      cart.removeItem(id);
    } else if (action === 'clear-all') {
      cart.clear();
    } else if (action === 'shop-now') {
      closeCart();
      if (AppState.currentView !== 'home') navigateTo('/');
      else scrollToSection('collection');
    }
  });
}

function toggleCart() {
  if (AppState.cartOpen) closeCart();
  else openCart();
}

function openCart() {
  AppState.cartOpen = true;
  renderCartDrawer();
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  AppState.cartOpen = false;
  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   11. SEARCH OVERLAY & DISCOVERY
   ========================================================================== */

function renderSearchOverlay() {
  const root = document.getElementById('search-overlay-root');
  if (!root) return;

  root.innerHTML = `
    <div class="search-overlay ${AppState.searchOpen ? 'active' : ''}" id="search-overlay" role="dialog" aria-label="Search Formulations" aria-modal="true">
      <div class="search-header">
        <button class="search-close-btn" id="search-close-btn" aria-label="Close search">×</button>
      </div>
      <div class="search-input-wrapper">
        <input type="search" class="search-input" id="search-input" placeholder="Search formulations, ingredients, fragrance notes..." aria-label="Search formulations" autocomplete="off">
        <div class="search-input-icon">✦</div>
      </div>
      <div class="search-pills">
        <button class="search-pill ${AppState.activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Formulations</button>
        <button class="search-pill ${AppState.activeFilter === 'serums' ? 'active' : ''}" data-filter="serums">Serums & Extraits</button>
        <button class="search-pill ${AppState.activeFilter === 'moisturizers' ? 'active' : ''}" data-filter="moisturizers">Moisturizers</button>
        <button class="search-pill ${AppState.activeFilter === 'cleansers' ? 'active' : ''}" data-filter="cleansers">Cleansers</button>
        <button class="search-pill ${AppState.activeFilter === 'oils' ? 'active' : ''}" data-filter="oils">Nocturne Oils</button>
      </div>
      <div class="search-results-grid" id="search-results-grid"></div>
    </div>
  `;

  document.getElementById('search-close-btn')?.addEventListener('click', closeSearch);

  const input = document.getElementById('search-input');
  if (input) {
    input.value = AppState.searchQuery;
    input.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      updateSearchResults();
    });
    if (AppState.searchOpen) {
      setTimeout(() => input.focus(), 150);
    }
  }

  root.querySelectorAll('.search-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      root.querySelectorAll('.search-pill').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      AppState.activeFilter = e.currentTarget.dataset.filter;
      updateSearchResults();
    });
  });

  const overlay = document.getElementById('search-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearch();
  });

  updateSearchResults();
}

function updateSearchResults() {
  const container = document.getElementById('search-results-grid');
  if (!container) return;

  let results = [...PRODUCTS];

  if (AppState.activeFilter !== 'all') {
    results = results.filter(p => p.category === AppState.activeFilter);
  }

  if (AppState.searchQuery.trim()) {
    const q = AppState.searchQuery.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      (p.fragranceNotes && Object.values(p.fragranceNotes).some(n => n.toLowerCase().includes(q))) ||
      p.ingredients.some(ing => ing.name.toLowerCase().includes(q) || ing.benefit.toLowerCase().includes(q))
    );
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">No Formulations Found</p>
        <p style="font-size: 0.9rem;">Try searching for "Vitamin C", "Ceramides", "Sandalwood", or select a category pill above.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map(p => `
    <article class="product-card" data-theme="${p.theme}">
      <div class="product-card-media">
        <a href="#/product/${p.id}" onclick="document.getElementById('search-overlay').classList.remove('active'); document.body.style.overflow=''">
          <img class="product-card-img" src="${generateProductSVG(p)}" alt="${escapeHTML(p.name)}" loading="lazy">
        </a>
      </div>
      <div class="product-card-info">
        <span class="product-category">${escapeHTML(p.categoryLabel)}</span>
        <h3 class="product-name">
          <a href="#/product/${p.id}" onclick="document.getElementById('search-overlay').classList.remove('active'); document.body.style.overflow=''">${escapeHTML(p.name)}</a>
        </h3>
        <p class="product-desc">${escapeHTML(p.shortDescription)}</p>
        <div class="product-footer">
          <span class="product-price">${formatUSD(p.priceCents)}</span>
          <button class="btn-quick-add" data-quickadd="${p.id}">+ Add</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('[data-quickadd]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cart.addItem(e.currentTarget.dataset.quickadd);
    });
  });
}

function toggleSearch() {
  if (AppState.searchOpen) closeSearch();
  else openSearch();
}

function openSearch() {
  AppState.searchOpen = true;
  AppState.searchQuery = '';
  renderSearchOverlay();
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  AppState.searchOpen = false;
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   12. CUSTOMER ACCOUNT MODAL (AUTH & ORDERS)
   ========================================================================== */

function renderAccountModal() {
  const root = document.getElementById('account-modal-root');
  if (!root) return;

  const user = getCurrentCustomer();

  root.innerHTML = `
    <div class="account-modal-backdrop ${AppState.accountOpen ? 'active' : ''}" id="account-backdrop">
      <div class="account-modal" role="dialog" aria-modal="true">
        <button class="modal-close-btn" id="account-close-btn" aria-label="Close modal">×</button>

        ${user ? `
          <!-- Authenticated Customer Profile -->
          <div>
            <div style="font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-champagne); margin-bottom: 4px;">
              ✦ Authenticated Client
            </div>
            <h3 class="account-modal-title">${escapeHTML(user.displayName || user.email)}</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">${escapeHTML(user.email)}</p>

            <div style="border-top: 1px solid #222226; padding-top: 1rem; margin-bottom: 1.5rem;">
              <h4 style="font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 0.75rem;">Order History</h4>
              <div id="account-orders-list" style="max-height: 200px; overflow-y: auto; font-size: 0.85rem;">
                <p style="color: var(--text-muted);">Loading orders...</p>
              </div>
            </div>

            <button type="button" class="btn-secondary" id="account-logout-btn" style="width: 100%;">Sign Out</button>
          </div>
        ` : `
          <!-- Sign In / Register Tabs -->
          <div>
            <div class="account-tabs">
              <button class="account-tab-btn ${AppState.accountTab === 'login' ? 'active' : ''}" id="tab-login-btn">Sign In</button>
              <button class="account-tab-btn ${AppState.accountTab === 'register' ? 'active' : ''}" id="tab-register-btn">Create Account</button>
            </div>

            ${AppState.accountTab === 'login' ? `
              <form id="auth-login-form">
                <div class="form-group">
                  <label class="form-label" for="login-email">Email Address</label>
                  <input type="email" id="login-email" class="form-input" required value="guest.client@aurevia.com">
                </div>
                <div class="form-group">
                  <label class="form-label" for="login-pass">Password</label>
                  <input type="password" id="login-pass" class="form-input" required value="LuxuryClient2026!">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">Sign In to Boutique</button>
              </form>
            ` : `
              <form id="auth-register-form">
                <div class="form-group">
                  <label class="form-label" for="reg-name">Full Name</label>
                  <input type="text" id="reg-name" class="form-input" required placeholder="Eleanor Vance">
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-email">Email Address</label>
                  <input type="email" id="reg-email" class="form-input" required placeholder="eleanor@example.com">
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-pass">Create Password</label>
                  <input type="password" id="reg-pass" class="form-input" required minlength="6" placeholder="At least 6 characters">
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">Create Client Account</button>
              </form>
            `}
          </div>
        `}
      </div>
    </div>
  `;

  // Close handlers
  document.getElementById('account-close-btn')?.addEventListener('click', closeAccountModal);
  const backdrop = document.getElementById('account-backdrop');
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeAccountModal();
  });

  // Tab switching
  document.getElementById('tab-login-btn')?.addEventListener('click', () => {
    AppState.accountTab = 'login';
    renderAccountModal();
  });
  document.getElementById('tab-register-btn')?.addEventListener('click', () => {
    AppState.accountTab = 'register';
    renderAccountModal();
  });

  // Login form submit
  document.getElementById('auth-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    try {
      await loginCustomer(email, pass);
      showToast('Signed In', `Welcome back, ${email}`);
      renderAccountModal();
      renderHeader();
    } catch (err) {
      showToast('Sign In Error', err.message);
    }
  });

  // Register form submit
  document.getElementById('auth-register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    try {
      await registerCustomer(email, pass, name);
      showToast('Account Created', `Welcome to Aurevia, ${name}`);
      renderAccountModal();
      renderHeader();
    } catch (err) {
      showToast('Registration Error', err.message);
    }
  });

  // Logout
  document.getElementById('account-logout-btn')?.addEventListener('click', async () => {
    await logoutCustomer();
    showToast('Signed Out', 'You have been signed out.');
    renderAccountModal();
    renderHeader();
  });

  // Load orders if authenticated
  if (user) {
    fetchUserOrders().then(orders => {
      const listEl = document.getElementById('account-orders-list');
      if (!listEl) return;
      if (orders.length === 0) {
        listEl.innerHTML = '<p style="color:var(--text-muted);">No orders found for this account.</p>';
      } else {
        listEl.innerHTML = orders.map(o => `
          <div style="border-bottom: 1px solid #222226; padding: 6px 0;">
            <div style="display:flex; justify-content:space-between;">
              <strong>Order #${o.id}</strong>
              <span style="color:var(--accent-champagne);">${formatUSD(o.totalCents || (o.total * 100))}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(o.createdAt || Date.now()).toLocaleDateString('en-US')} · ${o.status || 'Confirmed'}</div>
          </div>
        `).join('');
      }
    });
  }
}

function toggleAccountModal() {
  if (AppState.accountOpen) closeAccountModal();
  else openAccountModal();
}

function openAccountModal() {
  AppState.accountOpen = true;
  renderAccountModal();
  document.body.style.overflow = 'hidden';
}

function closeAccountModal() {
  AppState.accountOpen = false;
  const el = document.getElementById('account-backdrop');
  if (el) el.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==========================================================================
   13. HOME VIEW (CINEMATIC HERO + STORYTELLING + STOREFRONT)
   ========================================================================== */

function renderHomeView() {
  const main = document.getElementById('main-content');
  if (!main) return;

  main.innerHTML = '';
  main.appendChild(createHeroShowcaseSection());
  main.appendChild(createScrollStorytellingSection());
  main.appendChild(createStorefrontSection());
  main.appendChild(createHeritageSection());

  renderFooter();

  // Initialize Three.js Hero Scene
  setTimeout(() => {
    if (window.SceneManager && window.WEBGL_AVAILABLE) {
      try {
        window.SceneManager.initHeroScene('hero-canvas');
      } catch (err) {
        console.warn('Hero 3D initialisation bypassed:', err);
      }
    }
  }, 250);

  initScrollReveals();
}

/* ==========================================================================
   14. HERO CINEMATIC SHOWCASE
   ========================================================================== */

function createHeroShowcaseSection() {
  const product = PRODUCTS[0]; // Aurevia Radiance Serum / Signature Perfume
  const section = document.createElement('section');
  section.className = 'hero-showcase';
  section.id = 'hero-showcase';

  section.innerHTML = `
    <div class="hero-content">
      <div class="hero-grid">
        <!-- Column 1: Human-Designed Editorial Brand & Commerce -->
        <div class="hero-text-block">
          <div class="hero-eyebrow reveal">
            <span>✦ Handcrafted Extrait de Parfum</span>
          </div>
          <h1 class="hero-title reveal" style="transition-delay: 0.1s;">${escapeHTML(product.name)}</h1>
          <p class="hero-tagline reveal" style="transition-delay: 0.15s;">${escapeHTML(product.tagline)}</p>
          <p class="hero-description reveal" style="transition-delay: 0.2s;">${escapeHTML(product.description)}</p>
          
          <div class="hero-price-wrap reveal" style="transition-delay: 0.25s;">
            <span class="hero-price-label">Price (USD)</span>
            <span class="hero-price">${formatUSD(product.priceCents)}</span>
            <span class="hero-volume">${product.details.size}</span>
          </div>

          <div class="hero-actions reveal" style="transition-delay: 0.3s;">
            <button class="btn-primary" data-hero-add="${product.id}">Add to Bag — ${formatUSD(product.priceCents)}</button>
            <a href="#/product/${product.id}" class="btn-secondary">View Formulation Details</a>
          </div>

          <!-- Olfactory Notes Preview -->
          <div class="hero-specs-panel reveal" style="margin-top: 2rem; max-width: 100%; transition-delay: 0.35s;">
            <div class="spec-item">
              <span class="spec-title">Top Notes</span>
              <span class="spec-value">${escapeHTML(product.fragranceNotes.top)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-title">Heart & Base Notes</span>
              <span class="spec-value">${escapeHTML(product.fragranceNotes.heart)} · ${escapeHTML(product.fragranceNotes.base)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-title">US Domestic Shipping</span>
              <span class="spec-value">Complimentary on orders over $150.00</span>
            </div>
          </div>
        </div>

        <!-- Column 2: Interactive Sketchfab 3D Perfume Model (ChristyMathews) -->
        <div class="hero-sketchfab-showcase reveal" style="transition-delay: 0.2s;">
          <div class="hero-sketchfab-badge">✦ Interactive 3D Perfume</div>
          <iframe 
            title="Perfume" 
            class="hero-sketchfab-frame"
            frameborder="0" 
            allowfullscreen 
            mozallowfullscreen="true" 
            webkitallowfullscreen="true" 
            allow="autoplay; fullscreen; xr-spatial-tracking" 
            src="https://sketchfab.com/models/c66ebff390eb4790a836d2f3d5054874/embed?autostart=1&camera=0&ui_infos=0&ui_controls=1&ui_watermark=0">
          </iframe>
          <div class="hero-model-attribution">
            <span>3D Model: <a href="https://sketchfab.com/3d-models/perfume-c66ebff390eb4790a836d2f3d5054874" target="_blank" rel="noopener">"Perfume"</a> by <a href="https://sketchfab.com/ChristyMathews" target="_blank" rel="noopener">ChristyMathews</a></span>
            <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC-BY 4.0</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Cue -->
    <a href="#scroll-story" class="hero-scroll-indicator reveal" style="transition-delay: 0.5s;" aria-label="Scroll to discover ingredients">
      <span class="hero-scroll-text">Scroll to Discover</span>
      <div class="hero-scroll-mouse">
        <div class="hero-scroll-wheel"></div>
      </div>
    </a>
  `;

  section.querySelector('[data-hero-add]')?.addEventListener('click', () => {
    cart.addItem(product.id);
  });

  return section;
}

/* ==========================================================================
   15. SCROLL STORYTELLING CHAPTERS
   ========================================================================== */

function createScrollStorytellingSection() {
  const product = PRODUCTS[0];
  const container = document.createElement('div');
  container.className = 'scroll-story';
  container.id = 'scroll-story';

  // Chapter 1: The Craftsmanship & Formulation
  container.innerHTML += `
    <section class="scroll-stage stage-botanicals" data-stage="1">
      <div class="stage-container">
        <div class="stage-split">
          <div class="stage-text reveal">
            <span class="stage-eyebrow">Chapter I — Alchemy</span>
            <h2 class="stage-title">Born of High-Purity Borosilicate & Gold</h2>
            <p class="stage-description">
              Every vessel is engineered from optical-grade heavy glass to preserve reactive phytocompounds against ultraviolet degradation. The weighted champagne dropper deposits exactly three micro-droplets for uniform application.
            </p>
            <div style="display:flex;gap:1.5rem;margin-top:1.5rem;">
              <div>
                <strong style="color:var(--accent-champagne);font-size:1.4rem;font-family:var(--font-display);">100%</strong>
                <p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;">Recyclable Glass</p>
              </div>
              <div>
                <strong style="color:var(--accent-champagne);font-size:1.4rem;font-family:var(--font-display);">24K</strong>
                <p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;">Colloidal Sheen</p>
              </div>
              <div>
                <strong style="color:var(--accent-champagne);font-size:1.4rem;font-family:var(--font-display);">0%</strong>
                <p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;">Synthetic Dyes</p>
              </div>
            </div>
          </div>
          <div class="stage-visual reveal" style="transition-delay:0.2s;">
            <div style="text-align:center;">
              <img src="${generateProductSVG(product)}" alt="${escapeHTML(product.name)}" style="max-height:420px;filter:drop-shadow(0 16px 32px rgba(0,0,0,0.7));">
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Chapter 2: Key Active Ingredients Grid
  const ingredientCards = product.ingredients.map((ing, i) => `
    <div class="ingredient-card reveal" style="transition-delay: ${0.1 + i * 0.1}s;">
      <div class="ingredient-icon">✦</div>
      <span class="ingredient-origin">${escapeHTML(ing.origin)}</span>
      <h3 class="ingredient-name">${escapeHTML(ing.name)}</h3>
      <p class="ingredient-desc"><strong>${escapeHTML(ing.benefit)}</strong></p>
      <p class="ingredient-desc" style="color:var(--text-muted);font-size:0.8rem;margin-top:4px;">${escapeHTML(ing.detail)}</p>
    </div>
  `).join('');

  container.innerHTML += `
    <section class="scroll-stage stage-science" data-stage="2">
      <div class="stage-container">
        <div style="text-align:center;max-width:700px;margin:0 auto 3rem;" class="reveal">
          <span class="stage-eyebrow">Chapter II — Molecular Architecture</span>
          <h2 class="stage-title">Botanical Precision Meets Olfactory Synergy</h2>
          <p class="stage-description">
            Four targeted actives working synchronously to replenish moisture, brighten uneven tone, and defend skin against environmental stress.
          </p>
        </div>
        <div class="ingredient-cards-grid">
          ${ingredientCards}
        </div>
      </div>
    </section>
  `;

  // Chapter 3: Ritual & Benefits
  container.innerHTML += `
    <section class="scroll-stage stage-results" data-stage="3">
      <div class="stage-container">
        <div style="text-align:center;max-width:650px;margin:0 auto 2.5rem;" class="reveal">
          <span class="stage-eyebrow">Chapter III — Daily Ritual</span>
          <h2 class="stage-title">Sensory Indulgence with Visible Results</h2>
        </div>
        <div class="benefits-grid">
          <div class="benefit-card reveal" style="transition-delay:0.1s;">
            <div class="benefit-num">01</div>
            <h3 class="benefit-title">Awaken & Tone</h3>
            <p class="benefit-desc">Dispense onto warm fingertips after cleansing to initiate immediate cellular micro-circulation.</p>
          </div>
          <div class="benefit-card reveal" style="transition-delay:0.2s;">
            <div class="benefit-num">02</div>
            <h3 class="benefit-title">Instant Radiance</h3>
            <p class="benefit-desc">Subtle micro-particulates reflect natural ambient light for an immediate healthy dewy veil.</p>
          </div>
          <div class="benefit-card reveal" style="transition-delay:0.3s;">
            <div class="benefit-num">03</div>
            <h3 class="benefit-title">Sustained Defense</h3>
            <p class="benefit-desc">Liposomal vitamin C releases throughout 18 hours to shield skin from daily oxidative free radicals.</p>
          </div>
        </div>
      </div>
    </section>
  `;

  return container;
}

/* ==========================================================================
   16. STOREFRONT COLLECTION GRID
   ========================================================================== */

function createStorefrontSection() {
  const section = document.createElement('section');
  section.className = 'collection-section';
  section.id = 'collection-section';

  section.innerHTML = `
    <div class="collection-header reveal">
      <span class="section-eyebrow">✦ The Complete Atelier Suite</span>
      <h2 class="section-title">The Aurevia Fragrance & Skincare Suite</h2>
      <p class="section-desc">Four artisanal formulations designed to complete your restorative morning and evening ritual.</p>
    </div>

    <div class="collection-controls reveal" style="transition-delay:0.1s;">
      <div class="collection-filters">
        <button class="filter-btn active" data-grid-filter="all">All Formulations</button>
        <button class="filter-btn" data-grid-filter="serums">Serums & Extraits</button>
        <button class="filter-btn" data-grid-filter="moisturizers">Moisturizers</button>
        <button class="filter-btn" data-grid-filter="cleansers">Cleansers</button>
        <button class="filter-btn" data-grid-filter="oils">Nocturne Oils</button>
      </div>
      <div class="collection-sorting">
        <select class="sort-select" id="collection-sort-select" aria-label="Sort product catalog">
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High (USD)</option>
          <option value="price-desc">Price: High to Low (USD)</option>
          <option value="name">Alphabetical (A–Z)</option>
        </select>
      </div>
    </div>

    <div class="products-grid" id="main-products-grid"></div>
  `;

  setTimeout(() => {
    renderStorefrontGrid();

    section.querySelectorAll('[data-grid-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        section.querySelectorAll('[data-grid-filter]').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        AppState.activeFilter = e.currentTarget.dataset.gridFilter;
        renderStorefrontGrid();
      });
    });

    const sort = document.getElementById('collection-sort-select');
    sort?.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      renderStorefrontGrid();
    });
  }, 50);

  return section;
}

function renderStorefrontGrid() {
  const grid = document.getElementById('main-products-grid');
  if (!grid) return;

  let list = [...PRODUCTS];

  if (AppState.activeFilter !== 'all') {
    list = list.filter(p => p.category === AppState.activeFilter);
  }

  if (AppState.sortBy === 'price-asc') {
    list.sort((a, b) => a.priceCents - b.priceCents);
  } else if (AppState.sortBy === 'price-desc') {
    list.sort((a, b) => b.priceCents - a.priceCents);
  } else if (AppState.sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  const wishlist = getWishlist();

  grid.innerHTML = list.map((p, index) => `
    <article class="product-card reveal" data-theme="${p.theme}" data-product-id="${p.id}" style="transition-delay:${index * 0.1}s;">
      <div class="product-card-media">
        <!-- Wishlist Toggle -->
        <button class="product-wishlist-btn ${wishlist.includes(p.id) ? 'active' : ''}" data-wishlist-toggle="${p.id}" aria-label="Save to Wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${wishlist.includes(p.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>

        <a href="#/product/${p.id}" aria-label="Inspect ${escapeHTML(p.name)} in 3D">
          <img class="product-card-img" src="${generateProductSVG(p)}" alt="${escapeHTML(p.name)}" loading="lazy">
        </a>
        <div class="product-card-actions">
          <button class="btn-quick-add" data-store-add="${p.id}">
            <span class="btn-quick-add-full">+ Quick Add to Bag</span>
            <span class="btn-quick-add-short">+ Quick Add</span>
          </button>
        </div>
      </div>
      <div class="product-card-info">
        <div class="product-category">${escapeHTML(p.categoryLabel)}</div>
        <h3 class="product-name">
          <a href="#/product/${p.id}">${escapeHTML(p.name)}</a>
        </h3>
        <p class="product-desc">${escapeHTML(p.shortDescription)}</p>
        <div class="product-footer">
          <span class="product-price">${formatUSD(p.priceCents)}</span>
          <div class="product-rating">
            ${renderStars(p.rating)}
            <span class="product-rating-count">(${p.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  // Quick Add Event
  grid.querySelectorAll('[data-store-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cart.addItem(e.currentTarget.dataset.storeAdd);
    });
  });

  // Wishlist Event
  grid.querySelectorAll('[data-wishlist-toggle]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = e.currentTarget.dataset.wishlistToggle;
      toggleWishlistItem(pid);
      renderStorefrontGrid();
      renderHeader();
      showToast('Wishlist Updated', 'Updated your saved favorites.');
    });
  });

  initScrollReveals();
}

/* ==========================================================================
   17. HERITAGE & ATELIER
   ========================================================================== */

function createHeritageSection() {
  const section = document.createElement('section');
  section.className = 'about-section';
  section.id = 'about-section';

  section.innerHTML = `
    <div class="stage-container">
      <div class="stage-split">
        <div class="about-content reveal">
          <span class="stage-eyebrow">✦ Maison Aurevia</span>
          <h2 class="stage-title">Engineered for Modern Longevity</h2>
          <p class="stage-description">
            Aurevia was founded with a singular conviction: luxury skincare and fine fragrance should be tactile masterpieces respecting skin biology. Formulated at clinical potency without fillers, artificial parabens, or synthetic dyes.
          </p>
          <p class="stage-description">
            Our sculptural bottles are designed to be heirloom objects on your vanity, celebrated through authentic 3D WebGL presentations and interactive Sketchfab models.
          </p>
          <div style="margin-top:2rem;">
            <a href="#/product/radiance-serum" class="btn-secondary">Explore Radiance Serum</a>
          </div>
        </div>
        <div class="about-badge-card reveal" style="padding:3rem;border-radius:var(--radius-xl);text-align:center;background:#141416;border:1px solid #26262a;">
          <div style="font-family:var(--font-display);font-size:2.4rem;color:var(--accent-champagne);margin-bottom:1rem;">✦ AUREVIA ✦</div>
          <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7;">
            "We do not create mere cosmetics; we curate quiet moments of daily sensory renewal."
          </p>
          <div style="margin-top:2rem;border-top:1px solid #222226;padding-top:1.5rem;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent-bronze);">
            New York · Paris · Tokyo
          </div>
        </div>
      </div>
    </div>
  `;

  return section;
}

/* ==========================================================================
   18. FOOTER
   ========================================================================== */

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="logo">AUREVIA</span>
          <p class="footer-desc">
            Artisanal fine fragrance and restorative skincare presented through clean architectural design and 3D WebGL showcases.
          </p>
          <div class="footer-demo-disclaimer">
            <span>✦ United States Domestic Storefront</span>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Formulations</h4>
          <div class="footer-nav-list">
            <a href="#/product/radiance-serum" class="footer-nav-link">Radiance Serum Extrait</a>
            <a href="#/product/hydration-cream" class="footer-nav-link">Hydration Cream</a>
            <a href="#/product/botanical-cleanser" class="footer-nav-link">Botanical Cleanser</a>
            <a href="#/product/renewal-oil" class="footer-nav-link">Renewal Nocturne Oil</a>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Architecture</h4>
          <div class="footer-nav-list">
            <a href="#/" class="footer-nav-link" onclick="event.preventDefault(); scrollToSection('shop');">Boutique Catalog</a>
            <a href="#/" class="footer-nav-link" onclick="event.preventDefault(); scrollToSection('about');">Maison Heritage</a>
            <a href="#/checkout" class="footer-nav-link">US Checkout</a>
            <a href="#/admin" class="footer-nav-link">Atelier Dashboard</a>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Privilege Newsletter</h4>
          <p class="footer-desc" style="font-size:0.8rem;">Subscribe for private formulations and exclusive seasonal releases.</p>
          <form onsubmit="event.preventDefault(); showToast('Subscribed to Newsletter', 'Welcome to Aurevia Maison.'); this.reset();" style="position:relative;margin-top:10px;">
            <input type="email" placeholder="Enter your email" required style="width:100%;height:44px;padding:0 48px 0 16px;border-radius:var(--radius-pill);background:#141416;border:1px solid #26262a;color:var(--text-primary);font-size:0.85rem;">
            <button type="submit" aria-label="Subscribe" style="position:absolute;right:4px;top:4px;bottom:4px;width:36px;border-radius:50%;background:var(--accent-champagne);color:#0a0a0a;border:none;cursor:pointer;font-weight:bold;">→</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} AUREVIA Maison. United States Storefront. Currency: USD ($).</p>
        <div class="footer-legal-links">
          <span>Three.js WebGL Engine</span>
          <span>Sketchfab 3D Perfume Model</span>
          <span>Cloud Firestore Ready</span>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   19. PRODUCT DETAIL VIEW (SKETCHFAB 3D MODEL + THREE.JS + ACCORDIONS)
   ========================================================================== */

function renderProductDetailView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  const main = document.getElementById('main-content');
  if (!main || !product) {
    navigateTo('/');
    return;
  }

  // Dispose hero scene to conserve WebGL context
  if (window.SceneManager) {
    try { window.SceneManager.disposeScenes(); } catch (e) {}
  }

  const related = PRODUCTS.filter(p => p.id !== product.id);
  const wishlist = getWishlist();
  const hasSketchfab = !!product.sketchfabModel;

  // Default to sketchfab viewer if model exists, otherwise three.js
  AppState.activeDetailMediaMode = hasSketchfab ? 'sketchfab' : 'three';

  main.innerHTML = `
    <section class="product-detail-view" style="padding-top: calc(var(--header-height) + var(--banner-height) + 2rem); padding-bottom: 5rem;">
      <div class="stage-container" style="padding: 0 var(--space-xl);">
        <div style="margin-bottom: 2rem; display:flex; justify-content:space-between; align-items:center;">
          <a href="#/" class="checkout-back-btn">← Return to Boutique</a>
          <button class="product-wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" id="detail-wishlist-btn" aria-label="Save to Wishlist" style="position:static;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlist.includes(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>

        <div class="product-detail-layout" style="border: 1px solid #26262a; border-radius: var(--radius-xl); overflow: hidden; background: #0c0c0e;">
          <!-- Left Visual & 3D Interactive Stage -->
          <div class="product-detail-media" style="position:relative; min-height: 560px; display:flex; align-items:center; justify-content:center; background: radial-gradient(circle at 50% 50%, #171513, #09090b);">
            
            <!-- Media Mode Switcher -->
            <div class="media-mode-switcher">
              ${hasSketchfab ? `
                <button class="media-mode-btn ${AppState.activeDetailMediaMode === 'sketchfab' ? 'active' : ''}" data-media-mode="sketchfab">3D Perfume Model</button>
              ` : ''}
              <button class="media-mode-btn ${AppState.activeDetailMediaMode === 'three' ? 'active' : ''}" data-media-mode="three">Studio WebGL</button>
              <button class="media-mode-btn ${AppState.activeDetailMediaMode === 'image' ? 'active' : ''}" data-media-mode="image">Gallery</button>
            </div>

            <!-- 1. Official Sketchfab 3D Perfume Model (CC-BY 4.0 ChristyMathews) -->
            ${hasSketchfab ? `
              <div id="sketchfab-wrap" class="sketchfab-viewer-wrap" style="${AppState.activeDetailMediaMode === 'sketchfab' ? 'display:flex;' : 'display:none;'}">
                <iframe class="sketchfab-frame" title="${product.sketchfabModel.title}" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" src="${product.sketchfabModel.embedUrl}"></iframe>
                <div class="sketchfab-attribution">
                  <span>3D Model: <a href="${product.sketchfabModel.modelUrl}" target="_blank" rel="noopener">"${product.sketchfabModel.title}"</a> by <a href="${product.sketchfabModel.creatorUrl}" target="_blank" rel="noopener">${product.sketchfabModel.creator}</a></span>
                  <a href="${product.sketchfabModel.licenseUrl}" target="_blank" rel="noopener">${product.sketchfabModel.license}</a>
                </div>
              </div>
            ` : ''}

            <!-- 2. Three.js Procedural 3D Canvas -->
            <div id="detail-canvas" style="position:absolute; inset:0; width:100%; height:100%; cursor:grab; ${AppState.activeDetailMediaMode === 'three' ? 'display:block;' : 'display:none;'}"></div>

            <!-- 3. High-Resolution SVG Fallback / Image Gallery -->
            <div id="detail-fallback" style="pointer-events:none; z-index:1; ${AppState.activeDetailMediaMode === 'image' ? 'display:block;' : 'display:none;'}">
              <img src="${generateProductSVG(product)}" alt="${escapeHTML(product.name)}" style="max-height:460px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.7));">
            </div>

            <div class="hero-scroll-indicator" style="bottom: 1.5rem; pointer-events:none; ${AppState.activeDetailMediaMode === 'three' ? 'display:flex;' : 'display:none;'}" id="drag-hint">
              <span class="hero-scroll-text" style="font-size:0.65rem;">✦ Drag to Rotate Studio Rig ✦</span>
            </div>
          </div>

          <!-- Right Product Information & Commerce Controls -->
          <div class="product-detail-info" style="padding: var(--space-3xl);">
            <div class="product-category" style="margin-bottom:0.5rem;">${escapeHTML(product.categoryLabel)}</div>
            <h1 class="product-name" style="font-size: clamp(2rem, 3.5vw, 2.8rem); line-height: 1.1; margin-bottom: 0.5rem;">${escapeHTML(product.name)}</h1>
            <p class="hero-tagline" style="font-size: 1.1rem; margin-bottom: 1rem;">${escapeHTML(product.tagline)}</p>

            <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1.5rem;">
              <span class="product-price" style="font-size: 2rem;">${formatUSD(product.priceCents)}</span>
              <div class="product-rating">
                ${renderStars(product.rating)}
                <span class="product-rating-count">(${product.reviewCount} Reviews)</span>
              </div>
              <span style="font-size:0.8rem; color:#709a74; margin-left:auto;">● In Stock (${product.stock} available)</span>
            </div>

            <p class="product-desc" style="font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem;">${escapeHTML(product.description)}</p>

            <!-- Fragrance Notes Preview -->
            ${product.fragranceNotes ? `
              <div style="background:#141416; border:1px solid #26262a; border-radius:var(--radius-md); padding:1rem; margin-bottom:2rem; font-size:0.85rem;">
                <div style="color:var(--accent-champagne); font-weight:500; margin-bottom:4px; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase;">✦ Olfactory Hierarchy</div>
                <div style="color:var(--text-secondary); margin-bottom:2px;"><strong style="color:var(--text-primary);">Top:</strong> ${escapeHTML(product.fragranceNotes.top)}</div>
                <div style="color:var(--text-secondary); margin-bottom:2px;"><strong style="color:var(--text-primary);">Heart:</strong> ${escapeHTML(product.fragranceNotes.heart)}</div>
                <div style="color:var(--text-secondary);"><strong style="color:var(--text-primary);">Base:</strong> ${escapeHTML(product.fragranceNotes.base)}</div>
              </div>
            ` : ''}

            <!-- Commerce Controls -->
            <div style="display:flex; gap: 1rem; align-items:center; margin-bottom: 2.5rem; flex-wrap: wrap;">
              <div class="qty-selector" style="display:flex; align-items:center; border:1px solid #26262a; border-radius:var(--radius-pill); background:#141416; height:54px;">
                <button class="qty-btn" id="detail-qty-minus" aria-label="Decrease quantity" style="width:44px;font-size:1.2rem;background:none;border:none;color:var(--text-primary);cursor:pointer;">−</button>
                <span class="qty-input" id="detail-qty-val" style="width:36px;text-align:center;font-weight:600;">1</span>
                <button class="qty-btn" id="detail-qty-plus" aria-label="Increase quantity" style="width:44px;font-size:1.2rem;background:none;border:none;color:var(--text-primary);cursor:pointer;">+</button>
              </div>

              <button class="btn-add-to-cart" id="detail-add-btn">
                <span>Add to Bag — ${formatUSD(product.priceCents)}</span>
              </button>
            </div>

            <!-- Accordion Details -->
            <div class="product-accordion">
              <div class="accordion-item active">
                <button class="accordion-header" type="button">
                  <span>Product Specifications</span>
                  <span class="accordion-icon">↓</span>
                </button>
                <div class="accordion-content">
                  <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; padding-top: 0.5rem;">
                    <div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Volume:</span> <div>${product.details.size}</div></div>
                    <div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Skin Type:</span> <div>${product.details.skinType}</div></div>
                    <div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Texture:</span> <div>${product.details.texture}</div></div>
                    <div><span style="color:var(--text-muted);font-size:0.75rem;text-transform:uppercase;">Shelf Life:</span> <div>${product.details.shelfLife}</div></div>
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <button class="accordion-header" type="button">
                  <span>Ritual Instructions</span>
                  <span class="accordion-icon">↓</span>
                </button>
                <div class="accordion-content">
                  <p style="padding-top: 0.5rem;">${product.details.usage}</p>
                </div>
              </div>

              <div class="accordion-item">
                <button class="accordion-header" type="button">
                  <span>Active Ingredient Profile</span>
                  <span class="accordion-icon">↓</span>
                </button>
                <div class="accordion-content">
                  <div style="padding-top: 0.5rem;">
                    ${product.ingredients.map(ing => `
                      <div style="margin-bottom:0.75rem;">
                        <strong style="color:var(--accent-champagne);">${escapeHTML(ing.name)}</strong> (${escapeHTML(ing.origin)}):
                        <div style="color:var(--text-secondary);font-size:0.85rem;">${escapeHTML(ing.benefit)} — ${escapeHTML(ing.detail)}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div class="accordion-item">
                <button class="accordion-header" type="button">
                  <span>US Domestic Shipping & Returns</span>
                  <span class="accordion-icon">↓</span>
                </button>
                <div class="accordion-content">
                  <p style="padding-top: 0.5rem;">
                    Complimentary standard ground delivery on all US domestic orders of $150.00 and above (3–5 business days). Express 2-Day Air is available at checkout for $14.99. 30-day return policy for unopened items.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Formulations -->
        <div style="margin-top: 5rem;">
          <h3 style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:var(--tracking-headings);margin-bottom:2rem;text-align:center;">Complete the Restorative Suite</h3>
          <div class="products-grid">
            ${related.map(p => `
              <article class="product-card" data-theme="${p.theme}">
                <div class="product-card-media">
                  <a href="#/product/${p.id}">
                    <img class="product-card-img" src="${generateProductSVG(p)}" alt="${escapeHTML(p.name)}" loading="lazy">
                  </a>
                </div>
                <div class="product-card-info">
                  <div class="product-category">${escapeHTML(p.categoryLabel)}</div>
                  <h3 class="product-name">
                    <a href="#/product/${p.id}">${escapeHTML(p.name)}</a>
                  </h3>
                  <div class="product-footer">
                    <span class="product-price">${formatUSD(p.priceCents)}</span>
                    <button class="btn-quick-add" data-store-add="${p.id}">+ Add</button>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;

  renderFooter();

  // Media Switcher logic
  main.querySelectorAll('[data-media-mode]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.currentTarget.dataset.mediaMode;
      AppState.activeDetailMediaMode = mode;
      main.querySelectorAll('[data-media-mode]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const skWrap = document.getElementById('sketchfab-wrap');
      const thWrap = document.getElementById('detail-canvas');
      const imWrap = document.getElementById('detail-fallback');
      const hint = document.getElementById('drag-hint');

      if (skWrap) skWrap.style.display = mode === 'sketchfab' ? 'flex' : 'none';
      if (thWrap) thWrap.style.display = mode === 'three' ? 'block' : 'none';
      if (imWrap) imWrap.style.display = mode === 'image' ? 'block' : 'none';
      if (hint) hint.style.display = mode === 'three' ? 'flex' : 'none';
    });
  });

  // Quantity controls
  let qty = 1;
  const maxStock = product.stock || 10;
  const qtyVal = document.getElementById('detail-qty-val');
  const addBtn = document.getElementById('detail-add-btn');

  document.getElementById('detail-qty-minus')?.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      if (qtyVal) qtyVal.textContent = qty;
      if (addBtn) addBtn.innerHTML = `<span>Add to Bag — ${formatUSD(product.priceCents * qty)}</span>`;
    }
  });

  document.getElementById('detail-qty-plus')?.addEventListener('click', () => {
    if (qty < maxStock) {
      qty++;
      if (qtyVal) qtyVal.textContent = qty;
      if (addBtn) addBtn.innerHTML = `<span>Add to Bag — ${formatUSD(product.priceCents * qty)}</span>`;
    } else {
      showToast('Maximum Stock Limit', `Only ${maxStock} units currently available.`);
    }
  });

  addBtn?.addEventListener('click', () => {
    cart.addItem(product.id, qty);
  });

  // Wishlist button
  document.getElementById('detail-wishlist-btn')?.addEventListener('click', () => {
    toggleWishlistItem(product.id);
    renderProductDetailView(product.id);
    renderHeader();
    showToast('Wishlist', 'Updated your saved favorites.');
  });

  // Accordion Toggles
  main.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', (e) => {
      const item = e.currentTarget.closest('.accordion-item');
      item?.classList.toggle('active');
    });
  });

  // Related quick adds
  main.querySelectorAll('[data-store-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cart.addItem(e.currentTarget.dataset.storeAdd);
    });
  });

  // Launch Three.js 3D Inspector
  setTimeout(() => {
    if (window.SceneManager && window.WEBGL_AVAILABLE) {
      try {
        const idMap = {
          'radiance-serum': 'serum',
          'hydration-cream': 'cream',
          'botanical-cleanser': 'cleanser',
          'renewal-oil': 'oil'
        };
        const modelKey = idMap[product.id] || 'serum';
        window.SceneManager.initDetailScene(modelKey, 'detail-canvas');
      } catch (e) {
        console.warn('Detail scene init error:', e);
      }
    }
  }, 250);
}

/* ==========================================================================
   20. DEMO CHECKOUT VIEW (US LOCALIZATION, 50-STATE TAXES, FIREBASE ORDER)
   ========================================================================== */

function renderCheckoutView() {
  const main = document.getElementById('main-content');
  if (!main) return;

  if (window.SceneManager) {
    try { window.SceneManager.disposeScenes(); } catch (e) {}
  }

  const items = cart.getItems();
  const isEmpty = items.length === 0;
  const subtotalCents = cart.getSubtotalCents();
  const discountCents = cart.getDiscountCents();
  const shippingCents = cart.getShippingCents();
  const taxCents = cart.getTaxCents();
  const totalCents = cart.getTotalCents();
  const user = getCurrentCustomer();

  let summaryItemsHTML = '';
  items.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return;
    summaryItemsHTML += `
      <div class="summary-item">
        <img class="summary-item-img" src="${generateProductSVG(product)}" alt="${escapeHTML(product.name)}" width="50" height="60">
        <div class="summary-item-info">
          <h4 class="summary-item-name">${escapeHTML(product.name)}</h4>
          <span class="summary-item-qty">Qty: ${item.quantity} · ${escapeHTML(product.details.size)}</span>
        </div>
        <span class="summary-item-price">${formatUSD(product.priceCents * item.quantity)}</span>
      </div>
    `;
  });

  main.innerHTML = `
    <section class="checkout-view active" style="display:block; position:relative; z-index:1; padding-top: calc(var(--header-height) + var(--banner-height) + 2rem); padding-bottom: 5rem;">
      <div class="checkout-container">
        <div class="checkout-header">
          <a href="#/" class="checkout-back-btn">← Return to Boutique</a>
          <h1 style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:var(--tracking-headings);">United States Checkout</h1>
        </div>

        <div class="checkout-demo-banner">
          <div style="font-size:1.4rem;">✦</div>
          <div>
            <strong>US Domestic Storefront · Authoritative Database Ready</strong>
            <p style="margin:2px 0 0;font-size:0.8rem;opacity:0.9;">Transactions are recorded in Cloud Firestore. No real credit card is billed in demonstration mode.</p>
          </div>
        </div>

        ${isEmpty ? `
          <div class="cart-empty" style="padding: 5rem 1rem;">
            <div class="cart-empty-icon">✦</div>
            <h3 class="cart-empty-title">Your Bag is Empty</h3>
            <p class="cart-empty-desc">Please select a product from the collection before initiating checkout.</p>
            <a href="#/" class="btn-primary" style="display:inline-flex;margin-top:1rem;">Return to Boutique</a>
          </div>
        ` : `
          <div class="checkout-layout">
            <!-- Form Section -->
            <div class="checkout-form-container">
              <form id="demo-checkout-form">
                <!-- 1. Contact Info -->
                <div class="checkout-form-section">
                  <h3 class="checkout-section-title">1. Customer Contact</h3>
                  <div class="form-group">
                    <label class="form-label" for="checkout-email">Email Address <span class="required-star">*</span></label>
                    <input type="email" id="checkout-email" class="form-input" placeholder="e.g. your.name@example.com" required value="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="checkout-phone">US Mobile Phone <span class="required-star">*</span></label>
                    <input type="tel" id="checkout-phone" class="form-input" placeholder="e.g. (555) 000-0000" required value="">
                  </div>
                </div>

                <!-- 2. US Shipping Destination -->
                <div class="checkout-form-section">
                  <h3 class="checkout-section-title">2. US Domestic Shipping Destination</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="checkout-first">First Name <span class="required-star">*</span></label>
                      <input type="text" id="checkout-first" class="form-input" placeholder="First name" required value="">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="checkout-last">Last Name <span class="required-star">*</span></label>
                      <input type="text" id="checkout-last" class="form-input" placeholder="Last name" required value="">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="checkout-address">Delivery Street Address <span class="required-star">*</span></label>
                    <input type="text" id="checkout-address" class="form-input" placeholder="House number and street name" required value="">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="checkout-apt">Apartment, Suite, Unit <span class="optional-tag">(Optional)</span></label>
                    <input type="text" id="checkout-apt" class="form-input" placeholder="Apt, Suite, Unit, Building (optional)" value="">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="checkout-city">City <span class="required-star">*</span></label>
                      <input type="text" id="checkout-city" class="form-input" placeholder="City" required value="">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="checkout-state">State <span class="required-star">*</span></label>
                      <select id="checkout-state" class="form-select" required>
                        <option value="" disabled ${!cart.selectedState ? 'selected' : ''}>Select State...</option>
                        ${US_STATES.map(s => `
                          <option value="${s.code}" ${s.code === cart.selectedState ? 'selected' : ''}>${s.name} (${(s.tax * 100).toFixed(2)}%)</option>
                        `).join('')}
                      </select>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="checkout-postal">US ZIP Code (5 Digits) <span class="required-star">*</span></label>
                      <input type="text" id="checkout-postal" class="form-input" pattern="^\\d{5}(-\\d{4})?$" title="Enter a valid 5-digit US ZIP Code" placeholder="e.g. 10021" required value="">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="checkout-country">Country <span class="required-star">*</span></label>
                      <input type="text" id="checkout-country" class="form-input" value="United States" readonly style="opacity: 0.8; cursor: not-allowed;">
                    </div>
                  </div>
                </div>

                <!-- 3. Shipping Method -->
                <div class="checkout-form-section">
                  <h3 class="checkout-section-title">3. Delivery Options</h3>
                  <div class="shipping-options-group">
                    <label class="shipping-option-label ${cart.selectedShipping === 'standard' ? 'active' : ''}">
                      <div style="display:flex; align-items:center;">
                        <input type="radio" name="shipping-method" value="standard" class="shipping-option-radio" ${cart.selectedShipping === 'standard' ? 'checked' : ''}>
                        <div>
                          <strong>Standard Ground Delivery</strong>
                          <div style="font-size: 0.8rem; color: var(--text-muted);">3–5 business days</div>
                        </div>
                      </div>
                      <span style="color: var(--accent-champagne);">${subtotalCents >= 15000 ? 'Complimentary' : '$5.99'}</span>
                    </label>

                    <label class="shipping-option-label ${cart.selectedShipping === 'express' ? 'active' : ''}">
                      <div style="display:flex; align-items:center;">
                        <input type="radio" name="shipping-method" value="express" class="shipping-option-radio" ${cart.selectedShipping === 'express' ? 'checked' : ''}>
                        <div>
                          <strong>Express 2-Day Air</strong>
                          <div style="font-size: 0.8rem; color: var(--text-muted);">2 business days guaranteed</div>
                        </div>
                      </div>
                      <span style="color: var(--accent-champagne);">$14.99</span>
                    </label>
                  </div>
                </div>

                <!-- 4. Payment Simulation Token -->
                <div class="checkout-form-section">
                  <h3 class="checkout-section-title">4. Simulated Payment Token</h3>
                  
                  <!-- Luxury Card Mockup -->
                  <div class="demo-card-mockup">
                    <div class="demo-card-chip"></div>
                    <div class="demo-card-number">•••• •••• •••• 8842</div>
                    <div class="demo-card-meta">
                      <span>CARDHOLDER: ELEANOR VANCE</span>
                      <span>EXP: 12/28</span>
                    </div>
                  </div>

                  <p style="font-size:0.8rem;color:var(--accent-champagne-light);line-height:1.5;">
                    ✦ Simulated payment module with Cloud Firestore order recording.
                  </p>

                  <button type="submit" class="btn-place-order" id="btn-submit-order">
                    <span>Confirm Order — ${formatUSD(totalCents)}</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Order Summary Box -->
            <div class="checkout-summary-box">
              <h3 class="checkout-section-title">Order Summary (${cart.getItemCount()} ${cart.getItemCount() === 1 ? 'item' : 'items'})</h3>
              <div class="summary-items-list">${summaryItemsHTML}</div>

              <!-- Promo Code Input -->
              ${!cart.appliedPromo ? `
                <div class="promo-box" style="margin-bottom: 1.5rem;">
                  <input type="text" class="promo-input" id="checkout-promo-input" placeholder="Promo code (e.g. AUREVIA10)">
                  <button type="button" class="promo-btn" id="checkout-promo-apply">Apply</button>
                </div>
              ` : `
                <div class="promo-applied-tag" style="margin-bottom: 1.5rem;">
                  <span>✦ ${escapeHTML(cart.appliedPromo.label)}</span>
                  <button type="button" id="checkout-promo-remove" style="background:none;border:none;color:inherit;cursor:pointer;font-size:0.75rem;">✕ Remove</button>
                </div>
              `}

              <div class="cart-summary-row">
                <span>Merchandise Subtotal</span>
                <span>${formatUSD(subtotalCents)}</span>
              </div>

              ${discountCents > 0 ? `
                <div class="cart-summary-row" style="color: #a4cca8;">
                  <span>Privilege Discount</span>
                  <span>-${formatUSD(discountCents)}</span>
                </div>
              ` : ''}

              <div class="cart-summary-row">
                <span>US Domestic Shipping (${cart.selectedShipping === 'express' ? 'Express 2-Day Air' : 'Standard Ground'})</span>
                <span>${shippingCents === 0 ? 'Complimentary' : formatUSD(shippingCents)}</span>
              </div>

              <div class="cart-summary-row">
                <span>Estimated US Sales Tax (${cart.selectedState} ${(cart.getTaxRate() * 100).toFixed(2)}%)</span>
                <span>${formatUSD(taxCents)}</span>
              </div>

              <div class="cart-summary-row total">
                <span>Estimated Total (USD)</span>
                <span class="price">${formatUSD(totalCents)}</span>
              </div>

              <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 1rem; line-height: 1.5;">
                *Sales tax is estimated based on the destination state (${cart.selectedState}). Final tax calculations conform to US domestic tax regulations.
              </p>
            </div>
          </div>
        `}
      </div>
    </section>
  `;

  renderFooter();

  // State Change Event for Real-Time Tax Recalculation
  document.getElementById('checkout-state')?.addEventListener('change', (e) => {
    cart.setState(e.target.value);
    renderCheckoutView();
  });

  // Shipping Method Change Event
  main.querySelectorAll('input[name="shipping-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      cart.setShippingMethod(e.target.value);
      renderCheckoutView();
    });
  });

  // Promo Code Handlers
  document.getElementById('checkout-promo-apply')?.addEventListener('click', () => {
    const input = document.getElementById('checkout-promo-input');
    if (input && input.value) {
      if (cart.applyPromoCode(input.value)) {
        renderCheckoutView();
      }
    }
  });

  document.getElementById('checkout-promo-remove')?.addEventListener('click', () => {
    cart.removePromoCode();
    renderCheckoutView();
  });

  // Form Submit Event (Order Execution)
  document.getElementById('demo-checkout-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleCheckoutSubmission();
  });
}

async function handleCheckoutSubmission() {
  const container = document.querySelector('.checkout-container');
  if (!container) return;

  const email = document.getElementById('checkout-email')?.value || 'customer@example.com';
  const firstName = document.getElementById('checkout-first')?.value || 'Client';
  const lastName = document.getElementById('checkout-last')?.value || '';
  const address = document.getElementById('checkout-address')?.value || '';
  const apt = document.getElementById('checkout-apt')?.value || '';
  const city = document.getElementById('checkout-city')?.value || '';
  const state = document.getElementById('checkout-state')?.value || cart.selectedState;
  const zip = document.getElementById('checkout-postal')?.value || '';
  const phone = document.getElementById('checkout-phone')?.value || '';

  const orderData = {
    customerEmail: email,
    shippingAddress: {
      firstName,
      lastName,
      address,
      apt,
      city,
      state,
      zip,
      phone,
      country: 'United States'
    },
    items: cart.getItems().map(item => {
      const p = PRODUCTS.find(prod => prod.id === item.productId);
      return {
        productId: item.productId,
        productName: p ? p.name : item.productId,
        quantity: item.quantity,
        unitPriceCents: p ? p.priceCents : 0,
        totalCents: (p ? p.priceCents : 0) * item.quantity
      };
    }),
    subtotalCents: cart.getSubtotalCents(),
    discountCents: cart.getDiscountCents(),
    shippingCents: cart.getShippingCents(),
    shippingMethod: cart.selectedShipping,
    taxCents: cart.getTaxCents(),
    taxState: state,
    totalCents: cart.getTotalCents(),
    currency: 'USD'
  };

  const savedOrder = await saveOrder(orderData);
  cart.clear();

  container.innerHTML = `
    <div style="text-align:center; padding: 4.5rem 1.5rem; max-width: 600px; margin: 0 auto; background: #141416; border: 1px solid var(--accent-champagne); border-radius: var(--radius-xl);">
      <div style="font-size:3rem; color:var(--accent-champagne); margin-bottom:1rem;">✦</div>
      <h2 style="font-family:var(--font-display); font-size:2.4rem; letter-spacing:var(--tracking-headings); margin-bottom:0.5rem;">Order Confirmed</h2>
      <p style="color:var(--accent-champagne); letter-spacing:0.2em; text-transform:uppercase; font-size:0.85rem; margin-bottom:1.5rem;">Receipt #${savedOrder.id}</p>
      
      <p style="color:var(--text-secondary); line-height:1.7; margin-bottom:1.5rem;">
        Thank you for your order, ${escapeHTML(firstName)}. A confirmation dispatch has been logged to your account (${escapeHTML(email)}) and recorded in Cloud Firestore.
      </p>

      <div style="background:#1a1a1e; border:1px solid #26262a; border-radius:var(--radius-md); padding:1.25rem; margin-bottom:2rem; font-size:0.85rem; color:var(--text-muted); text-align:left;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Shipment Destination:</span>
          <strong style="color:var(--text-primary);">${escapeHTML(city)}, ${escapeHTML(state)} ${escapeHTML(zip)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Delivery Method:</span>
          <strong style="color:var(--text-primary);">${orderData.shippingMethod === 'express' ? 'Express 2-Day Air' : 'Standard US Ground'}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px solid #26262a; padding-top:6px; margin-top:6px;">
          <span>Authoritative Total:</span>
          <strong style="color:var(--accent-champagne); font-size:1.1rem;">${formatUSD(orderData.totalCents)}</strong>
        </div>
      </div>

      <a href="#/" class="btn-primary" style="display:inline-flex;">Return to Boutique</a>
    </div>
  `;

  showToast('Order Recorded', `Order #${savedOrder.id} successfully processed.`);
}

/* ==========================================================================
   21. ATELIER ADMIN DASHBOARD VIEW (`#/admin`)
   ========================================================================== */

async function renderAdminDashboardView() {
  const main = document.getElementById('main-content');
  if (!main) return;

  if (window.SceneManager) {
    try { window.SceneManager.disposeScenes(); } catch (e) {}
  }

  const live = isLiveFirebase();
  const orders = await fetchUserOrders();

  main.innerHTML = `
    <section class="admin-view" style="padding-top: calc(var(--header-height) + var(--banner-height) + 2rem); padding-bottom: 5rem;">
      <div class="stage-container" style="padding: 0 var(--space-xl); max-width: 1100px;">
        <div style="margin-bottom: 2rem; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h1 style="font-family:var(--font-display); font-size:2.2rem; letter-spacing:var(--tracking-headings);">Atelier Administrator</h1>
            <p style="color:var(--text-muted); font-size:0.85rem;">Catalog management, inventory control, and database diagnostics.</p>
          </div>
          <a href="#/" class="btn-secondary" style="font-size:0.75rem;">← Back to Boutique</a>
        </div>

        <!-- System Diagnostic Status -->
        <div style="background:#141416; border:1px solid #26262a; border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:2rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-muted);">Database Integration Status</div>
            <div style="font-size:1.1rem; color:${live ? 'var(--status-success)' : 'var(--accent-champagne)'}; font-weight:500; margin-top:4px;">
              ${live ? '● Connected to Live Google Cloud Firestore & Firebase Auth' : '● Resilient Local-Persistence Mode (Offline / Fallback)'}
            </div>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">
              ${live ? 'Read/Write operations are active.' : 'Add your credentials to .env to connect live project. Real localStorage fallback is active.'}
            </p>
          </div>
          <div style="font-family:var(--font-mono); font-size:0.8rem; background:#1c1c20; padding:8px 14px; border-radius:var(--radius-sm); border:1px solid #26262a;">
            Market: US (USD) · Security Rules: Strict
          </div>
        </div>

        <!-- Inventory & Catalog Table -->
        <div style="background:#141416; border:1px solid #26262a; border-radius:var(--radius-lg); padding:1.5rem; margin-bottom:2rem;">
          <h3 style="font-family:var(--font-display); font-size:1.3rem; margin-bottom:1rem;">Product Catalog & US Stock Inventory</h3>
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
              <thead>
                <tr style="border-bottom:1px solid #26262a; color:var(--text-muted); text-transform:uppercase; font-size:0.72rem; letter-spacing:0.1em;">
                  <th style="padding:10px 8px;">Product</th>
                  <th style="padding:10px 8px;">Category</th>
                  <th style="padding:10px 8px;">Price (USD)</th>
                  <th style="padding:10px 8px;">Stock</th>
                  <th style="padding:10px 8px;">3D Model</th>
                </tr>
              </thead>
              <tbody>
                ${PRODUCTS.map(p => `
                  <tr style="border-bottom:1px solid #1c1c20;">
                    <td style="padding:12px 8px; font-weight:500; color:var(--text-primary);">${escapeHTML(p.name)}</td>
                    <td style="padding:12px 8px; color:var(--text-muted);">${escapeHTML(p.categoryLabel)}</td>
                    <td style="padding:12px 8px; color:var(--accent-champagne); font-family:var(--font-mono);">${formatUSD(p.priceCents)}</td>
                    <td style="padding:12px 8px; color:${p.stock > 15 ? '#709a74' : '#d4a359'}; font-weight:600;">${p.stock} units</td>
                    <td style="padding:12px 8px; font-size:0.75rem; color:var(--text-muted);">${p.sketchfabModel ? 'Sketchfab (CC-BY 4.0)' : 'Three.js Procedural'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Order Records -->
        <div style="background:#141416; border:1px solid #26262a; border-radius:var(--radius-lg); padding:1.5rem;">
          <h3 style="font-family:var(--font-display); font-size:1.3rem; margin-bottom:1rem;">Recent Database Orders (${orders.length})</h3>
          ${orders.length === 0 ? `
            <p style="color:var(--text-muted); font-size:0.85rem;">No orders registered yet. Complete a checkout in the boutique to populate database records.</p>
          ` : `
            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left;">
                <thead>
                  <tr style="border-bottom:1px solid #26262a; color:var(--text-muted); text-transform:uppercase; font-size:0.72rem; letter-spacing:0.1em;">
                    <th style="padding:10px 8px;">Order ID</th>
                    <th style="padding:10px 8px;">Date</th>
                    <th style="padding:10px 8px;">Client Email</th>
                    <th style="padding:10px 8px;">Destination</th>
                    <th style="padding:10px 8px;">Total (USD)</th>
                    <th style="padding:10px 8px;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${orders.map(o => `
                    <tr style="border-bottom:1px solid #1c1c20;">
                      <td style="padding:12px 8px; font-family:var(--font-mono); color:var(--accent-champagne);">${escapeHTML(o.id)}</td>
                      <td style="padding:12px 8px; color:var(--text-muted); font-size:0.8rem;">${new Date(o.createdAt || Date.now()).toLocaleDateString('en-US')}</td>
                      <td style="padding:12px 8px; color:var(--text-primary);">${escapeHTML(o.customerEmail || 'guest@aurevia.com')}</td>
                      <td style="padding:12px 8px; color:var(--text-muted);">${o.shippingAddress ? `${escapeHTML(o.shippingAddress.city)}, ${escapeHTML(o.shippingAddress.state)}` : 'US'}</td>
                      <td style="padding:12px 8px; font-family:var(--font-mono); font-weight:600; color:var(--accent-champagne);">${formatUSD(o.totalCents || (o.total * 100))}</td>
                      <td style="padding:12px 8px; color:var(--status-success); font-size:0.75rem;">● ${escapeHTML(o.status || 'Confirmed')}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    </section>
  `;

  renderFooter();
}

/* ==========================================================================
   22. SCROLL REVEAL OBSERVER
   ========================================================================== */

let revealObserver = null;

function initScrollReveals() {
  if (revealObserver) revealObserver.disconnect();

  const elements = document.querySelectorAll('.reveal:not(.visible)');

  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => revealObserver.observe(el));
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================================================
   23. LUXURY CUSTOM CURSOR (DESKTOP ONLY)
   ========================================================================== */

function initCustomCursor() {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;

  dot.style.display = 'block';
  outline.style.display = 'block';

  let mouseX = -100, mouseY = -100;
  let outlineX = -100, outlineY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.16;
    outlineY += (mouseY - outlineY) * 0.16;
    outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const hoverTargets = 'a, button, input, select, .product-card, .ingredient-card, .btn-primary, .btn-secondary, .filter-btn, .search-pill';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('cursor-hover');
      outline.classList.add('cursor-hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('cursor-hover');
      outline.classList.remove('cursor-hover');
    }
  }, { passive: true });
}

/* ==========================================================================
   24. OVERLAYS & EVENT HANDLERS
   ========================================================================== */

function closeAllOverlays() {
  closeCart();
  closeSearch();
  closeMobileNav();
  closeAccountModal();
}

function initGlobalListeners() {
  window.addEventListener('cart-updated', () => {
    updateCartCount();
    if (AppState.cartOpen) renderCartDrawer();
  });

  window.addEventListener('wishlist-updated', () => {
    renderHeader();
  });

  subscribeToAuth(() => {
    renderHeader();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllOverlays();
  });
}

/* ==========================================================================
   25. BOOTSTRAP APPLICATION
   ========================================================================== */

function boot() {
  renderHeader();
  renderMobileNav();
  renderCartDrawer();
  renderSearchOverlay();
  renderAccountModal();

  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();

  initGlobalListeners();
  initCustomCursor();

  // Dismiss Preloader smoothly
  setTimeout(() => {
    if (window._completePreloader) {
      window._completePreloader();
    }
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
