/**
 * AUREVIA — Premium Skincare E-Commerce Platform
 * Main Application Engine (app.js)
 * 
 * Luxury editorial experience with Three.js 3D showcases,
 * liquid-glass UI, real-time client cart, client router,
 * dynamic search discovery, and responsive interaction choreography.
 */

/* ==========================================================================
   1. PRODUCT CATALOG DATA
   ========================================================================== */

const PRODUCTS = [
  {
    id: 'radiance-serum',
    name: 'Aurevia Radiance Serum',
    tagline: 'Illuminate Your Natural Radiance',
    price: 185,
    category: 'serums',
    categoryLabel: 'Luminous Elixir',
    theme: 'luminescence',
    rating: 4.9,
    reviewCount: 128,
    description: 'An ethereal brightening elixir infused with stabilized vitamin C, multi-weight hyaluronic acid, and micronized 24K gold particles. Formulated to neutralize oxidative stress, diminish hyperpigmentation, and impart an otherworldly glass-skin luminosity.',
    shortDescription: 'Vitamin C & 24K gold micronized brightening elixir',
    featured: true,
    ingredients: [
      { name: 'Stabilized Vitamin C (15%)', origin: 'Formulated in France', benefit: 'Neutralizes free radicals & revives radiance', detail: 'Liposomal 3-O-Ethyl Ascorbic Acid' },
      { name: 'Multi-Weight Hyaluronate', origin: 'Swiss Bio-Ferment', benefit: 'Deep cellular plumpness & prolonged hydration', detail: 'Triple molecular matrix (5kDa – 1.8MDa)' },
      { name: '24K Gold Suspension', origin: 'Ethically Sourced', benefit: 'Instant radiant sheen & micro-circulation', detail: 'Pharmaceutical-grade gold leaf particulate' },
      { name: 'Niacinamide (5%)', origin: 'Pharmaceutical Grade', benefit: 'Refines pore texture & balances sebum', detail: 'Ultra-pure Vitamin B3 derivative' }
    ],
    details: {
      size: '30ml / 1.0 fl oz',
      skinType: 'All skin types, especially fatigued & dull',
      usage: 'Dispense 2–3 drops onto clean fingertips each morning and evening. Press gently into face and neck before moisturizing.',
      texture: 'Silk-weight liquid with warm champagne luminescence',
      shelfLife: '12 months after opening'
    },
    colors: { primary: '#d4af7a', secondary: '#b8956a', accent: '#f5e6c8', dark: '#1e1810' }
  },
  {
    id: 'hydration-cream',
    name: 'Aurevia Hydration Cream',
    tagline: 'Timeless Moisture, Boundless Comfort',
    price: 165,
    category: 'moisturizers',
    categoryLabel: 'Barrier Recovery',
    theme: 'celestial',
    rating: 4.8,
    reviewCount: 94,
    description: 'A decadent moisture cocoon enriched with cold-pressed arctic cloudberry, biomimetic ceramides, and botanical squalane. Deeply fortifies the stratum corneum to seal in hydration through extreme climate changes.',
    shortDescription: 'Biomimetic ceramide & arctic cloudberry barrier cream',
    featured: false,
    ingredients: [
      { name: 'Triple Ceramide Complex', origin: 'Bio-Fermented', benefit: 'Repairs and reinforces lipid moisture mantle', detail: 'Ceramides NP, AP, EOP with Phytosphingosine' },
      { name: 'Arctic Cloudberry Extract', origin: 'Wild Nordic Harvest', benefit: 'Super-antioxidant high in Vitamins A, C, E', detail: 'Cold-pressed wild Rubus chamaemorus' },
      { name: 'Olive-Derived Squalane', origin: 'Spanish Olive Orchards', benefit: 'Weightless lipid mimic for satin finish', detail: '100% plant-based squalane' },
      { name: 'Shea Butter Ester', origin: 'West African Co-op', benefit: 'Velvety comfort without greasy residue', detail: 'Purified unsaponifiable fractions' }
    ],
    details: {
      size: '50ml / 1.7 fl oz',
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
    tagline: 'Purify with the Essence of Nature',
    price: 95,
    category: 'cleansers',
    categoryLabel: 'Gentle Purifier',
    theme: 'botanical',
    rating: 4.7,
    reviewCount: 156,
    description: 'A sulfate-free hydro-gel cleanser fusing shade-grown ceremonial matcha, German chamomile bisabolol, and phospholipid micellar matrices. Gently lifts pollutants and waterproof makeup without disrupting delicate pH.',
    shortDescription: 'Sulfate-free matcha & chamomile hydro-gel wash',
    featured: false,
    ingredients: [
      { name: 'Ceremonial Matcha EGCG', origin: 'Uji, Kyoto Japan', benefit: 'Potent polyphenols soothe oxidative stress', detail: 'Organic shade-grown Camellia sinensis' },
      { name: 'German Chamomile Bisabolol', origin: 'Bavarian Alps', benefit: 'Calms redness, irritation, and sensitivity', detail: 'Pure natural isolated (-)-alpha-bisabolol' },
      { name: 'Phospholipid Micelles', origin: 'Plant Bio-Tech', benefit: 'Traps impurities while reinforcing lipids', detail: 'Biomimetic lecithin micro-capsules' },
      { name: 'Aloe Barbadensis Gel', origin: 'Californian Desert', benefit: 'Deep hydration and barrier soothing', detail: 'Cold-pressed inner leaf fillet' }
    ],
    details: {
      size: '150ml / 5.1 fl oz',
      skinType: 'All skin types, including reactive & blemish-prone',
      usage: 'Lather one pump into damp palms, massage in circular motions across face for 60 seconds, and rinse with lukewarm water.',
      texture: 'Refreshing crystalline gel that blossoms into a micro-cushion foam',
      shelfLife: '12 months after opening'
    },
    colors: { primary: '#8fa88b', secondary: '#6e886a', accent: '#dbe8d8', dark: '#121a13' }
  },
  {
    id: 'renewal-oil',
    name: 'Aurevia Renewal Oil',
    tagline: 'Ancient Botanicals, Modern Luxury',
    price: 210,
    category: 'oils',
    categoryLabel: 'Nocturne Treatment',
    theme: 'nocturne',
    rating: 4.9,
    reviewCount: 88,
    description: 'An opulent midnight recovery nectar blending cold-pressed Chilean rosehip, wild Moroccan argan, bakuchiol, and encapsulated bio-retinoid. Accelerates nocturnal cellular turnover while you sleep.',
    shortDescription: 'Bakuchiol & organic virgin argan midnight elixir',
    featured: false,
    ingredients: [
      { name: 'Patagonian Rosehip Oil', origin: 'Chilean Andes', benefit: 'Rich in Pro-Vitamin A and Omega 3-6-9', detail: 'Cold-pressed certified organic Rosa rubiginosa' },
      { name: 'Bakuchiol (2%)', origin: 'Ayurvedic Babchi Seed', benefit: 'Clinically proven botanical retinol alternative', detail: '99% pure mono-terpene phenol' },
      { name: 'Hand-Harvested Argan Oil', origin: 'Souss Valley, Morocco', benefit: 'Intense lipid restoration & elasticity', detail: 'Virgin cold-pressed Argania spinosa kernel' },
      { name: 'Golden Jojoba Wax Esters', origin: 'Sonoran Desert', benefit: 'Mimics natural dermal sebum structure', detail: 'Unrefined cold-pressed liquid wax' }
    ],
    details: {
      size: '30ml / 1.0 fl oz',
      skinType: 'Mature, combination, and environmentally stressed skin',
      usage: 'Press 3–4 drops into palms to warm, then gently cup over face, breathing in natural herbal aromatics before bedtime.',
      texture: 'Sublime golden satin dry-oil with immediate absorption',
      shelfLife: '12 months after opening'
    },
    colors: { primary: '#b8956a', secondary: '#8a6840', accent: '#ecd2b4', dark: '#1b140b' }
  }
];

window.PRODUCTS = PRODUCTS;

/* ==========================================================================
   2. HIGH-FIDELITY VECTOR PRODUCT RENDERERS (SVG FALLBACK & CARDS)
   ========================================================================== */

function generateProductSVG(product) {
  const id = product.id;
  const c = product.colors;

  if (id === 'radiance-serum') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a2218" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="serumGlass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,255,255,0.4)"/>
      <stop offset="15%" stop-color="rgba(212,175,122,0.2)"/>
      <stop offset="45%" stop-color="rgba(212,175,122,0.05)"/>
      <stop offset="85%" stop-color="rgba(255,255,255,0.1)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.35)"/>
    </linearGradient>
    <linearGradient id="serumLiquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5e6c8" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#d4af7a" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#967240" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="goldCap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8a693b"/>
      <stop offset="25%" stop-color="#ecd5b5"/>
      <stop offset="50%" stop-color="#d4af7a"/>
      <stop offset="75%" stop-color="#fff6e8"/>
      <stop offset="100%" stop-color="#7a5c32"/>
    </linearGradient>
    <filter id="serumShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
    </filter>
  </defs>
  <rect width="400" height="500" fill="#0c0c0e"/>
  <circle cx="200" cy="270" r="160" fill="url(#bgGlow)"/>
  
  <!-- Ambient Shadow -->
  <ellipse cx="200" cy="440" rx="75" ry="14" fill="rgba(0,0,0,0.75)" filter="url(#serumShadow)"/>

  <!-- Serum Bottle Body (Outer Glass) -->
  <rect x="150" y="160" width="100" height="260" rx="20" fill="url(#serumGlass)" stroke="rgba(212,175,122,0.3)" stroke-width="1.5"/>
  
  <!-- Liquid Chamber Inside -->
  <rect x="156" y="200" width="88" height="212" rx="14" fill="url(#serumLiquid)"/>
  
  <!-- Liquid Meniscus Highlight -->
  <ellipse cx="200" cy="202" rx="42" ry="5" fill="#fff" opacity="0.4"/>
  
  <!-- Glass Reflection Specular Line Left -->
  <path d="M 158 175 Q 160 290 160 410" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <!-- Specular Line Right -->
  <path d="M 242 175 Q 240 290 240 410" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-linecap="round" fill="none"/>

  <!-- Minimal Brand Label -->
  <rect x="165" y="275" width="70" height="85" rx="4" fill="rgba(10,10,10,0.6)" stroke="rgba(212,175,122,0.4)" stroke-width="0.8"/>
  <text x="200" y="305" font-family="'Italiana', serif" font-size="10" fill="#f5f0e8" letter-spacing="3" text-anchor="middle">AUREVIA</text>
  <line x1="175" y1="315" x2="225" y2="315" stroke="#d4af7a" stroke-width="0.5"/>
  <text x="200" y="330" font-family="'Inter', sans-serif" font-size="5.5" fill="#d4af7a" letter-spacing="2" text-anchor="middle">RADIANCE SERUM</text>
  <text x="200" y="345" font-family="'Inter', sans-serif" font-size="4.5" fill="#a0a0a0" letter-spacing="1" text-anchor="middle">30 ML / 1.0 FL. OZ</text>

  <!-- Gold Neck Collar -->
  <rect x="170" y="142" width="60" height="22" rx="3" fill="url(#goldCap)"/>
  
  <!-- Dropper Cap Base -->
  <rect x="176" y="90" width="48" height="54" rx="6" fill="url(#goldCap)"/>
  <line x1="176" y1="120" x2="224" y2="120" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>

  <!-- Rubber Pipette Bulb -->
  <path d="M 186 90 C 186 65, 214 65, 214 90 Z" fill="#18181a" stroke="#2a2a2e" stroke-width="1.5"/>
</svg>`)}`;
  }

  if (id === 'hydration-cream') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="creamGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a201c" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="creamJar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38302c"/>
      <stop offset="25%" stop-color="#f0ded5"/>
      <stop offset="50%" stop-color="#e2ccc1"/>
      <stop offset="85%" stop-color="#9e8476"/>
      <stop offset="100%" stop-color="#2e2522"/>
    </linearGradient>
    <linearGradient id="lidGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#9c7a54"/>
      <stop offset="30%" stop-color="#fff1dc"/>
      <stop offset="60%" stop-color="#dfbfa8"/>
      <stop offset="100%" stop-color="#705234"/>
    </linearGradient>
    <filter id="creamShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
    </filter>
  </defs>
  <rect width="400" height="500" fill="#0c0c0e"/>
  <circle cx="200" cy="300" r="160" fill="url(#creamGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="425" rx="100" ry="16" fill="rgba(0,0,0,0.8)" filter="url(#creamShadow)"/>

  <!-- Frosted Jar Body -->
  <rect x="110" y="240" width="180" height="170" rx="24" fill="url(#creamJar)" stroke="rgba(223,191,168,0.3)" stroke-width="1"/>
  
  <!-- Frosted Glass Specular Highlights -->
  <path d="M 125 255 L 125 395" stroke="rgba(255,255,255,0.7)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 275 255 L 275 395" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/>

  <!-- Minimal Label -->
  <text x="200" y="325" font-family="'Italiana', serif" font-size="13" fill="#1b1411" letter-spacing="4" text-anchor="middle">AUREVIA</text>
  <line x1="160" y1="337" x2="240" y2="337" stroke="#bfa088" stroke-width="0.8"/>
  <text x="200" y="354" font-family="'Inter', sans-serif" font-size="6.5" fill="#4d382d" letter-spacing="2" text-anchor="middle">HYDRATION CREAM</text>
  <text x="200" y="372" font-family="'Inter', sans-serif" font-size="5" fill="#786255" letter-spacing="1" text-anchor="middle">50 ML / 1.7 FL. OZ</text>

  <!-- Metallic Lid -->
  <rect x="100" y="195" width="200" height="48" rx="12" fill="url(#lidGold)"/>
  <ellipse cx="200" cy="195" rx="100" ry="14" fill="#fff5e8" opacity="0.6"/>
  <line x1="104" y1="230" x2="296" y2="230" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>
</svg>`)}`;
  }

  if (id === 'botanical-cleanser') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="botGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#162618" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cleanGlass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(143,168,139,0.3)"/>
      <stop offset="25%" stop-color="rgba(255,255,255,0.4)"/>
      <stop offset="50%" stop-color="rgba(143,168,139,0.1)"/>
      <stop offset="85%" stop-color="rgba(110,136,106,0.2)"/>
      <stop offset="100%" stop-color="rgba(143,168,139,0.35)"/>
    </linearGradient>
    <linearGradient id="botLiquid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dbe8d8" stop-opacity="0.75"/>
      <stop offset="50%" stop-color="#8fa88b" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#4e684a" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="botCap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4e684a"/>
      <stop offset="35%" stop-color="#c8dec5"/>
      <stop offset="70%" stop-color="#8fa88b"/>
      <stop offset="100%" stop-color="#3b5238"/>
    </linearGradient>
    <filter id="cleanShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
    </filter>
  </defs>
  <rect width="400" height="500" fill="#0c0c0e"/>
  <circle cx="200" cy="280" r="160" fill="url(#botGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="450" rx="70" ry="12" fill="rgba(0,0,0,0.75)" filter="url(#cleanShadow)"/>

  <!-- Tall Minimal Bottle -->
  <rect x="145" y="170" width="110" height="270" rx="22" fill="url(#cleanGlass)" stroke="rgba(143,168,139,0.4)" stroke-width="1.2"/>
  <rect x="151" y="195" width="98" height="235" rx="16" fill="url(#botLiquid)"/>

  <!-- Specular Highlights -->
  <path d="M 155 185 L 155 425" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 245 185 L 245 425" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Brand Typography -->
  <rect x="160" y="275" width="80" height="90" rx="4" fill="rgba(10,15,11,0.65)" stroke="rgba(143,168,139,0.3)" stroke-width="0.8"/>
  <text x="200" y="305" font-family="'Italiana', serif" font-size="10" fill="#f5f0e8" letter-spacing="3" text-anchor="middle">AUREVIA</text>
  <line x1="172" y1="315" x2="228" y2="315" stroke="#8fa88b" stroke-width="0.6"/>
  <text x="200" y="330" font-family="'Inter', sans-serif" font-size="5" fill="#8fa88b" letter-spacing="1.5" text-anchor="middle">BOTANICAL CLEANSER</text>
  <text x="200" y="345" font-family="'Inter', sans-serif" font-size="4.5" fill="#9fae9d" letter-spacing="1" text-anchor="middle">150 ML / 5.1 FL. OZ</text>

  <!-- Pump Mechanism -->
  <rect x="175" y="145" width="50" height="26" rx="4" fill="url(#botCap)"/>
  <rect x="188" y="110" width="24" height="38" rx="2" fill="url(#botCap)"/>
  <path d="M 160 118 L 220 118 Q 230 118 230 126 L 226 130 L 160 130 Z" fill="url(#botCap)"/>
  <!-- Pump Spout -->
  <path d="M 160 122 Q 130 122 125 138" stroke="url(#botCap)" stroke-width="8" stroke-linecap="round" fill="none"/>
</svg>`)}`;
  }

  if (id === 'renewal-oil') {
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
  <defs>
    <radialGradient id="oilGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#281a0e" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0a0a0c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="amberGlass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3d2614"/>
      <stop offset="25%" stop-color="#8a5327"/>
      <stop offset="50%" stop-color="#4d2f17"/>
      <stop offset="85%" stop-color="#b87a42"/>
      <stop offset="100%" stop-color="#2a180b"/>
    </linearGradient>
    <linearGradient id="richOil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ecd2b4" stop-opacity="0.8"/>
      <stop offset="35%" stop-color="#c98a44" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#693c12" stop-opacity="0.98"/>
    </linearGradient>
    <linearGradient id="oilGold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6e4f2b"/>
      <stop offset="30%" stop-color="#ffdca8"/>
      <stop offset="65%" stop-color="#b8956a"/>
      <stop offset="100%" stop-color="#543b1e"/>
    </linearGradient>
    <filter id="oilShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
    </filter>
  </defs>
  <rect width="400" height="500" fill="#0c0c0e"/>
  <circle cx="200" cy="275" r="160" fill="url(#oilGlow)"/>

  <!-- Ground Shadow -->
  <ellipse cx="200" cy="445" rx="72" ry="13" fill="rgba(0,0,0,0.8)" filter="url(#oilShadow)"/>

  <!-- Amber Dropper Bottle Body -->
  <rect x="150" y="170" width="100" height="260" rx="18" fill="url(#amberGlass)" stroke="rgba(184,149,106,0.35)" stroke-width="1.2"/>
  <rect x="156" y="200" width="88" height="220" rx="12" fill="url(#richOil)"/>

  <!-- Rich Amber Specular -->
  <path d="M 158 185 L 158 415" stroke="rgba(255,220,180,0.6)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 242 185 L 242 415" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Nocturne Label -->
  <rect x="165" y="275" width="70" height="85" rx="3" fill="#0f0c08" stroke="rgba(184,149,106,0.5)" stroke-width="0.8"/>
  <text x="200" y="303" font-family="'Italiana', serif" font-size="10" fill="#f5f0e8" letter-spacing="3" text-anchor="middle">AUREVIA</text>
  <line x1="175" y1="313" x2="225" y2="313" stroke="#b8956a" stroke-width="0.5"/>
  <text x="200" y="328" font-family="'Inter', sans-serif" font-size="5.5" fill="#b8956a" letter-spacing="1.8" text-anchor="middle">RENEWAL OIL</text>
  <text x="200" y="344" font-family="'Inter', sans-serif" font-size="4.5" fill="#8c755c" letter-spacing="1" text-anchor="middle">NOCTURNE FORMULA</text>

  <!-- Dropper Cap -->
  <rect x="170" y="150" width="60" height="22" rx="3" fill="url(#oilGold)"/>
  <rect x="176" y="95" width="48" height="56" rx="6" fill="url(#oilGold)"/>
  <path d="M 186 95 C 186 70, 214 70, 214 95 Z" fill="#14100c" stroke="#2a2016" stroke-width="1.5"/>
</svg>`)}`;
  }

  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#111"/><text x="200" y="250" fill="#f5f0e8" font-family="serif" text-anchor="middle">AUREVIA</text></svg>`)}`;
}

