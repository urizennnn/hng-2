import { AuthService } from '@auth/auth.service';
import { Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserType } from '@user/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }


  @Get("/")
  async getResponse(@Res() res: Response, @Req() _: Request) {
    try {
      const response = await this.auth.getResponse()
      return res.status(HttpStatus.OK).json({ response, message: "Hello World!" });
    } catch (error) {
      console.error(error);
    }
  }

  @Post("/register")
  async register(@Res() res: Response, @Body() details: UserType) {
    try {
      const user = await this.auth.register(details);
      return res.status(HttpStatus.CREATED).json({ status: "success", message: "Registration successful", data: user });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({ status: "Bad request", message: "Registration failed", statusCode: HttpStatus.BAD_REQUEST });
    }
  }

  @Post("/login")
  async login(@Res() res: Response, @Body() email: string, password: string) {
    try {
      const user = await this.auth.login(email, password);
      console.log(`${user}`);
      return res.status(HttpStatus.OK).json({ status: "success", message: "Login successful", data: user });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({ status: "Bad request", message: "Authentication failed", statusCode: HttpStatus.UNAUTHORIZED });
    }
  }
}
