import { prisma } from '../../infrastructure/db/prisma'

export class WithdrawalRepository {
  async create(data: { userId: string; amount: number; currency: string }) {
    return prisma.withdrawal.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
      },
    })
  }

  async findById(id: string) {
    return prisma.withdrawal.findUnique({
      where: { id },
    })
  }

  async updateStatus(id: string, status: any) {
    return prisma.withdrawal.update({
      where: { id },
      data: { status },
    })
  }
}