/* ==========================================================================
   3. CLIENT SHOPPING CART ENGINE (LOCALSTORAGE)
   ========================================================================== */

class CartManager {
  constructor() {
    this.items = [];
    this.storageKey = 'aurevia_luxury_cart_v1';
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
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, 10);
    } else {
      this.items.push({ productId, quantity: Math.min(quantity, 10) });
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

    item.quantity = Math.min(Math.max(1, quantity), 10);
    this.save();
    this.dispatch();
  }

  getSubtotal() {
    return this.items.reduce((total, item) => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  getShipping() {
    if (this.items.length === 0) return 0;
    return this.getSubtotal() >= 150 ? 0 : 12;
  }

  getTotal() {
    return this.getSubtotal() + this.getShipping();
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
    } catch (e) {
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
   4. APPLICATION STATE
   ========================================================================== */

const AppState = {
  currentView: 'home',
  currentProductId: null,
  searchQuery: '',
  activeFilter: 'all',
  sortBy: 'featured',
  cartOpen: false,
  searchOpen: false,
  mobileNavOpen: false
};

/* ==========================================================================
   5. TOAST NOTIFICATIONS & UTILITIES
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
   6. CLIENT ROUTER
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
  } else {
    renderHomeView();
  }
}

/* ==========================================================================
   7. HEADER & NAVIGATION
   ========================================================================== */

function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  header.innerHTML = `
    <div class="demo-banner" id="demo-banner">
      <span class="demo-banner-pill">✦ Demonstration Store</span>
      <span class="demo-banner-text">Experience cinematic luxury e-commerce. No real transactions or medical claims.</span>
      <button class="demo-banner-close" id="demo-banner-close" aria-label="Dismiss demo banner">×</button>
    </div>
    <div class="header-inner">
      <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle navigation menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <a href="#/" class="logo" aria-label="Aurevia Homepage">AUREVIA</a>
      <nav class="nav-links" aria-label="Primary Navigation">
        <a href="#/" data-nav="shop">Shop</a>
        <a href="#/" data-nav="collection">The Collection</a>
        <a href="#/" data-nav="about">Heritage</a>
      </nav>
      <div class="header-actions">
        <button class="header-icon-btn" id="search-btn" aria-label="Search Catalog">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
        </button>
        <button class="header-icon-btn cart-btn" id="cart-btn" aria-label="Open Shopping Bag">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="cart-count" id="cart-count" style="display:none">0</span>
        </button>
      </div>
    </div>
  `;

  // Header Scroll Blur Transition
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    header.classList.toggle('scrolled', current > 50);
    lastScroll = current;
  }, { passive: true });

  // Banner dismiss
  document.getElementById('demo-banner-close')?.addEventListener('click', () => {
    const banner = document.getElementById('demo-banner');
    if (banner) banner.style.display = 'none';
  });

  // Action Triggers
  document.getElementById('cart-btn')?.addEventListener('click', () => toggleCart());
  document.getElementById('search-btn')?.addEventListener('click', () => toggleSearch());
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => toggleMobileNav());

  // Nav link smooth jumps
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
   8. MOBILE NAVIGATION
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
        <a href="#/" data-mobilenav="shop">Shop All</a>
        <a href="#/" data-mobilenav="collection">The Collection</a>
        <a href="#/" data-mobilenav="about">Brand Heritage</a>
        <a href="#/checkout" data-mobilenav="checkout">Demo Checkout</a>
      </nav>
      <div class="mobile-nav-footer">
        <p class="mobile-nav-demo">✦ Fictional Luxury Demonstration Experience</p>
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
  if (nav) {
    nav.classList.toggle('active', AppState.mobileNavOpen);
    nav.setAttribute('aria-hidden', !AppState.mobileNavOpen);
  }
  if (btn) btn.setAttribute('aria-expanded', AppState.mobileNavOpen);
  document.body.style.overflow = AppState.mobileNavOpen ? 'hidden' : '';
}

