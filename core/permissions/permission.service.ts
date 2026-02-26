// permission.service.ts

import { User } from "@/entities/user/types"
import { Order } from "@/entities/order/types"

export class PermissionService {

  // --- ROLE CHECKS ---

  static isAdmin(user: User): boolean {
    return user.role === "admin"
  }

  static isTrustedSeller(user: User): boolean {
    return user.role === "seller" && user.trustLevel === "trusted"
  }

  static isSeller(user: User): boolean {
    return user.role === "seller"
  }

  static isBuyer(user: User): boolean {
    return user.role === "buyer"
  }

  // --- ORDER ACTIONS ---

  static canCancelPreorder(user: User, order: Order): boolean {
    if (!order) return false
    if (this.isAdmin(user)) return true
    return false
  }

  static canReleaseFunds(user: User, order: Order): boolean {
    if (!order) return false

    if (this.isAdmin(user)) return true

    if (
      this.isTrustedSeller(user) &&
      order.sellerId === user.id
    ) {
      return true
    }

    return false
  }

  static canRefund(user: User, order: Order): boolean {
    if (this.isAdmin(user)) return true
    return false
  }

  static canAdminOverride(user: User): boolean {
    return this.isAdmin(user)
  }

  static canEditProduct(user: User, sellerId: string): boolean {
    if (this.isAdmin(user)) return true
    if (this.isSeller(user) && user.id === sellerId) return true
    return false
  }

}