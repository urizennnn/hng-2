import { Body, Controller, Post, HttpStatus, Res, UsePipes, ValidationPipe, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuth } from '../middleware/jwt';
import { UserLogin, UserRegister } from '../users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtAuth
  ) { }

  @Get('/')
  async home() {
    return "Welcome to the auth service";
  }

  @Post('/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Res() res: Response, @Body() userDetails: UserRegister) {
    try {
      const user = await this.authService.register(userDetails);
      const accessToken = this.jwt.SendCookie({ email: user.email }, res);
      return res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken,
          user
        }
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: "Bad request",
        message: "Registration failed",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
  }

  @Post('/login')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Res() res: Response, @Body() loginDetails: UserLogin) {
    try {
      const user = await this.authService.login(loginDetails);
      const accessToken = this.jwt.SendCookie({ email: user.email }, res);
      const { password, ...userWithoutPassword } = user;
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Login successful",
        data: {
          accessToken,
          user: userWithoutPassword
        }
      });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: HttpStatus.UNAUTHORIZED
      });
    }
  }
}