function closeMobileNav() {
  AppState.mobileNavOpen = false;
  const nav = document.getElementById('mobile-nav');
  const btn = document.getElementById('mobile-menu-btn');
  if (nav) {
    nav.classList.remove('active');
    nav.setAttribute('aria-hidden', 'true');
  }
  if (btn) btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ==========================================================================
   9. SHOPPING CART DRAWER
   ========================================================================== */

function renderCartDrawer() {
  const root = document.getElementById('cart-drawer-root');
  if (!root) return;

  const items = cart.getItems();
  const isEmpty = items.length === 0;
  const subtotal = cart.getSubtotal();
  const shipping = cart.getShipping();
  const total = cart.getTotal();
  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

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
          <span class="cart-item-price">\$${product.price}</span>
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
            ${subtotal >= freeShippingThreshold 
              ? `<strong>Complimentary Express Shipping</strong> Unlocked` 
              : `Add <strong>\$${freeShippingThreshold - subtotal}</strong> more for complimentary shipping`}
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
            <div class="cart-summary-row">
              <span>Subtotal</span>
              <span>\$${subtotal}</span>
            </div>
            <div class="cart-summary-row">
              <span>Estimated Shipping</span>
              <span>${shipping === 0 ? 'Complimentary' : '$' + shipping}</span>
            </div>
            <div class="cart-summary-row total">
              <span>Estimated Total</span>
              <span class="price">\$${total}</span>
            </div>
            <button class="btn-checkout" id="cart-checkout-btn">Proceed to Checkout</button>
            <button class="cart-item-remove" data-action="clear-all" style="width:100%;text-align:center;margin-top:12px;">Clear Entire Bag</button>
            <p class="cart-demo-note">✦ Demonstration checkout — no actual financial transactions</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Overlay click to close
  const overlay = document.getElementById('cart-overlay');
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeCart();
  });

  document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    closeCart();
    navigateTo('/checkout');
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
   10. SEARCH OVERLAY & DISCOVERY
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
        <input type="search" class="search-input" id="search-input" placeholder="Search formulations, ingredients..." aria-label="Search formulations" autocomplete="off">
        <div class="search-input-icon">✦</div>
      </div>
      <div class="search-pills">
        <button class="search-pill ${AppState.activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Formulations</button>
        <button class="search-pill ${AppState.activeFilter === 'serums' ? 'active' : ''}" data-filter="serums">Serums</button>
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
      p.ingredients.some(ing => ing.name.toLowerCase().includes(q) || ing.benefit.toLowerCase().includes(q))
    );
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary);">No Formulations Found</p>
        <p style="font-size: 0.9rem;">Try searching for "Vitamin C", "Ceramides", or select a category pill above.</p>
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
          <span class="product-price">\$${p.price}</span>
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
   11. HOME VIEW (CINEMATIC HERO + STORYTELLING + STOREFRONT)
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
   12. HERO CINEMATIC SHOWCASE
   ========================================================================== */

