# Industrial Wholesale Catalog - Design Guidelines

## Design Approach
**Reference-Based Hybrid:** Drawing from elevated B2B platforms (Alibaba Business, Grainger, ThomasNet) combined with Material Design principles for data-heavy sections. Prioritize trust signals, efficient product discovery, and professional aesthetics.

## Core Design Principles
1. **Professional Credibility:** Clean, structured layouts with ample whitespace
2. **Visual Hierarchy:** Clear distinction between product imagery and specifications
3. **Trust Building:** Prominent placement of certifications, quality badges, delivery guarantees
4. **Efficient Navigation:** Multi-level categorization with persistent filters

---

## Typography
- **Primary Font:** Inter or Roboto (professional, readable at all sizes)
- **Headings:** 600-700 weight, tight letter-spacing for impact
- **Product Titles:** 500 weight, 18-20px
- **Specs/Pricing:** 400 weight, 14-16px, tabular numbers for alignment
- **Body Text:** 400 weight, 16px, 1.6 line-height

## Layout System
**Spacing Primitives:** Tailwind units 4, 6, 8, 12, 16, 24 (p-4, gap-6, py-12, etc.)
**Grid Structure:** 12-column responsive grid
**Containers:** max-w-7xl for main content, max-w-6xl for product grids

---

## Component Library

### Navigation
**Primary Header:**
- Logo left, search bar center (prominent, 50% width on desktop)
- Account/cart icons right
- Secondary navigation below: Categories, Bulk Orders, Certifications, Delivery, Contact

**Category Mega Menu:**
- Multi-level dropdown with images for main categories
- Quick filters visible on hover

### Hero Section
**Full-width hero (70vh)** with high-quality industrial environment photography showing:
- Warehouse/manufacturing setting OR product usage in professional context
- Overlay gradient (dark bottom fade) for text legibility
- **Hero Content (left-aligned, bottom-third):**
  - Large headline: "Premium Industrial Supplies" 
  - Subheading highlighting key values: "Wholesale Pricing • Fast Delivery • Certified Quality"
  - Two CTAs with blurred backgrounds: Primary "Browse Catalog", Secondary "Request Quote"
  - Trust badges strip below CTAs: ISO certified, Fast shipping icon, Secure payment

### Product Grid Section
**4-column desktop (lg:grid-cols-4), 2-column tablet, 1-column mobile**

**Product Card Structure:**
- Square product image (1:1 ratio) with subtle border
- Category tag (top-left overlay on image)
- Product title (2-line truncate)
- SKU number (small, muted text)
- Price display: Bulk pricing tiers (1-99, 100-499, 500+)
- Stock status badge (In Stock/Low Stock with color coding)
- Quick view icon on hover
- Add to cart button (full-width at bottom)

### Filter Sidebar (Desktop Left Column)
**Sticky positioning, 25% width:**
- Category tree (collapsible)
- Price range slider
- Stock availability toggles
- Certifications checkboxes
- Manufacturer multi-select
- Clear all filters button

### Trust Elements Section
**3-column grid below hero:**
- Certified Quality (badge icon + text)
- Fast Delivery (truck icon + "2-3 Day Shipping")
- Wholesale Pricing (discount icon + volume pricing info)

### Product Detail Page
**Two-column layout (60/40 split):**

**Left:** 
- Large image gallery (main image + 4-5 thumbnails below)
- Zoom on hover functionality

**Right:**
- Product title (large)
- SKU, Category breadcrumb
- Certification badges row
- Pricing table (tiered structure, highlighted savings)
- Quantity selector with min order quantity
- Add to cart + Request quote buttons
- Specifications table (collapsible sections)
- Delivery estimate calculator
- Related products carousel below

### Admin Dashboard (Separate Design Context)
**Sidebar Navigation (left, 240px):**
- Logo top
- Dashboard, Products, Orders, Analytics, Settings menu items
- Compact, icon + label format

**Main Content Area:**
- Stats cards (4-column): Total Orders, Revenue, Active Products, Pending Orders
- Data tables with sorting, filtering, pagination
- Chart widgets (line graphs for sales trends)
- Action buttons consistently top-right of sections

### Footer
**4-column layout:**
- Company info + contact
- Product categories quick links
- Customer service (returns, shipping, FAQ)
- Certifications display + payment methods

---

## Images Section

**Hero Image:**
- **Type:** Professional industrial warehouse or manufacturing floor
- **Treatment:** Wide-angle shot, bright lighting, organized environment conveying professionalism
- **Dimensions:** 1920x1080 minimum, landscape orientation
- **Placement:** Full-width background, dark gradient overlay bottom 40%

**Product Images:**
- **Style:** Clean white/neutral backgrounds, consistent lighting
- **Angles:** Multiple views per product (front, side, detail shots)
- **Quality:** High-resolution, sharp focus on product details

**Category Section Images:**
- **Usage:** Header images for category landing pages
- **Style:** Environmental shots showing products in use/context
- **Treatment:** Subtle overlays for text readability

**Trust/Certification Graphics:**
- ISO logos, industry certifications, payment security badges
- Delivery partner logos
- Quality guarantee seals

---

## Animations
**Minimal, purposeful only:**
- Product card lift on hover (subtle shadow increase)
- Filter sidebar smooth expand/collapse
- Cart icon bounce on item add
- Loading states for data-heavy operations (dashboard)

---

**Design Distinction:** This avoids generic e-commerce patterns by emphasizing B2B-specific needs: bulk pricing prominence, certification trust signals, technical specifications accessibility, and professional industrial imagery over lifestyle photography.