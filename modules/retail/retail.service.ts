import { AuditRepository } from '../audit/audit.repository'
import { UserRepository } from '../user/user.repository'
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
  constructor(
    private repo: RetailRepository,
    private userRepo: UserRepository,
    private auditRepo: AuditRepository,
  ) {}

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
    const product = await this.repo.createProduct({
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

  async publishProduct(productId: string, actorId: string) {
    const product = await this.repo.findById(productId)
    if (!product) {
      throw new Error('Product not found')
    }

    const actor = await this.userRepo.findById(actorId)
    if (!actor) {
      throw new Error('Actor not found')
    }

    // Проверка прав
    const isOwner = product.sellerId === actorId
    const isAdmin = actor.role === 'admin'

    if (!isOwner && !isAdmin) {
      throw new Error('No permission to publish this product')
    }

    // Бизнес-валидация
    if (!product.title) throw new Error('Title required')
    if (product.price <= 0) throw new Error('Invalid price')
    if (!product.currency) throw new Error('Currency required')
    if (product.maxQuantityPerOrder <= 0) throw new Error('Invalid maxQuantityPerOrder')

    if (product.condition === 'used' && product.images.length === 0) {
      throw new Error('Used product requires at least one image')
    }

    const updated = await this.repo.updateStatus(productId, 'active')

    await this.auditRepo.create({
      entityType: 'Product',
      entityId: productId,
      action: 'PRODUCT_PUBLISHED',
      actorId: actorId,
    })

    return updated
  }
}
