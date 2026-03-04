import { prisma } from '../../infrastructure/db/prisma'
import { OrderStatus } from '@prisma/client'

export class OrderRepository {
  async create(data: { buyerId: string; sellerId: string; productId: string }) {
    return prisma.order.create({
      data: {
        ...data,
        status: OrderStatus.created,
      },
    })
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
    })
  }

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: {
        status: status,
      },
    })
  }
}
