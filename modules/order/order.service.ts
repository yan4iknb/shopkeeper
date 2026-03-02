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
}
