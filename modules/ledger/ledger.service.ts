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
    escrowUserId: string,
  ) {
    const buyerWallet = await this.walletRepo.findByUserId(buyerId)

    if (!buyerWallet) {
      throw new Error('Buyer wallet not found')
    }

    const escrowWallet = await this.walletRepo.findByUserId(escrowUserId)

    if (!escrowWallet) {
      throw new Error('Escrow wallet not found')
    }

    // списание у buyer
    await this.ledgerRepo.create({
      userId: buyerId,
      orderId: orderId,
      type: 'buyer_payment',
      amount: -amount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(buyerId, -amount)

    // перевод в escrow
    await this.ledgerRepo.create({
      userId: escrowUserId,
      orderId: orderId,
      type: 'escrow_hold',
      amount: amount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(escrowUserId, amount)
  }

  async releaseFunds(
    sellerId: string,
    orderId: string,
    amount: number,
    currency: string,
    escrowUserId: string,
    platformUserId: string,
  ) {
    const commissionRate = 0.05

    const commission = amount * commissionRate
    const sellerAmount = amount - commission

    // списываем с escrow
    await this.ledgerRepo.create({
      userId: escrowUserId,
      orderId: orderId,
      type: 'escrow_release',
      amount: -amount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(escrowUserId, -amount)

    // выплата seller
    await this.ledgerRepo.create({
      userId: sellerId,
      orderId: orderId,
      type: 'seller_payout',
      amount: sellerAmount,
      currency: currency,
    })

    await this.walletRepo.updateBalance(sellerId, sellerAmount)

    // комиссия платформы
    await this.ledgerRepo.create({
      userId: platformUserId,
      orderId: orderId,
      type: 'platform_commission',
      amount: commission,
      currency: currency,
    })

    await this.walletRepo.updateBalance(platformUserId, commission)
  }
}