function createHeroShowcaseSection() {
  const product = PRODUCTS[0]; // Aurevia Radiance Serum
  const section = document.createElement('section');
  section.className = 'hero-showcase';
  section.id = 'hero-showcase';

  section.innerHTML = `
    <!-- Three.js 3D Canvas Rig -->
    <div class="hero-canvas-container" id="hero-canvas" aria-hidden="true"></div>

    <div class="hero-content">
      <div class="hero-grid">
        <div class="hero-text-block">
          <div class="hero-eyebrow reveal">
            <span>✦ Master Formulation</span>
          </div>
          <h1 class="hero-title reveal" style="transition-delay: 0.1s;">${escapeHTML(product.name)}</h1>
          <p class="hero-tagline reveal" style="transition-delay: 0.2s;">${escapeHTML(product.tagline)}</p>
          <p class="hero-description reveal" style="transition-delay: 0.3s;">${escapeHTML(product.description)}</p>
          
          <div class="hero-price-wrap reveal" style="transition-delay: 0.4s;">
            <span class="hero-price-label">Retail Experience</span>
            <span class="hero-price">\$${product.price}</span>
            <span class="hero-volume">${product.details.size}</span>
          </div>

          <div class="hero-actions reveal" style="transition-delay: 0.5s;">
            <a href="#/product/${product.id}" class="btn-primary">Explore In 3D</a>
            <button class="btn-secondary" data-hero-add="${product.id}">Add to Bag</button>
          </div>
        </div>

        <aside class="hero-specs-panel glass reveal" style="transition-delay: 0.6s;">
          <div class="spec-item">
            <span class="spec-title">Concentration</span>
            <span class="spec-value">15% Active Vit-C + 24K Gold</span>
          </div>
          <div class="spec-item">
            <span class="spec-title">Target Concerns</span>
            <span class="spec-value">Dullness, Fine Lines, Hydration</span>
          </div>
          <div class="spec-item">
            <span class="spec-title">Texture</span>
            <span class="spec-value">${product.details.texture}</span>
          </div>
          <div class="spec-item">
            <span class="spec-title">Certification</span>
            <span class="spec-value">Dermatologically Evaluated (Demo)</span>
          </div>
        </aside>
      </div>
    </div>

    <!-- Scroll Cue -->
    <a href="#scroll-story" class="hero-scroll-indicator reveal" style="transition-delay: 0.7s;" aria-label="Scroll to discover ingredients">
      <span class="hero-scroll-text">Scroll to Experience</span>
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
   13. SCROLL STORYTELLING CHAPTERS
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
          <div class="stage-text glass reveal">
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
                <p style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;">Synthetic Fragrance</p>
              </div>
            </div>
          </div>
          <div class="stage-visual reveal" style="transition-delay:0.2s;">
            <div style="text-align:center;">
              <img src="${generateProductSVG(product)}" alt="${escapeHTML(product.name)}" style="max-height:420px;filter:drop-shadow(0 20px 40px rgba(0,0,0,0.8));">
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Chapter 2: Key Active Ingredients Grid
  const ingredientCards = product.ingredients.map((ing, i) => `
    <div class="ingredient-card glass reveal" style="transition-delay: ${0.1 + i * 0.1}s;">
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
          <h2 class="stage-title">Botanical Precision Meets Cellular Synergy</h2>
          <p class="stage-description">
            Four targeted actives working synchronously to replenish moisture, brighten uneven tone, and defend skin against urban photo-aging.
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
          <div class="benefit-card glass reveal" style="transition-delay:0.1s;">
            <div class="benefit-num">01</div>
            <h3 class="benefit-title">Awaken & Tone</h3>
            <p class="benefit-desc">Dispense onto warm fingertips after cleansing to initiate immediate cellular micro-circulation.</p>
          </div>
          <div class="benefit-card glass reveal" style="transition-delay:0.2s;">
            <div class="benefit-num">02</div>
            <h3 class="benefit-title">Instant Radiance</h3>
            <p class="benefit-desc">Subtle micro-particulates reflect natural ambient light for an immediate healthy dewy veil.</p>
          </div>
          <div class="benefit-card glass reveal" style="transition-delay:0.3s;">
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
   14. STOREFRONT COLLECTION GRID
   ========================================================================== */

function createStorefrontSection() {
  const section = document.createElement('section');
  section.className = 'collection-section';
  section.id = 'collection-section';

  section.innerHTML = `
    <div class="collection-header reveal">
      <span class="section-eyebrow">✦ The Complete Suite</span>
      <h2 class="section-title">The Aurevia Skincare Suite</h2>
      <p class="section-desc">Four artisanal formulations designed to complete your morning and evening restorative ritual.</p>
    </div>

    <div class="collection-controls reveal" style="transition-delay:0.1s;">
      <div class="collection-filters">
        <button class="filter-btn active" data-grid-filter="all">All Formulations</button>
        <button class="filter-btn" data-grid-filter="serums">Serums</button>
        <button class="filter-btn" data-grid-filter="moisturizers">Moisturizers</button>
        <button class="filter-btn" data-grid-filter="cleansers">Cleansers</button>
        <button class="filter-btn" data-grid-filter="oils">Nocturne Oils</button>
      </div>
      <div class="collection-sorting">
        <select class="sort-select" id="collection-sort-select" aria-label="Sort product catalog">
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
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
    list.sort((a, b) => a.price - b.price);
  } else if (AppState.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (AppState.sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  grid.innerHTML = list.map((p, index) => `
    <article class="product-card reveal" data-theme="${p.theme}" data-product-id="${p.id}" style="transition-delay:${index * 0.1}s;">
      <div class="product-card-media">
        <a href="#/product/${p.id}" aria-label="Inspect ${escapeHTML(p.name)} in 3D">
          <img class="product-card-img" src="${generateProductSVG(p)}" alt="${escapeHTML(p.name)}" loading="lazy">
        </a>
        <div class="product-card-actions">
          <button class="btn-quick-add" data-store-add="${p.id}">+ Quick Add to Bag</button>
        </div>
      </div>
      <div class="product-card-info">
        <div class="product-category">${escapeHTML(p.categoryLabel)}</div>
        <h3 class="product-name">
          <a href="#/product/${p.id}">${escapeHTML(p.name)}</a>
        </h3>
        <p class="product-desc">${escapeHTML(p.shortDescription)}</p>
        <div class="product-footer">
          <span class="product-price">\$${p.price}</span>
          <div class="product-rating">
            ${renderStars(p.rating)}
            <span class="product-rating-count">(${p.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-store-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      cart.addItem(e.currentTarget.dataset.storeAdd);
    });
  });

  initScrollReveals();
}

