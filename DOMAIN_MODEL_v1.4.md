# SHOPKEEPER DOMAIN MODEL v1.5

Last Update: 01.03.2026

---

## Core Philosophy

Hybrid architecture:

Retail = Escrow-controlled marketplace  
Wholesale = Public B2B lot exchange  
Wholesale Premium = Manual Escrow Guarantee Module  
Promotion Layer = Paid visibility engine  
Notification Layer = Event-driven user engagement system

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
- id
- sellerId
- type: retail
- condition: new | used
- title
- price
- currency
- maxQuantityPerOrder
- isPreSalePrepared
- status
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
- Used retail requires moderation
- maxQuantityPerOrder required
- No public stock tracking

---

# Wholesale (Public Lot Exchange)

WholesaleOffer:
- id
- sellerId
- modelName
- condition
- location
- quantityAvailable
- description
- expiresAt
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
- Public visibility
- No escrow
- No stock reservation
- Max 3 price tiers
- minQuantity increasing
- minQuantity ≤ quantityAvailable
- price decreases or stays equal

---

# Promotion Module

Promotion:
- id
- entityType (product | wholesale)
- entityId
- sellerId
- promotionType (boost | featured | pinned)
- startsAt
- expiresAt
- isActive
- createdAt

Rules:
- Does not modify entity data
- Affects sorting only
- Expired promotions ignored
- Multiple historical records allowed

---

# Notification & Push Module

Notification:
- id
- userId
- type:
    - retail_order_update
    - wholesale_new_lot
    - premium_update
    - seller_new_offer
- title
- message
- relatedEntityType
- relatedEntityId
- isRead
- createdAt

PushSubscription:
- id
- userId
- endpoint
- p256dh
- auth
- deviceType
- createdAt

UserNotificationSettings:
- userId
- retailOrderUpdates
- wholesaleNewLots
- premiumDealUpdates
- modelSubscriptionsEnabled
- sellerSubscriptionsEnabled

ModelSubscription:
- id
- userId
- modelName
- createdAt

SellerSubscription:
- id
- userId
- sellerId
- createdAt

Rules:
- Notifications are event-driven
- Push is optional per user
- Users control subscription preferences
- Promotion does not trigger notifications automatically
- Notification history retained

---

# Wholesale Premium

Manual escrow module (unchanged)

---

# Order (Retail Only)

Escrow-based system (unchanged)

---

# System Invariants

1. Retail requires maxQuantityPerOrder
2. Used retail requires image + moderation
3. Wholesale auto-expires after 72h
4. Standard Wholesale has no escrow
5. Premium requires manual approval
6. Exposure limits enforced
7. Promotion never alters entity data
8. Notification system must respect user settings
9. Admin override always possible