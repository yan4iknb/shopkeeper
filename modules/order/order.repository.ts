import { prisma } from '../../infrastructure/db/prisma'

type CreateOrderInput = {
  buyerId: string
  sellerId: string
  productId: string
  status: 'created'
}

export class OrderRepository {
  async create(data: CreateOrderInput) {
    return prisma.order.create({
      data: {
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        productId: data.productId,
        status: data.status,
      },
    })
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        product: true,
        buyer: true,
        seller: true,
      },
    })
  }

  async updateStatus(id: string, status: 'funds_frozen') {
    return prisma.order.update({
      where: { id },
      data: { status },
    })
  }
}
