import { WithdrawalRepository } from './withdrawal.repository'
import { WalletRepository } from '../wallet/wallet.repository'
import { LedgerRepository } from '../ledger/ledger.repository'

export class WithdrawalService {
  constructor(
    private withdrawalRepo: WithdrawalRepository,
    private walletRepo: WalletRepository,
    private ledgerRepo: LedgerRepository,
  ) {}

  // Создание заявки на вывод
  async requestWithdrawal(userId: string, amount: number, currency: string) {
    const wallet = await this.walletRepo.findByUserId(userId)

    if (!wallet) {
      throw new Error('Wallet not found')
    }

    if (wallet.balance < amount) {
      throw new Error('Insufficient balance')
    }

    // списываем деньги с кошелька
    await this.walletRepo.updateBalance(userId, -amount)

    await this.ledgerRepo.create({
      userId: userId,
      type: 'withdraw_request',
      amount: -amount,
      currency: currency,
    })

    // создаём заявку
    return this.withdrawalRepo.create({
      userId,
      amount,
      currency,
    })
  }

  // Подтверждение вывода админом
  async approveWithdrawal(withdrawalId: string, adminId: string) {
    const withdrawal = await this.withdrawalRepo.findById(withdrawalId)

    if (!withdrawal) {
      throw new Error('Withdrawal not found')
    }

    if (withdrawal.status !== 'pending') {
      throw new Error('Withdrawal cannot be approved')
    }

    const updated = await this.withdrawalRepo.updateStatus(withdrawalId, 'approved')

    await this.ledgerRepo.create({
      userId: withdrawal.userId,
      type: 'withdraw_approved',
      amount: 0,
      currency: withdrawal.currency,
    })

    return updated
  }

  // Отклонение вывода админом
  async rejectWithdrawal(withdrawalId: string, adminId: string) {
    const withdrawal = await this.withdrawalRepo.findById(withdrawalId)

    if (!withdrawal) {
      throw new Error('Withdrawal not found')
    }

    if (withdrawal.status !== 'pending') {
      throw new Error('Withdrawal cannot be rejected')
    }

    // возвращаем деньги пользователю
    await this.walletRepo.updateBalance(withdrawal.userId, withdrawal.amount)

    await this.ledgerRepo.create({
      userId: withdrawal.userId,
      type: 'withdraw_refund',
      amount: withdrawal.amount,
      currency: withdrawal.currency,
    })

    const updated = await this.withdrawalRepo.updateStatus(withdrawalId, 'rejected')

    return updated
  }
}
