import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IStaffEntity } from 'src/auth/entities/staff.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access denied.');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      request['user'] = decoded; // attach decoded payload to request
      return true;
    } catch (err) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}

export type ExpressRequest = Request & {
  user?: IStaffEntity;
};