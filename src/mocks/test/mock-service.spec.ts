// Example test using mocks
// mvp-app/src/mocks/test/mock-services.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MockUserService } from '../services/mock-user.service';
import { MockWalletService } from '../services/mock-wallet.service';

describe('Mock Services', () => {
  let userService: MockUserService;
  let walletService: MockWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockUserService, MockWalletService],
    }).compile();

    userService = module.get<MockUserService>(MockUserService);
    walletService = module.get<MockWalletService>(MockWalletService);
  });

  describe('MockUserService', () => {
    it('should find user by id', async () => {
      const user = await userService.findById('user1');
      expect(user).toBeDefined();
      expect(user?.email).toBe('user1@example.com');
    });

    it('should find users by tenant', async () => {
      const users = await userService.findByTenant('tenant1');
      expect(users).toHaveLength(2);
    });
  });

  describe('MockWalletService', () => {
    it('should get wallet balance', async () => {
      const balance = await walletService.getBalance('user1');
      expect(balance.balance).toBe(1000);
    });

    it('should update wallet balance', async () => {
      const updated = await walletService.updateBalance('user1', 100, 'add');
      expect(updated.balance).toBe(1100);
    });
  });
});