/* ==========================================================================
   15. HERITAGE & PHILOSOPHY
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
          <h2 class="stage-title">Designed for Modern Longevity</h2>
          <p class="stage-description">
            Aurevia was founded with a singular conviction: luxury skincare should be a tactile masterpiece that respects the biology of skin. Every active concentration is formulated at clinical synergy, avoiding irritants, fillers, and synthetic micro-plastics.
          </p>
          <p class="stage-description">
            Our sculptural bottles are designed to be heirloom objects on your vanity, celebrated through cinematic WebGL presentations and responsive tactile interaction.
          </p>
          <div style="margin-top:2rem;">
            <a href="#/product/radiance-serum" class="btn-secondary">Explore Radiance Serum</a>
          </div>
        </div>
        <div class="about-badge-card glass reveal" style="padding:3rem;border-radius:var(--radius-xl);text-align:center;">
          <div style="font-family:var(--font-display);font-size:2.4rem;color:var(--accent-champagne);margin-bottom:1rem;">✦ AUREVIA ✦</div>
          <p style="color:var(--text-secondary);font-size:0.95rem;line-height:1.7;">
            "We do not create mere cosmetics; we curate quiet moments of daily sensory renewal."
          </p>
          <div style="margin-top:2rem;border-top:1px solid rgba(255,255,255,0.08);padding-top:1.5rem;font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--accent-bronze);">
            Paris · Zurich · Tokyo
          </div>
        </div>
      </div>
    </div>
  `;

  return section;
}

/* ==========================================================================
   16. FOOTER
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
            Artisanal botanical skincare presented through cinematic WebGL 3D design and liquid-glass interfaces.
          </p>
          <div class="footer-demo-disclaimer">
            <span>✦ Demonstration Concept Store</span>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Formulations</h4>
          <div class="footer-nav-list">
            <a href="#/product/radiance-serum" class="footer-nav-link">Radiance Serum</a>
            <a href="#/product/hydration-cream" class="footer-nav-link">Hydration Cream</a>
            <a href="#/product/botanical-cleanser" class="footer-nav-link">Botanical Cleanser</a>
            <a href="#/product/renewal-oil" class="footer-nav-link">Renewal Oil</a>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Architecture</h4>
          <div class="footer-nav-list">
            <a href="#/" class="footer-nav-link" onclick="event.preventDefault(); scrollToSection('shop');">The Catalog</a>
            <a href="#/" class="footer-nav-link" onclick="event.preventDefault(); scrollToSection('about');">Maison Heritage</a>
            <a href="#/checkout" class="footer-nav-link">Interactive Checkout</a>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="footer-col-title">Privilege Newsletter</h4>
          <p class="footer-desc" style="font-size:0.8rem;">Subscribe for private formulations and seasonal exhibitions.</p>
          <form onsubmit="event.preventDefault(); showToast('Subscribed to Demo Newsletter', 'Welcome to Aurevia Maison.'); this.reset();" style="position:relative;margin-top:10px;">
            <input type="email" placeholder="Enter your email" required style="width:100%;height:44px;padding:0 48px 0 16px;border-radius:var(--radius-pill);background:rgba(255,255,255,0.05);border:1px solid var(--glass-border);color:var(--text-primary);font-size:0.85rem;">
            <button type="submit" aria-label="Subscribe" style="position:absolute;right:4px;top:4px;bottom:4px;width:36px;border-radius:50%;background:var(--accent-champagne);color:#0a0a0a;border:none;cursor:pointer;font-weight:bold;">→</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} AUREVIA Maison. Demonstration conceptual store for interactive showcase purposes.</p>
        <div class="footer-legal-links">
          <span>WebGL 3D Engine</span>
          <span>Responsive Touch Rig</span>
          <span>Liquid Glass UI</span>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   17. PRODUCT DETAIL VIEW (3D INSPECTOR & PURCHASE)
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

  main.innerHTML = `
    <section class="product-detail-view" style="padding-top: calc(var(--header-height) + var(--banner-height) + 2rem); padding-bottom: 5rem;">
      <div class="stage-container" style="padding: 0 var(--space-xl);">
        <div style="margin-bottom: 2rem;">
          <a href="#/" class="checkout-back-btn">← Return to Collection</a>
        </div>

        <div class="product-detail-layout" style="border: 1px solid var(--glass-border); border-radius: var(--radius-xl); overflow: hidden; background: #0c0c0e;">
          <!-- Left Visual & 3D Interactive Stage -->
          <div class="product-detail-media" style="position:relative; min-height: 540px; display:flex; align-items:center; justify-content:center; background: radial-gradient(circle at 50% 50%, rgba(25,22,18,0.8), #09090b);">
            <div id="detail-canvas" style="position:absolute; inset:0; width:100%; height:100%; cursor:grab;">
              <!-- 3D Canvas injected here by scene.js -->
            </div>
            <!-- Graceful Fallback if WebGL unavailable -->
            <div id="detail-fallback" style="pointer-events:none; z-index:1; ${window.WEBGL_AVAILABLE ? 'display:none;' : ''}">
              <img src="${generateProductSVG(product)}" alt="${escapeHTML(product.name)}" style="max-height:460px; filter: drop-shadow(0 25px 50px rgba(0,0,0,0.8));">
            </div>
            <div class="hero-scroll-indicator" style="bottom: 1.5rem; pointer-events:none;" id="drag-hint">
              <span class="hero-scroll-text" style="font-size:0.65rem;">✦ Click & Drag to Rotate in 3D ✦</span>
            </div>
          </div>

          <!-- Right Product Information & Commerce Controls -->
          <div class="product-detail-info" style="padding: var(--space-3xl);">
            <div class="product-category" style="margin-bottom:0.5rem;">${escapeHTML(product.categoryLabel)}</div>
            <h1 class="product-name" style="font-size: clamp(2rem, 3.5vw, 2.8rem); line-height: 1.1; margin-bottom: 0.5rem;">${escapeHTML(product.name)}</h1>
            <p class="hero-tagline" style="font-size: 1.1rem; margin-bottom: 1rem;">${escapeHTML(product.tagline)}</p>

            <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1.5rem;">
              <span class="product-price" style="font-size: 2rem;">\$${product.price}</span>
              <div class="product-rating">
                ${renderStars(product.rating)}
                <span class="product-rating-count">(${product.reviewCount} Reviews)</span>
              </div>
            </div>

            <p class="product-desc" style="font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem;">${escapeHTML(product.description)}</p>

            <!-- Commerce Controls -->
            <div style="display:flex; gap: 1rem; align-items:center; margin-bottom: 2.5rem; flex-wrap: wrap;">
              <div class="qty-selector" style="display:flex; align-items:center; border:1px solid var(--glass-border); border-radius:var(--radius-pill); background:var(--glass-bg); height:54px;">
                <button class="qty-btn" id="detail-qty-minus" aria-label="Decrease quantity" style="width:44px;font-size:1.2rem;background:none;border:none;color:var(--text-primary);cursor:pointer;">−</button>
                <span class="qty-input" id="detail-qty-val" style="width:36px;text-align:center;font-weight:600;">1</span>
                <button class="qty-btn" id="detail-qty-plus" aria-label="Increase quantity" style="width:44px;font-size:1.2rem;background:none;border:none;color:var(--text-primary);cursor:pointer;">+</button>
              </div>

              <button class="btn-add-to-cart" id="detail-add-btn">
                <span>Add to Bag — \$${product.price}</span>
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
                  <span>Shipping & Returns</span>
                  <span class="accordion-icon">↓</span>
                </button>
                <div class="accordion-content">
                  <p style="padding-top: 0.5rem;">
                    Complimentary express shipping on all orders over \$150. All demo orders are delivered with recyclable bespoke packaging. Demonstrational store policy applies.
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
                    <span class="product-price">\$${p.price}</span>
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

  // Quantity controls
  let qty = 1;
  const qtyVal = document.getElementById('detail-qty-val');
  const addBtn = document.getElementById('detail-add-btn');

  document.getElementById('detail-qty-minus')?.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      if (qtyVal) qtyVal.textContent = qty;
      if (addBtn) addBtn.innerHTML = `<span>Add to Bag — \$${product.price * qty}</span>`;
    }
  });

  document.getElementById('detail-qty-plus')?.addEventListener('click', () => {
    if (qty < 10) {
      qty++;
      if (qtyVal) qtyVal.textContent = qty;
      if (addBtn) addBtn.innerHTML = `<span>Add to Bag — \$${product.price * qty}</span>`;
    }
  });

  addBtn?.addEventListener('click', () => {
    cart.addItem(product.id, qty);
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
        const fallback = document.getElementById('detail-fallback');
        if (fallback) fallback.style.display = 'none';
      } catch (e) {
        console.warn('Detail scene init error:', e);
      }
    }
  }, 250);
}

/* ==========================================================================
   18. DEMO CHECKOUT VIEW
   ========================================================================== */

