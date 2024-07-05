import { AuthService } from '@auth/auth.service';
import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }
  @Get("/")
  async getResponse(@Res() res: Response, @Req() req: Request) {
    try {
      const response = await this.auth.getResponse()
      return res.status(HttpStatus.OK).json({ response, message: "Hello World!" });
    } catch (error) {
      console.error(error);
    }
  }
}
