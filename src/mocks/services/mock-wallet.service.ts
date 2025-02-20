import { Injectable } from '@nestjs/common';

export interface WalletBalance {
  balance: number;
  currency: string;
}

@Injectable()
export class MockWalletService {
  private wallets: Map<string, WalletBalance> = new Map();

  constructor() {
    // Initialize some mock data
    this.wallets.set('user1', { balance: 1000, currency: 'USD' });
    this.wallets.set('user2', { balance: 500, currency: 'EUR' });
  }

  async getBalance(userId: string): Promise<WalletBalance> {
    const wallet = this.wallets.get(userId);
    if (!wallet) {
      return { balance: 0, currency: 'USD' };
    }
    return wallet;
  }

  async updateBalance(
    userId: string,
    amount: number,
    operation: 'add' | 'subtract',
  ): Promise<WalletBalance> {
    let wallet = this.wallets.get(userId);
    if (!wallet) {
      wallet = { balance: 0, currency: 'USD' };
    }

    wallet.balance =
      operation === 'add' ? wallet.balance + amount : wallet.balance - amount;

    this.wallets.set(userId, wallet);
    return wallet;
  }
}
