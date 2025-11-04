import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
