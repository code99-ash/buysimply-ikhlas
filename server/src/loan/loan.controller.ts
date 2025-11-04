import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { type ExpressRequest, JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { IJwtStaffPayload } from 'src/auth/entities/staff.entity';

@UseGuards(JwtAuthGuard, RolesGuard) // Controller level guards
@Controller('loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Get()
  getAllLoans(@Req() req: ExpressRequest, @Query('status') status?: string) {
    const user = req.user as IJwtStaffPayload;
    return this.loanService.getAllLoans(user, status as any);
  }

  @Get(':userEmail/get')
  getLoansByEmail(@Req() req: ExpressRequest, @Param('userEmail') email: string) {
    const user = req.user as IJwtStaffPayload;
    const loans = this.loanService.getLoansByApplicantEmail(user, email);
    return { loans: loans.length ? loans : [] };
  }

  @Get('expired')
  getExpiredLoans(@Req() req: ExpressRequest) {
    const user = req.user as IJwtStaffPayload;
    return this.loanService.getExpiredLoans(user);
  }

  @Delete(':loanId/delete')
  @Roles('superAdmin') // only superadmin can delete
  deleteLoan(@Param('loanId') id: string) {
    const deleted = this.loanService.deleteLoanById(id);
    if (!deleted) throw new NotFoundException('Loan not found');
    return { message: 'Loan deleted successfully' };
  }
}
