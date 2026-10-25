# AUREVIA — Fine Fragrance & Luxury Botanical Care (US Boutique)

A high-end, human-designed luxury fragrance and skincare demonstration storefront engineered for the United States market. Features authentic 3D product presentations, the official Sketchfab 3D Perfume Model, Cloud Firestore database persistence, Firebase Authentication, location-dependent US sales tax calculation, and clean architectural design.

---

## ✦ Core Demonstration Catalog

1. **Aurevia Radiance Serum (L'Élixir Solaire)** — `$145.00`
   - *Active Compounds:* 15% Liposomal Vitamin C, Triple-weight Hyaluronate, 24K Colloidal Gold, Niacinamide.
   - *Olfactory Notes:* Solar Bergamot, Orange Blossom, Warm Sandalwood, 24K Amber.
   - *3D Model:* Official Sketchfab 3D Perfume model by ChristyMathews (CC-BY 4.0) + Three.js WebGL studio rig.
2. **Aurevia Hydration Cream (Crème Céleste)** — `$128.00`
   - *Active Compounds:* Triple Ceramide Complex (NP/AP/EOP), Cold-pressed Arctic Cloudberry, Olive Squalane.
   - *Olfactory Notes:* Frosted Cloudberry, White Cedarwood, Cashmere Musk, Bourbon Vanilla.
3. **Aurevia Botanical Cleanser (Purifiant Botanique)** — `$68.00`
   - *Active Compounds:* Ceremonial Uji Matcha (EGCG), German Chamomile Bisabolol, Phospholipid Micelles.
   - *Olfactory Notes:* Crushed Matcha Tea Leaves, Chamomile Blossoms, Clean Vetiver.
4. **Aurevia Renewal Oil (Nectar Nocturne)** — `$185.00`
   - *Active Compounds:* Patagonian Rosehip Oil, Ayurvedic Bakuchiol (2%), Virgin Moroccan Argan.
   - *Olfactory Notes:* Wild Cardamom, Damascus Night Rose, Dark Amber, Smoky Oud.

---

## ✦ Key Architecture & Enhancements

### 1. Solid Clean Luxury Architecture (Liquid Glass Removed)
- Complete elimination of glassmorphism, artificial translucent overlays, and `backdrop-filter: blur()`.
- Replaced with solid architectural surfaces (`#141416`, `#111113`, `#0d0d0f`), crisp 1px borders (`#26262a`), and natural restrained shadows (`0 4px 16px rgba(0,0,0,0.35)`).
- Natural studio lighting vignette replacing previous glow pulse animations.

### 2. United States Market Conversion
- **Monetary Precision:** All prices stored as integer cents (`priceCents`) and rendered in USD with US currency formatting (`$145.00`, `$128.00`, `$68.00`, `$185.00`).
- **50-State Sales Tax Calculation:** Real-time location-dependent US state tax calculation across all 50 states + DC (e.g. NY 8.875%, CA 7.25%, TX 6.25%, FL 6.0%, with tax-free states like OR, DE, NH, MT, AK at 0.0%).
- **Domestic Shipping Methods:**
  - *Standard Ground (3–5 business days):* `$5.99` (Complimentary on orders over `$150.00`).
  - *Express 2-Day Air:* `$14.99`.
- **US Checkout Form:** Validated US 5-digit ZIP codes (`^\d{5}(-\d{4})?$`), US state dropdown, phone formatting, and apartment/suite fields.

### 3. Sketchfab 3D Perfume Model Integration
- Integrated the official Sketchfab 3D Perfume Model for the signature perfume formulation:
  - **Model:** *"Perfume"* by **ChristyMathews** on Sketchfab
  - **License:** [Creative Commons Attribution 4.0 International (CC-BY 4.0)](http://creativecommons.org/licenses/by/4.0/)
  - **Model Link:** [https://sketchfab.com/3d-models/perfume-c66ebff390eb4790a836d2f3d5054874](https://sketchfab.com/3d-models/perfume-c66ebff390eb4790a836d2f3d5054874)
- Includes an interactive viewer switcher:
  - `[3D Perfume Model (Sketchfab)]`
  - `[Studio WebGL (Three.js)]`
  - `[Product Gallery]`
- Fully responsive with integrated attribution bar complying with CC-BY 4.0 requirements.

### 4. Firebase Authentication & Cloud Firestore Integration
- **`firebase-config.js`:** Production-ready Firebase modular SDK layer (v10) with Authentication (email/password sign-in, registration, profile sync) and Firestore order collection.
- **Resilient Fallback Mode:** Operates automatically in local-storage persistence mode if credentials have not yet been linked, so users can test immediately without setup blockers.
- **Security Rules:**
  - `firestore.rules`: Customer isolation (`request.auth.uid == userId`), public product catalog read, admin write-only.
  - `storage.rules`: Strict file type and 5MB size caps.
- **`.env.example`:** Configuration template for connecting live Firebase projects.

### 5. Private Connoisseur Privileges
- **Promotions & Discount Codes:** Enter `AUREVIA10` for 10% off or `WELCOME15` for 15% off in both Bag and Checkout.
- **Wishlist:** Private saved favorites collection with header counter and persistent state.
- **Customer Account Modal:** Direct access to client sign-in, registration, and Firestore order history.
- **Atelier Dashboard (`#/admin`):** Catalog inventory monitor, recent database orders, and live Firebase connection status.

---

## ✦ Connecting Live Firebase (Optional)

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password) and **Cloud Firestore**.
3. Copy `.env.example` to `.env` and fill in your web credentials:
   ```bash
   cp .env.example .env
   ```
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

---

## ✦ Deployment to GitHub Pages

1. In your GitHub repository settings, navigate to **Settings** → **Pages**.
2. Under **Build and deployment** → **Branch**, select `main` and folder `/ (root)`.
3. Click **Save**.
4. Live site URL: `https://zyphorix7.github.io/Preview/`
