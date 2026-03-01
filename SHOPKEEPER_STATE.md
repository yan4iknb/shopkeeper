# SHOPKEEPER STATE FILE

Last Update: 01.03.2026

---

## Project Vision

Centralized escrow-controlled high-tech marketplace
with hybrid B2C retail and public B2B wholesale exchange.

Retail builds trust.
Wholesale builds liquidity.
Premium Guarantee monetizes selective trust in B2B.

---

# Global Structure

- New (Retail)
- Used (Retail – controlled & moderated)
- Wholesale (Public Lot Exchange)
- Wholesale Premium (Manual Escrow Guarantee)

Retail = Escrow-controlled marketplace  
Wholesale = Public B2B lot exchange  
Wholesale Premium = Manual Escrow Guarantee Module

---

# Used Module Architecture

## Used Retail

- Escrow-controlled
- Mandatory image
- maxQuantityPerOrder required
- Admin moderation required before activation
- Optional badge: "Прошёл предпродажную подготовку"
- Payment through platform

Risk type: Quality risk (controlled by moderation)

---

## Wholesale (Standard – Lot Exchange)

- Public visibility (no login required)
- No escrow
- Contact-only
- 72h expiration
- quantityAvailable required
- Up to 3 price tiers per offer
- Dynamic lot model
- Seller page acts as price list

Risk type: Counterparty risk (outside platform)

---

## Wholesale Premium (Guarantee)

- Manual activation only
- Admin approval required
- Trusted sellers only
- 4–6% commission
- Exposure limits
- Separate EscrowDeal entity
- Three-party agreement required
- Platform acts as agent
- Not automatic
- Rare use instrument

Risk type: Financial risk (strictly controlled)

---

# Risk Policy (Foundational Rule)

Premium Guarantee must:

- Never be automatic
- Always be manually approved
- Be limited by exposure cap
- Maintain reserve coverage
- Be treated as high-risk financial instrument

---

# Current Phase

Phase 4 – Database integration complete
Wholesale v1 (lot-based model) defined
Used Retail moderation defined
Premium Guarantee logically finalized (future implementation)