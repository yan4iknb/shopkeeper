import { prisma } from '../../infrastructure/db/prisma'

type CreateAuditLogInput = {
  entityType: string
  entityId: string
  action: string
  actorId?: string
  metadata?: any
}

export class AuditRepository {
  async create(data: CreateAuditLogInput) {
    return prisma.auditLog.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        actorId: data.actorId,
        metadata: data.metadata,
      },
    })
  }
}
