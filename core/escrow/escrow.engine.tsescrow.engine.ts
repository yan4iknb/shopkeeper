// core/escrow/escrow.engine.ts

import { Order } from "@/entities/order/types"
import { Payment } from "@/entities/payment/types"
import { User } from "@/entities/user/types"
import { PermissionService } from "@/core/permissions/permission.service"

export class EscrowEngine {

  static freezeFunds(order: Order, payment: Payment): Payment {
    if (order.status !== "created") {
      throw new Error("Funds can only be frozen for newly created orders")
    }

    return {
      ...payment,
      status: "frozen",
      frozenAt: new Date(),
    }
  }

  static releaseFunds(order: Order, payment: Payment, actor: User): Payment {

    if (!PermissionService.canReleaseFunds(actor, order)) {
      throw new Error("Permission denied to release funds")
    }

    if (order.status !== "awaiting_admin_review") {
      throw new Error("Funds can only be released after admin review stage")
    }

    if (payment.status !== "frozen") {
      throw new Error("Payment must be frozen before release")
    }

    return {
      ...payment,
      status: "released",
      releasedAt: new Date(),
    }
  }

  static refundFunds(order: Order, payment: Payment, actor: User): Payment {

    if (!PermissionService.canRefund(actor, order)) {
      throw new Error("Permission denied to refund funds")
    }

    if (payment.status !== "frozen") {
      throw new Error("Only frozen funds can be refunded")
    }

    return {
      ...payment,
      status: "refunded",
      refundedAt: new Date(),
    }
  }
}