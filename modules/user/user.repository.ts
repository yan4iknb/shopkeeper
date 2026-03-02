import { prisma } from '../../infrastructure/db/prisma'

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    })
  }
}
