import { prisma } from '../../infrastructure/db/prisma'
import { RetailRepository } from './retail.repository'

type CreateRetailProductInput = {
  sellerId: string
  title: string
  condition: 'new' | 'used'
  price: number
  currency: string
  maxQuantityPerOrder: number
}

export class RetailService {
  private retailRepository = new RetailRepository()

  async createRetailProduct(data: CreateRetailProductInput) {
    // 1️⃣ Проверяем продавца
    const seller = await prisma.user.findUnique({
      where: { id: data.sellerId },
    })

    if (!seller) {
      throw new Error('Seller not found')
    }

    if (seller.role !== 'seller') {
      throw new Error('User is not allowed to create retail products')
    }

    // 2️⃣ Проверяем цену
    if (data.price <= 0) {
      throw new Error('Price must be greater than zero')
    }

    // 3️⃣ Проверяем валюту
    if (!data.currency || data.currency.length < 3) {
      throw new Error('Currency is invalid')
    }

    // 4️⃣ Проверяем condition
    if (!['new', 'used'].includes(data.condition)) {
      throw new Error('Invalid product condition')
    }

    // 5️⃣ Проверяем maxQuantityPerOrder
    if (data.maxQuantityPerOrder <= 0) {
      throw new Error('maxQuantityPerOrder must be greater than zero')
    }

    // 6️⃣ Создаём продукт со статусом draft
    const product = await this.retailRepository.createProduct({
      sellerId: data.sellerId,
      title: data.title,
      condition: data.condition,
      price: data.price,
      currency: data.currency,
      maxQuantityPerOrder: data.maxQuantityPerOrder,
      status: 'draft',
    })

    // 7️⃣ В будущем здесь будет AuditLog
    // await prisma.auditLog.create(...)

    return product
  }
}
