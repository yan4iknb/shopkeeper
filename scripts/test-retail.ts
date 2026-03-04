const ESCROW_ACCOUNT = 'ESCROW_ACCOUNT'
const PLATFORM_ACCOUNT = 'PLATFORM_ACCOUNT'

import 'dotenv/config'

import { RetailService } from '../modules/retail/retail.service'
import { RetailRepository } from '../modules/retail/retail.repository'
import { UserRepository } from '../modules/user/user.repository'
import { prisma } from '../infrastructure/db/prisma'
import { AuditRepository } from '../modules/audit/audit.repository'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

const ESCROW_USER_ID = 'ESCROW_ACCOUNT'

async function main() {
  // 1️⃣ Найдём любого пользователя (seller)
  // Создаём seller, если его нет
  let seller = await prisma.user.findFirst({
    where: { role: 'seller' },
  })

  if (!seller) {
    seller = await prisma.user.create({
      data: {
        email: 'seller@shopkeeper.test',
        role: 'seller',
        trustLevel: 'normal',
      },
    })

    console.log('👤 Создан seller:', seller)
  }

  const retailRepo = new RetailRepository()
  const userRepo = new UserRepository()
  const auditRepo = new AuditRepository()

  const retailService = new RetailService(retailRepo, userRepo, auditRepo)

  // 2️⃣ Создаём продукт через Service
  const product = await retailService.createRetailProduct({
    sellerId: seller.id,
    title: 'Antminer S21 200T',
    condition: 'new',
    price: 3200,
    currency: 'USD',
    maxQuantityPerOrder: 5,
  })
  console.log('✅ Продукт создан:', product)

  // 3️⃣ Получаем его по id
  const found = await retailRepo.findById(product.id)
  console.log('🔎 Найден продукт:', found)

  // 4️⃣ Список активных
  const activeList = await retailRepo.listActive()
  console.log('📦 Активные продукты:', activeList.length)
  // 5️⃣ Публикуем продукт
  const published = await retailService.publishProduct(product.id, seller.id)

  console.log('🚀 Опубликован:', published)

  // 6️⃣ Создаём покупателя если нет
  let buyer = await prisma.user.findFirst({
    where: { role: 'buyer' },
  })

  if (!buyer) {
    buyer = await prisma.user.create({
      data: {
        email: 'buyer@shopkeeper.test',
        role: 'buyer',
        trustLevel: 'normal',
      },
    })
    console.log('👤 Создан buyer:', buyer)
  }

  const orderRepo = new OrderRepository()
  const orderService = new OrderService(orderRepo, retailRepo, userRepo, auditRepo)

  // 7️⃣ Создаём заказ
  const order = await orderService.createOrder(published.id, buyer.id)

  console.log('🛒 Заказ создан:', order)
}

import { OrderRepository } from '../modules/order/order.repository'
import { OrderService } from '../modules/order/order.service'

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
