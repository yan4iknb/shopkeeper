# SHOPKEEPER STATE FILE

Last Update: 05.03.2026

---

# Project Vision

High-tech hybrid marketplace:

Retail builds trust
Wholesale builds liquidity
Premium monetizes selective B2B trust
Promotion monetizes visibility
Notification system drives engagement

---

# Backend Infrastructure Stabilized

Stack:

Node 20
Yarn
Prisma 6.19.2
PostgreSQL
TypeScript
tsx runner

Prisma Configuration:

Prisma 6 stable engine
Singleton Prisma Client
Clean migration history
Binary engine
Stable DB connection

---

# Current Project Architecture

Project structure:

shopkeeper
│
├ app
│ ├ app.bootstrap.ts
│ └ app.container.ts
│
├ infrastructure
│ ├ db
│ │ └ prisma.ts
│ │
│ └ events
│ └ event-bus.ts
│
├ modules
│ ├ audit
│ ├ ledger
│ ├ order
│ │ ├ order.repository.ts
│ │ ├ order.service.ts
│ │ ├ order.events.ts
│ │ └ order.state.ts
│ │
│ ├ retail
│ ├ user
│ ├ wallet
│ └ withdrawal
│
├ prisma
│ ├ schema.prisma
│ └ migrations
│
└ scripts
└ test-retail.ts

Architecture type:

Modular Monolith

Service Flow:

Scripts
↓
Bootstrap
↓
App Container
↓
Services
↓
Repositories
↓
Prisma

---

# Retail v1 Implemented

Architecture:

Prisma → RetailRepository → RetailService → Script

Implemented:

createRetailProduct()
publishProduct()

Validation:

seller validation
price validation
condition validation
maxQuantityPerOrder required

Product lifecycle:

draft → active

Additional:

ProductImage relation
AuditLog integration

Audit events:

PRODUCT_PUBLISHED

---

# Order System v1 Implemented

Architecture:

OrderRepository → OrderService

Implemented:

createOrder()
confirmOrder()

Order validation:

buyer role check
cannot buy own product
product status validation

Order lifecycle:

created

Escrow logic started

---

# Escrow Ledger System

Wallet system active

Ledger entries:

freezeFunds()

Operations:

Buyer Wallet
↓
Escrow Wallet

LedgerEntry table used for double-entry accounting

Wallet operations:

createWallet()
updateBalance()

---

# Event System Introduced

Infrastructure:

EventBus

Location:

infrastructure/events/event-bus.ts

Order events:

ORDER_CREATED
ORDER_CONFIRMED
ORDER_COMPLETED

Purpose:

Decouple services from listeners.

Future listeners:

Audit
Notifications
Analytics
Webhooks

---

# Application Bootstrap Layer

New application core introduced.

Location:

app/app.bootstrap.ts
app/app.container.ts

Purpose:

Centralized dependency container
Service initialization
Module event registration

System boot flow:

bootstrapApp()
↓
register module events
↓
create service container

---

# System State

Database synced
Migrations clean
Repository layer stable
Service layer stable
Audit trail active
Escrow engine working

---

# Current Phase

Phase 8 — Escrow Engine Initialization

Working:

Retail publish flow
Order creation flow
Escrow freeze flow
Ledger accounting entries
Wallet balance updates

---

# Next Development Targets

Order Status Machine

created
confirmed
funds_frozen
completed
cancelled
refunded

---

# Planned Additions

DB transactions for money operations

Double-entry ledger enforcement

Notification module

Wholesale module

Analytics module

Promotion system
