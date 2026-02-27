
# SHOPKEEPER DOMAIN MODEL v1.2

Last Update: 27.02.2026

---

## Core Philosophy

Hybrid architecture:

Retail = Escrow-controlled marketplace  
Wholesale = Contact-based B2B exchange  
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

Rules:
- Used retail must contain at least one image
- maxQuantityPerOrder required
- No public stock tracking

---

# Wholesale Module (Standard)

WholesaleOffer:
- id: UUID
- sellerId
- location
- status: active | pending_confirmation | inactive
- confirmedAt
- expiresAt
- createdAt
- updatedAt

WholesaleOfferItem:
- id: UUID
- wholesaleOfferId
- modelName
- condition

WholesalePriceTier:
- id: UUID
- wholesaleOfferItemId
- minQuantity
- pricePerUnit

Rules:
- Wholesale offers expire after 72 hours
- Manual renewal required
- No escrow support
- No stock tracking
- Max 3 price tiers per item

---

# Wholesale Premium Guarantee Module

Premium Guarantee is:

- Manual
- Admin-approved
- Limited by exposure
- High-risk controlled
- Commission-based (4–6%)

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
- Max exposure limits apply
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

# Payment

Retail:
- One Payment per Order

Wholesale Premium:
- One EscrowDeal per approved request
- Funds frozen before shipment

---

# System Invariants

1. Retail products must define maxQuantityPerOrder
2. Used retail requires at least one image
3. Wholesale offers auto-expire after 72h
4. Standard Wholesale has no escrow integration
5. Premium Guarantee requires manual admin approval
6. Exposure limits must be enforced
7. Admin override always possible
