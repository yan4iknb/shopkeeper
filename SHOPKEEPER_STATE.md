
# SHOPKEEPER STATE FILE

Last Update: 27.02.2026

---

## Project Vision

Centralized escrow-controlled high-tech marketplace
with hybrid B2C retail and B2B wholesale exchange model.

Retail builds trust.
Wholesale builds liquidity.
Premium Guarantee monetizes trust in B2B.

---

# Global Structure

- New (Retail)
- Used (Retail)
- Used (Wholesale Exchange)
- Used (Wholesale Premium Guarantee)

Retail = Escrow-controlled marketplace  
Wholesale = Contact-based B2B exchange  
Wholesale Premium = Manual Escrow Guarantee Module

---

# Used Module Architecture

## Used Retail

- Escrow-controlled
- Mandatory image
- maxQuantityPerOrder required
- Optional badge: "Прошёл предпродажную подготовку"
- Payment through platform

---

## Used Wholesale (Standard)

- No escrow
- Contact-only
- 72h expiration
- Multi-model batches
- Free in MVP

---

## Used Wholesale Premium (Guarantee)

- Manual activation only
- Admin approval required
- Trusted sellers only
- 4–6% commission
- Exposure limits
- Separate EscrowDeal entity
- Three-party agreement required
- Platform acts as agent
- Not automatic
- Not mass-enabled

Philosophy:
Premium financial instrument for selected B2B deals.

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

Phase 4 – Database integration + Used module structural expansion
Premium Guarantee logically defined (future implementation).
