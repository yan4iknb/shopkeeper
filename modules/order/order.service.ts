;```ts
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
    // 1️⃣ Проверяем продукт
    const product = await this.retailRepo.findById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    if (product.status !== 'active') {
      throw new Error('Product is not available')
    }

    // 2️⃣ Проверяем покупателя
    const buyer = await this.userRepo.findById(buyerId)

    if (!buyer) {
      throw new Error('Buyer not found')
    }

    if (buyer.role !== 'buyer') {
      throw new Error('Only buyers can create orders')
    }

    // 3️⃣ Нельзя покупать свой товар
    if (product.sellerId === buyerId) {
      throw new Error('Cannot buy your own product')
    }

    // 4️⃣ Создаём заказ
    const order = await this.orderRepo.create({
      buyerId: buyerId,
      sellerId: product.sellerId,
      productId: productId,
      status: 'created',
    })

    // 5️⃣ Логируем
    await this.auditRepo.create({
      entityType: 'Order',
      entityId: order.id,
      action: 'ORDER_CREATED',
      actorId: buyerId,
    })

    return order
  }

  async confirmOrder(orderId: string, actorId: string) {

    // 1️⃣ Проверяем заказ
    const order = await this.orderRepo.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== 'created') {
      throw new Error('Order cannot be confirmed')
    }

    // 2️⃣ Только buyer может подтвердить
    if (order.buyerId !== actorId) {
      throw new Error('Only buyer can confirm the order')
    }

    // 3️⃣ Меняем статус
    const updated = await this.orderRepo.updateStatus(
      orderId,
      'funds_frozen'
    )

    // 4️⃣ Замораживаем деньги (ledger + wallet)
    await this.ledgerService.freezeFunds(
      order.buyerId,
      order.id,
      order.product.price,
      order.product.currency,
      'ESCROW_ACCOUNT'
    )

    // 5️⃣ Логируем
    await this.auditRepo.create({
      entityType: 'Order',
      entityId: orderId,
      action: 'ORDER_CONFIRMED_FUNDS_FROZEN',
      actorId: actorId,
    })

    return updated
  }

  async completeOrder(orderId: string, actorId: string) {

    // 1️⃣ Проверяем заказ
    const order = await this.orderRepo.findById(orderId)

    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== 'funds_frozen') {
      throw new Error('Order cannot be completed')
    }

    // 2️⃣ Проверяем пользователя
    const actor = await this.userRepo.findById(actorId)

    if (!actor) {
      throw new Error('Actor not found')
    }

    if (actor.role !== 'admin') {
      throw new Error('Only admin can complete order')
    }

    // 3️⃣ Меняем статус
    const updated = await this.orderRepo.updateStatus(
      orderId,
      'completed'
    )

    // 4️⃣ Переводим деньги (escrow → seller + platform)
    await this.ledgerService.releaseFunds(
      order.sellerId,
      order.id,
      order.product.price,
      order.product.currency,
      'ESCROW_ACCOUNT',
      'PLATFORM_ACCOUNT'
    )

    // 5️⃣ Логируем
    await this.auditRepo.create({
      entityType: 'Order',
      entityId: orderId,
      action: 'ORDER_COMPLETED',
      actorId: actorId,
    })

    return updated
  }
}
```
