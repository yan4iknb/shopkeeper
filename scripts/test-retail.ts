import 'dotenv/config'

import { prisma } from '../infrastructure/db/prisma'

import { RetailService } from '../modules/retail/retail.service'
import { RetailRepository } from '../modules/retail/retail.repository'

import { UserRepository } from '../modules/user/user.repository'
import { AuditRepository } from '../modules/audit/audit.repository'

import { OrderRepository } from '../modules/order/order.repository'
import { OrderService } from '../modules/order/order.service'

import { LedgerRepository } from '../modules/ledger/ledger.repository'
import { LedgerService } from '../modules/ledger/ledger.service'

import { WalletRepository } from '../modules/wallet/wallet.repository'

console.log('DATABASE_URL:', process.env.DATABASE_URL)

async function main() {
  const retailRepo = new RetailRepository()
  const userRepo = new UserRepository()
  const auditRepo = new AuditRepository()

  const walletRepo = new WalletRepository()
  const ledgerRepo = new LedgerRepository()

  const ledgerService = new LedgerService(ledgerRepo, walletRepo)

  const retailService = new RetailService(retailRepo, userRepo, auditRepo)

  const orderRepo = new OrderRepository()

  const orderService = new OrderService(
    orderRepo,
    retailRepo,
    userRepo,
    auditRepo,
    ledgerService,
  )

  // SELLER
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

  // PRODUCT
  const product = await retailService.createRetailProduct({
    sellerId: seller.id,
    title: 'Antminer S21 200T',
    condition: 'new',
    price: 3200,
    currency: 'USD',
    maxQuantityPerOrder: 5,
  })

  console.log('✅ Продукт создан:', product)

  const found = await retailRepo.findById(product.id)
  console.log('🔎 Найден продукт:', found)

  const activeList = await retailRepo.listActive()
  console.log('📦 Активные продукты:', activeList.length)

  const published = await retailService.publishProduct(product.id, seller.id)
  console.log('🚀 Опубликован:', published)

  // BUYER
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

  // SYSTEM USERS (ESCROW / PLATFORM)

  let escrowUser = await prisma.user.findUnique({
    where: { email: 'escrow@shopkeeper.system' },
  })

  if (!escrowUser) {
    escrowUser = await prisma.user.create({
      data: {
        email: 'escrow@shopkeeper.system',
        role: 'admin',
        trustLevel: 'trusted',
      },
    })
  }

  let platformUser = await prisma.user.findUnique({
    where: { email: 'platform@shopkeeper.system' },
  })

  if (!platformUser) {
    platformUser = await prisma.user.create({
      data: {
        email: 'platform@shopkeeper.system',
        role: 'admin',
        trustLevel: 'trusted',
      },
    })
  }

  // WALLETS

  let buyerWallet = await walletRepo.findByUserId(buyer.id)
  if (!buyerWallet) {
    buyerWallet = await walletRepo.createWallet(buyer.id, 'USD')
  }

  let sellerWallet = await walletRepo.findByUserId(seller.id)
  if (!sellerWallet) {
    sellerWallet = await walletRepo.createWallet(seller.id, 'USD')
  }

  let escrowWallet = await walletRepo.findByUserId(escrowUser.id)
  if (!escrowWallet) {
    escrowWallet = await walletRepo.createWallet(escrowUser.id, 'USD')
  }

  let platformWallet = await walletRepo.findByUserId(platformUser.id)
  if (!platformWallet) {
    platformWallet = await walletRepo.createWallet(platformUser.id, 'USD')
  }

  // даём деньги покупателю для теста
  await walletRepo.updateBalance(buyer.id, 10000)

  // CREATE ORDER
  const order = await orderService.createOrder(published.id, buyer.id)
  console.log('🛒 Заказ создан:', order)

  // CONFIRM ORDER (ESCROW FREEZE)
  const confirmed = await orderService.confirmOrder(order.id, buyer.id)
  console.log('💳 Средства заморожены:', confirmed)
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
