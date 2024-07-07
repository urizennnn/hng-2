import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtAuth } from 'src/middleware/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwt: JwtAuth
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const payload = await this.verifyAndRefreshToken(token, response);
      request['user'] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    return request.signedCookies['refreshToken'];
  }

  private async verifyAndRefreshToken(token: string, response: Response): Promise<any> {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    await this.refreshTokens(payload, response);

    return payload;
  }

  private async refreshTokens(payload: any, response: Response): Promise<void> {
    const newToken = this.jwtService.sign({ userId: payload.userId });

    response.clearCookie('refreshToken');

    response.cookie('refreshToken', newToken, {
      httpOnly: true,
      signed: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    this.jwt.SendCookie({ token: newToken, ...payload }, response);
  }
}

