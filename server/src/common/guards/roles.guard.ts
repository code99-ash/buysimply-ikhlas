import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IJwtStaffPayload } from 'src/auth/entities/staff.entity';
import { ROLES_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    private logger = new Logger(RolesGuard.name);

    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) return true;

        this.logger.log(requiredRoles)

        const request = context.switchToHttp().getRequest();
        const user = request.user as IJwtStaffPayload;

        this.logger.log(`User role: ${user?.role}`);

        if (!user) {
        throw new ForbiddenException('No user found in request context');
        }

        if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException(`Access denied for role: ${user.role}`);
        }

        return true;
    }
}
