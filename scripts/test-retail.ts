import { RetailService } from '../modules/retail/retail.service'
console.log('DATABASE_URL:', process.env.DATABASE_URL)
import 'dotenv/config'
import { RetailRepository } from '../modules/retail/retail.repository'
import { prisma } from '../infrastructure/db/prisma'

async function main() {
  const retailRepo = new RetailRepository()

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

  const retailService = new RetailService()

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
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
