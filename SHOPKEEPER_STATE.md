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

# Backend Infrastructure Stabilized

### Stack

- Node 20
- Yarn
- Prisma 6.19.2
- PostgreSQL
- TypeScript
- tsx runner

### Prisma Configuration

- Prisma 6 (stable engine)
- No adapter
- No prisma.config.ts
- Binary engine
- Singleton Prisma client
- Clean migration history

---

# Retail v1 Implemented

Architecture:

Prisma → RetailRepository → RetailService → Script

Implemented:

✔ createRetailProduct()  
✔ seller validation  
✔ price validation  
✔ condition validation  
✔ mandatory maxQuantityPerOrder  
✔ status = draft on creation  
✔ ProductImage relation working  
✔ Migration with default value handling  
✔ Stable DB schema

---

# System State

Database synced  
Migrations clean  
Service layer introduced  
Business validation separated from persistence  
No direct DB calls from script

System ready for:

- publishProduct use-case
- AuditLog integration
- Order flow expansion
- Event-driven notification binding

---

# Current Phase

Phase 7 – Backend Architecture Stabilized

✔ Prisma 6 stable configuration  
✔ Service layer introduced  
✔ Retail v1 business validation implemented  
✔ Migration discipline established  
✔ Separation of concerns enforced

Next Logical Step:

- Retail publish flow
- Audit logging
- Order lifecycle logic
- Event bus introduction
