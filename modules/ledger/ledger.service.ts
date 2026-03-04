;```ts
import { LedgerRepository } from './ledger.repository'
import { WalletRepository } from '../wallet/wallet.repository'

export class LedgerService {
  constructor(
    private ledgerRepo: LedgerRepository,
    private walletRepo: WalletRepository,
  ) {}

  async freezeFunds(
    buyerId: string,
    orderId: string,
    amount: number,
    currency: string,
    escrowId: string,
  ) {

    // 1️⃣ Проверяем кошелёк покупателя
    const buyerWallet = await this.walletRepo.findByUserId(buyerId)

    if (!buyerWallet) {
      throw new Error('Buyer wallet not found')
    }

    // 2️⃣ Проверяем баланс
    if (buyerWallet.balance < amount) {
      throw new Error('Insufficient balance')
    }

    // 3️⃣ Списываем деньги у покупателя
    await this.ledgerRepo.create({
      userId: buyerId,
      orderId: orderId,
      type: 'buyer_payment',
      amount: -amount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(buyerId, -amount)

    // 4️⃣ Деньги поступают на escrow
    await this.ledgerRepo.create({
      userId: escrowId,
      orderId: orderId,
      type: 'escrow_hold',
      amount: amount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(escrowId, amount)
  }

  async releaseFunds(
    sellerId: string,
    orderId: string,
    amount: number,
    currency: string,
    escrowId: string,
    platformId: string,
  ) {

    const commissionRate = 0.05

    const commission = amount * commissionRate
    const sellerAmount = amount - commission

    // 1️⃣ Проверяем escrow кошелёк
    const escrowWallet = await this.walletRepo.findByUserId(escrowId)

    if (!escrowWallet) {
      throw new Error('Escrow wallet not found')
    }

    if (escrowWallet.balance < amount) {
      throw new Error('Escrow balance insufficient')
    }

    // 2️⃣ Деньги уходят с escrow
    await this.ledgerRepo.create({
      userId: escrowId,
      orderId: orderId,
      type: 'escrow_release',
      amount: -amount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(escrowId, -amount)

    // 3️⃣ Выплата продавцу
    await this.ledgerRepo.create({
      userId: sellerId,
      orderId: orderId,
      type: 'seller_payout',
      amount: sellerAmount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(sellerId, sellerAmount)

    // 4️⃣ Комиссия платформы
    await this.ledgerRepo.create({
      userId: platformId,
      orderId: orderId,
      type: 'platform_commission',
      amount: commission,
      currency: currency,
    })

    await this.walletRepo.updateBalance(platformId, commission)
  }
}
```
