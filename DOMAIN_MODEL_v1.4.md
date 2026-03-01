# SHOPKEEPER DOMAIN MODEL v1.4

Last Update: 01.03.2026

---

## Core Philosophy

Hybrid architecture:

Retail = Escrow-controlled marketplace  
Wholesale = Public B2B lot exchange  
Wholesale Premium = Manual Escrow Guarantee Module  

Promotion Layer = Paid visibility engine (Retail + Wholesale)

---

# Roles

UserRole:
- buyer
- seller
- trusted_seller
- admin

TrustLevel:
- normal
- trusted
- suspended

Only trusted sellers may be eligible for Premium Guarantee.

---

# Product (Retail)

Product:
- id: UUID
- sellerId
- type: retail
- condition: new | used
- title_original
- description_original
- original_language: ru | en
- title_ru
- description_ru
- title_en
- description_en
- price
- currency
- maxQuantityPerOrder
- isPreSalePrepared (used retail only)
- status: draft | active | suspended | archived
- createdAt
- updatedAt

ProductImage:
- id
- productId
- url
- isPrimary
- createdAt

Rules:
- Used retail must contain at least one image
- Used retail requires moderation before activation
- maxQuantityPerOrder required
- No public stock tracking

---

# Wholesale Module (Standard – Public Lot Exchange)

WholesaleOffer:
- id: UUID
- sellerId
- modelName
- condition: new | used
- location
- quantityAvailable (>0)
- description
- expiresAt (createdAt + 72h)
- status: active | expired | suspended
- createdAt
- updatedAt

WholesalePriceTier:
- id
- wholesaleOfferId
- minQuantity
- pricePerUnit

Rules:
- Auto-expire after 72h
- Public visibility (no login required)
- No escrow
- No stock reservation
- Max 3 price tiers
- minQuantity must be increasing
- minQuantity ≤ quantityAvailable
- pricePerUnit must decrease or stay equal

Wholesale model = dynamic lot-based exchange  
Seller page = structured price list

---

# Promotion Module (Retail + Wholesale)

Promotion:
- id
- entityType: product | wholesale
- entityId
- sellerId
- promotionType:
    - boost
    - featured
    - pinned
- startsAt
- expiresAt
- isActive
- createdAt

Rules:
- Promotion does NOT modify original entity data
- Promotion affects visibility & sorting only
- Expired promotion must not affect ranking
- Multiple promotions allowed historically
- Active promotion must be time-valid (now between startsAt and expiresAt)

Sorting logic example:
1. Active promotions first
2. Then by promotionType priority
3. Then by createdAt DESC

---

# Wholesale Premium Guarantee

Premium is:
- Manual
- Admin-approved
- Exposure-limited
- Commission-based (4–6%)
- Rare financial instrument

WholesaleGuaranteeRequest:
- id
- wholesaleOfferId
- buyerId
- sellerId
- requestedAmount
- proposedFeePercent
- status: pending_review | approved | rejected

WholesaleEscrowDeal:
- id
- wholesaleOfferId
- buyerId
- sellerId
- amount
- guaranteeFeePercent
- buyerAgreementAcceptedAt
- sellerAgreementAcceptedAt
- status:
    - created
    - funds_frozen
    - shipped
    - delivered
    - released
    - disputed
    - refunded

Rules:
- Only trusted sellers eligible
- Manual admin approval required
- Exposure limits enforced
- Platform acts as agent
- Not automatic
- Not default

---

# Order (Retail Only)

Order:
- id
- buyerId
- sellerId
- productId
- status:
    - created
    - funds_frozen
    - awaiting_admin_review
    - approved
    - rejected
    - cancelled_by_admin
    - completed

Rules:
- Escrow applies only to Retail
- Wholesale Standard bypasses Order
- Premium uses separate EscrowDeal

---

# System Invariants

1. Retail products must define maxQuantityPerOrder
2. Used retail requires image + moderation
3. Wholesale auto-expires after 72h
4. Standard Wholesale has no escrow
5. Premium requires manual approval
6. Exposure limits enforced
7. Promotion never alters core entity data
8. Admin override always possible