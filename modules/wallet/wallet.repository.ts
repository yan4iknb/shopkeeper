import { prisma } from '../../infrastructure/db/prisma'

export class WalletRepository {
  async findByUserId(userId: string) {
    return prisma.wallet.findUnique({
      where: {
        userId: userId,
      },
    })
  }

  async createWallet(userId: string, currency: string) {
    return prisma.wallet.create({
      data: {
        userId: userId,
        currency: currency,
        balance: 0,
      },
    })
  }

  async updateBalance(userId: string, delta: number) {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    return prisma.wallet.update({
      where: { userId },
      data: {
        balance: wallet.balance + delta,
      },
    })
  }
}
