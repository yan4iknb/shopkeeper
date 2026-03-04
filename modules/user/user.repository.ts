import { prisma } from '../../infrastructure/db/prisma'

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: { email: string; role: string; trustLevel: string }) {
    return prisma.user.create({
      data,
    })
  }
}
