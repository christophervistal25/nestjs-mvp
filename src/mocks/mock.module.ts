import { Module, Global } from '@nestjs/common';
import { MockUserService } from './services/mock-user.service';
import { MockWalletService } from './services/mock-wallet.service';

@Global()
@Module({
  providers: [MockUserService, MockWalletService],
  exports: [MockUserService, MockWalletService],
})
export class MockModule {}
