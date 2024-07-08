import { Controller, Get, HttpStatus, Param, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuth } from 'src/middleware/jwt';
import { AuthGuard } from 'src/guards/authGuard';
import { Request, Response } from 'express';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtAuth
  ) { }

  private async getUser(req: Request): Promise<string> {
    return this.jwt.decodeCookie(req);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserById(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    try {
      const email = await this.getUser(req);
      const user = await this.usersService.getUserById(id, email);
      return res.status(HttpStatus.OK).json({ "status": "success", "message": "User fetched", "data": user });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch user",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
