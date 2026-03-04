import { OrderStatus } from '@prisma/client'
import { LedgerService } from '../ledger/ledger.service'
import { OrderRepository } from './order.repository'
import { RetailRepository } from '../retail/retail.repository'
import { UserRepository } from '../user/user.repository'
import { AuditRepository } from '../audit/audit.repository'

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private retailRepo: RetailRepository,
    private userRepo: UserRepository,
    private auditRepo: AuditRepository,
    private ledgerService: LedgerService,
  ) {}

  async createOrder(productId: string, buyerId: string) {
    const product = await this.retailRepo.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    if (product.status !== 'active') {
      throw new Error('Product is not available')
    }

    const buyer = await this.userRepo.findById(buyerId)

    if (!buyer) {
      throw new Error('Buyer not found')
    }

    if (buyer.role !== 'buyer') {
      throw new Error('Only buyers can create orders')
    }

    if (product.sellerId === buyerId) {
      throw new Error('Cannot buy your own product')
    }

    const order = await this.orderRepo.create({
      buyerId: buyerId,
      sellerId: product.sellerId,
      productId: productId,
    })

    await this.auditRepo.create({
      entityType: 'Order',
      entityId: order.id,
      action: 'ORDER_CREATED',
      actorId: buyerId,
    })

    return order
  }

  async confirmOrder(orderId: string, buyerId: string) {
    const order = await this.orderRepo.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.buyerId !== buyerId) {
      throw new Error('Forbidden')
    }

    if (order.status !== OrderStatus.created) {
      throw new Error('Order cannot be confirmed')
    }

    const product = await this.retailRepo.findById(order.productId)

    if (!product) {
      throw new Error('Product not found')
    }

    const escrowUser = await this.userRepo.findByEmail('escrow@shopkeeper.system')

    if (!escrowUser) {
      throw new Error('Escrow user not found')
    }

    await this.orderRepo.updateStatus(orderId, OrderStatus.confirmed)

    await this.ledgerService.freezeFunds(
      buyerId,
      orderId,
      product.price,
      product.currency,
      escrowUser.id,
    )

    return this.orderRepo.findById(orderId)
  }

  async completeOrder(orderId: string, actorId: string) {
    const order = await this.orderRepo.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== OrderStatus.funds_frozen) {
      throw new Error('Order cannot be completed')
    }

    const actor = await this.userRepo.findById(actorId)

    if (!actor) {
      throw new Error('Actor not found')
    }

    if (actor.role !== 'admin') {
      throw new Error('Only admin can complete order')
    }

    await this.orderRepo.updateStatus(order.id, OrderStatus.confirmed)

    await this.ledgerService.releaseFunds(
      order.sellerId,
      order.id,
      order.product.price,
      order.product.currency,
      'ESCROW_ACCOUNT',
      'PLATFORM_ACCOUNT',
    )

    await this.auditRepo.create({
      entityType: 'Order',
      entityId: orderId,
      action: 'ORDER_COMPLETED',
      actorId: actorId,
    })

    return this.orderRepo.findById(orderId)
  }
}
