# SHOPKEEPER STATE FILE

## Product Vision
Centralized escrow-controlled multi-vendor marketplace.

## Roles
- buyer
- seller
- trusted_seller
- admin

## Core Rules

### Escrow
- Funds freeze automatically
- Only admin can release by default
- Trusted seller may release if granted permission
- Admin can override any process

### Preorder
- Only admin can cancel preorder
- No seller or buyer cancellation

### Payments
- Provider-based freeze
- Timer limits = provider maximum

## Architecture Strategy
- Domain-driven structure
- Permission engine centralized
- Escrow engine isolated
- No business logic in UI

## Current Phase
Phase 1 – Domain modeling

## Next Step
Implement domain entities and permission engine


## Current Phase
Phase 1 – Permission Engine implemented

## System Status
Permission engine centralized
All role logic abstracted
Admin has absolute override
Trusted seller release capability enabled