function renderCheckoutView() {
  const main = document.getElementById('main-content');
  if (!main) return;

  if (window.SceneManager) {
    try { window.SceneManager.disposeScenes(); } catch (e) {}
  }

  const items = cart.getItems();
  const isEmpty = items.length === 0;
  const subtotal = cart.getSubtotal();
  const shipping = cart.getShipping();
  const total = cart.getTotal();

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
        <span class="summary-item-price">\$${product.price * item.quantity}</span>
      </div>
    `;
  });

  main.innerHTML = `
    <section class="checkout-view active" style="display:block; position:relative; z-index:1; padding-top: calc(var(--header-height) + var(--banner-height) + 2rem); padding-bottom: 5rem;">
      <div class="checkout-container">
        <div class="checkout-header">
          <a href="#/" class="checkout-back-btn">← Return to Boutique</a>
          <h1 style="font-family:var(--font-display);font-size:1.8rem;letter-spacing:var(--tracking-headings);">Private Checkout</h1>
        </div>

        <div class="checkout-demo-banner">
          <div style="font-size:1.4rem;">✦</div>
          <div>
            <strong>Interactive Demonstration Checkout Experience</strong>
            <p style="margin:2px 0 0;font-size:0.8rem;opacity:0.9;">No actual financial transaction will occur. Do not enter authentic credit cards.</p>
          </div>
        </div>

        ${isEmpty ? `
          <div class="cart-empty" style="padding: 5rem 1rem;">
            <div class="cart-empty-icon">✦</div>
            <h3 class="cart-empty-title">Your Bag is Empty</h3>
            <p class="cart-empty-desc">Please select a product from the collection before initiating checkout.</p>
            <a href="#/" class="btn-primary" style="display:inline-flex;margin-top:1rem;">Return to Store</a>
          </div>
        ` : `
          <div class="checkout-layout">
            <!-- Form Section -->
            <div class="checkout-form-container">
              <form id="demo-checkout-form" onsubmit="event.preventDefault(); completeDemoOrder();">
                <div class="checkout-form-section">
                  <h3 class="checkout-section-title">1. Guest Contact Information</h3>
                  <div class="form-group">
                    <label class="form-label" for="checkout-email">Email for Order Preview</label>
                    <input type="email" id="checkout-email" class="form-input" placeholder="connoisseur@aurevia.com" required value="guest.client@aurevia.com">
                  </div>
                </div>

                <div class="checkout-form-section">
                  <h3 class="checkout-section-title">2. Shipping Destination</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="checkout-first">First Name</label>
                      <input type="text" id="checkout-first" class="form-input" required value="Eleanor">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="checkout-last">Last Name</label>
                      <input type="text" id="checkout-last" class="form-input" required value="Vance">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="checkout-address">Delivery Address</label>
                    <input type="text" id="checkout-address" class="form-input" required value="740 Park Avenue, Suite 12B">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="checkout-city">City</label>
                      <input type="text" id="checkout-city" class="form-input" required value="New York">
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="checkout-postal">Postal Code</label>
                      <input type="text" id="checkout-postal" class="form-input" required value="10021">
                    </div>
                  </div>
                </div>

                <div class="checkout-form-section">
                  <h3 class="checkout-section-title">3. Simulated Payment Token</h3>
                  
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
                    ✦ Simulated demonstration payment module. Clicking confirm generates an illustrative order receipt.
                  </p>

                  <button type="submit" class="btn-place-order" id="btn-submit-order">
                    <span>Confirm Demo Order — \$${total}</span>
                  </button>
                </div>
              </form>
            </div>

            <!-- Order Summary Box -->
            <div class="checkout-summary-box">
              <h3 class="checkout-section-title">Order Summary (${cart.getItemCount()} ${cart.getItemCount() === 1 ? 'item' : 'items'})</h3>
              <div class="summary-items-list">${summaryItemsHTML}</div>

              <div class="cart-summary-row">
                <span>Merchandise Subtotal</span>
                <span>\$${subtotal}</span>
              </div>
              <div class="cart-summary-row">
                <span>White-Glove Express Shipping</span>
                <span>${shipping === 0 ? 'Complimentary' : '$' + shipping}</span>
              </div>
              <div class="cart-summary-row total">
                <span>Estimated Total</span>
                <span class="price">\$${total}</span>
              </div>
            </div>
          </div>
        `}
      </div>
    </section>
  `;

  renderFooter();
}

function completeDemoOrder() {
  const container = document.querySelector('.checkout-container');
  if (!container) return;

  const total = cart.getTotal();
  const orderNumber = 'AUR-' + Math.floor(100000 + Math.random() * 900000);

  container.innerHTML = `
    <div style="text-align:center; padding: 5rem 1.5rem; max-width: 600px; margin: 0 auto; background: var(--glass-bg); border: 1px solid var(--accent-champagne); border-radius: var(--radius-xl);" class="glass">
      <div style="font-size:3rem; color:var(--accent-champagne); margin-bottom:1rem;">✦</div>
      <h2 style="font-family:var(--font-display); font-size:2.4rem; letter-spacing:var(--tracking-headings); margin-bottom:0.5rem;">Order Confirmed</h2>
      <p style="color:var(--accent-champagne); letter-spacing:0.2em; text-transform:uppercase; font-size:0.8rem; margin-bottom:1.5rem;">Order #${orderNumber}</p>
      
      <p style="color:var(--text-secondary); line-height:1.7; margin-bottom:2rem;">
        Thank you for testing the Aurevia Demonstration Store. In a production environment, your confirmation details and tracking would be dispatched immediately.
      </p>

      <div style="background:rgba(255,255,255,0.03); border-radius:var(--radius-md); padding:1.25rem; margin-bottom:2rem; font-size:0.85rem; color:var(--text-muted);">
        Demo Order Value: <strong style="color:var(--text-primary); font-size:1.1rem;">\$${total}</strong> · No credit card charged
      </div>

      <a href="#/" class="btn-primary" style="display:inline-flex;">Return to Boutique</a>
    </div>
  `;

  cart.clear();
  showToast('Order Confirmed', `Order #${orderNumber} registered`);
}
window.completeDemoOrder = completeDemoOrder;

/* ==========================================================================
   19. SCROLL REVEAL OBSERVER
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
   20. LUXURY CUSTOM CURSOR
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
   21. OVERLAYS & EVENT HANDLERS
   ========================================================================== */

function closeAllOverlays() {
  closeCart();
  closeSearch();
  closeMobileNav();
}

function initGlobalListeners() {
  window.addEventListener('cart-updated', () => {
    updateCartCount();
    if (AppState.cartOpen) renderCartDrawer();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllOverlays();
  });
}

/* ==========================================================================
   22. BOOTSTRAP APPLICATION
   ========================================================================== */

function boot() {
  renderHeader();
  renderMobileNav();
  renderCartDrawer();
  renderSearchOverlay();

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
