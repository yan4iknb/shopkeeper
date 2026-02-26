# SHOPKEEPER DOMAIN MODEL v1.0

## 1. Core Philosophy

Shopkeeper is a centralized escrow-controlled marketplace.
All financial authority belongs to Admin.
System must support trust escalation for sellers.

---

# 2. Roles

## UserRole
- buyer
- seller
- trusted_seller
- admin

## TrustLevel
- normal
- trusted
- suspended

A seller may be upgraded to trusted.
Admin can change trust level at any time.

---

# 3. User Entity

User:
- id: UUID
- email
- role: UserRole
- trustLevel: TrustLevel
- isActive: boolean
- createdAt
- updatedAt

Rules:
- Only admin can change trustLevel
- Only admin can suspend users

---

# 4. Product Entity

Product:
- id: UUID
- sellerId
- title
- description
- price
- currency
- isPreorder: boolean
- status:
    - draft
    - active
    - suspended
    - archived
- createdAt
- updatedAt

Rules:
- Only seller or admin can edit product
- Admin can suspend product

---

# 5. Order Entity

Order:
- id: UUID
- buyerId
- sellerId
- productId
- type:
    - standard
    - preorder
- status:
    - created
    - funds_frozen
    - awaiting_admin_review
    - approved
    - rejected
    - cancelled_by_admin
    - completed
- createdAt
- updatedAt

Rules:
- Order status changes only through Order Engine
- No manual DB modification allowed

---

# 6. Payment Entity

Payment:
- id: UUID
- orderId
- amount
- currency
- provider
- providerReferenceId
- status:
    - initiated
    - frozen
    - released
    - refunded
    - failed
- frozenAt
- releasedAt
- refundedAt

Rules:
- Payment status must reflect provider state
- Payment is independent but linked to Order

---

# 7. Escrow Logic

Standard Order Flow:

1. Buyer creates order
2. Payment initiated
3. Funds frozen
4. Order status → funds_frozen
5. Seller confirms readiness
6. Order → awaiting_admin_review
7. Admin approves
8. Funds released
9. Order → completed

Preorder Flow:

1. Buyer creates preorder
2. Funds frozen
3. Order → funds_frozen
4. Await delivery confirmation
5. Admin decides:
    - approve → release funds
    - reject → refund
    - cancel → cancelled_by_admin

---

# 8. Permission Rules (High Level)

Only admin:
- cancel preorder
- release funds (default)
- refund funds
- override any status
- modify trust level

Trusted seller:
- may release funds if granted release permission

Normal seller:
- cannot release funds
- cannot cancel preorder

Buyer:
- cannot cancel preorder
- cannot release funds

---

# 9. Invariants (System Guarantees)

1. Funds cannot be released unless status = awaiting_admin_review
2. Funds cannot be refunded after release
3. Preorder cannot be cancelled by seller
4. Admin override always possible
5. Order must always have exactly one Payment

---

# 10. Future Scalability Hooks

- Multiple payment providers
- Arbitration module
- Partial refund support
- Multi-admin hierarchy
- Automated trust scoring