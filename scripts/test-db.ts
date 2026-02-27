import 'dotenv/config'

import { prisma } from '../infrastructure/db/prisma'

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'admin@shopkeeper.test',
      role: 'admin',
    },
  })

  console.log('User created:', user)

  const log = await prisma.auditLog.create({
    data: {
      entityType: 'User',
      entityId: user.id,
      action: 'USER_CREATED',
      actorId: user.id,
      metadata: { source: 'test-script' },
    },
  })

  console.log('Audit log created:', log)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })