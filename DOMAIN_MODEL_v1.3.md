# SHOPKEEPER DOMAIN MODEL v1.3

Last Update: 01.03.2026

---

## Core Philosophy

Hybrid architecture:

Retail = Escrow-controlled marketplace  
Wholesale = Public B2B lot exchange (no escrow)  
Wholesale Premium = Manual Escrow Guarantee Module

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
- maxQuantityPerOrder required
- No public stock tracking
- Used retail requires moderation approval before activation

---

# Wholesale Module (Standard – Public Lot Exchange)

WholesaleOffer:
- id: UUID
- sellerId
- modelName
- condition: new | used
- location
- quantityAvailable (required, > 0)
- description
- expiresAt (createdAt + 72h)
- status: active | expired | suspended
- createdAt
- updatedAt

WholesalePriceTier:
- id: UUID
- wholesaleOfferId
- minQuantity
- pricePerUnit

Rules:
- Wholesale offers auto-expire after 72 hours
- No manual admin confirmation required
- Publicly visible without login
- No escrow support
- No stock reservation
- quantityAvailable required
- Max 3 price tiers per offer
- minQuantity must:
    - be > 0
    - be ≤ quantityAvailable
    - be strictly increasing
- pricePerUnit must:
    - be > 0
    - decrease or remain equal as quantity increases

Wholesale model = dynamic lot-based exchange.
Seller page acts as structured price list.

---

# Wholesale Premium Guarantee Module

Premium Guarantee is:

- Manual
- Admin-approved
- Limited by exposure
- High-risk controlled
- Commission-based (4–6%)
- Rare instrument (not mass-enabled)

WholesaleGuaranteeRequest:
- id
- wholesaleOfferId
- buyerId
- sellerId
- requestedAmount
- proposedFeePercent
- status:
    - pending_review
    - approved
    - rejected

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
- Each deal manually approved by admin
- Exposure limits must be enforced
- Commission retained as platform income
- Platform acts as agent, not seller
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
- Escrow applies only to Retail products
- Wholesale Standard bypasses Order system
- Wholesale Premium uses separate EscrowDeal entity

---

# System Invariants

1. Retail products must define maxQuantityPerOrder
2. Used retail requires at least one image
3. Used retail requires moderation before activation
4. Wholesale offers auto-expire after 72h
5. Standard Wholesale has no escrow integration
6. Premium Guarantee requires manual admin approval
7. Exposure limits must be enforced
8. Admin override always possible