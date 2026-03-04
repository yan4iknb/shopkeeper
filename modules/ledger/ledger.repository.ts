import { prisma } from '../../infrastructure/db/prisma'

export class LedgerRepository {
  async create(data: {
    userId?: string
    orderId?: string
    type: string
    amount: number
    currency: string
  }) {
    return prisma.ledgerEntry.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
      },
    })
  }
}
