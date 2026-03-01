# SHOPKEEPER STATE FILE

Last Update: 01.03.2026

---

## Project Vision

High-tech hybrid marketplace:

Retail builds trust  
Wholesale builds liquidity  
Premium monetizes selective B2B trust  
Promotion monetizes visibility  
Notification system drives engagement

---

# Global Structure

- Retail (Escrow)
- Wholesale (Public Lot Exchange)
- Wholesale Premium (Manual Escrow)
- Promotion Layer
- Notification & Push Layer

---

# Used Retail

- Escrow-controlled
- Mandatory image
- Moderation required
- maxQuantityPerOrder required

Risk: Quality risk

---

# Wholesale (Standard)

- Public visibility
- quantityAvailable required
- Up to 3 price tiers
- 72h expiration
- No escrow
- No stock reservation

Risk: Counterparty risk

---

# Promotion Layer

- boost / featured / pinned
- Time-limited
- Visibility control
- Sorting influence only

Monetization path:
Phase 1 – Manual
Phase 2 – Paid boost
Phase 3 – Automated purchase

---

# Notification & Push Layer

Implemented:
- Notification entity
- PushSubscription
- ModelSubscription
- SellerSubscription
- UserNotificationSettings

Architecture:
Event → NotificationService → 
  - Save notification
  - Send push
  - Respect user settings

Future:
- Analytics
- Batch sending
- Admin notification control

---

# Wholesale Premium

- Trusted sellers only
- Manual approval
- Exposure control
- 4–6% commission
- Rare instrument

Risk: Financial

---

# Current Phase

Phase 6 – Platform Infrastructure Stabilized:

✔ Wholesale v1
✔ Promotion system
✔ Notification system
✔ Push-ready architecture
✔ Used moderation defined

Next Phase:
Service layer implementation
Event-driven architecture