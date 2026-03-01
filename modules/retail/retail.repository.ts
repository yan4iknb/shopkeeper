import { prisma } from '../../infrastructure/db/prisma'

export class RetailRepository {
  async createProduct(data: {
    sellerId: string
    title: string
    condition: string
    price: number
    currency: string
    maxQuantityPerOrder: number
    status?: string
  }) {
    return prisma.product.create({
      data: {
        sellerId: data.sellerId,
        type: 'retail',
        condition: data.condition,
        title: data.title,
        price: data.price,
        currency: data.currency,
        maxQuantityPerOrder: data.maxQuantityPerOrder,
        status: data.status ?? 'draft',
      },
    })
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    })
  }

  async listActive() {
    return prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
    })
  }
}
