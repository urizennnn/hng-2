import { Injectable, Req, Res } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { decode } from "jsonwebtoken";



type Payload = {
  email: string;
};



@Injectable()
export class JwtAuth {
  constructor(private readonly jwt: JwtService) { }

  SignJWt(payload: Payload) {
    return this.jwt.sign({ user: payload }, {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_LIMIT as string,
    });
  }

  SendCookie(payload: Payload, @Res() res: Response) {
    try {
      const accessToken = this.SignJWt(payload);
      const refreshToken = this.SignJWt(payload);
      const maxAge = 15 * 60 * 1000;

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        signed: true,
        maxAge,
        secure: process.env.NODE_ENV === "production",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        signed: true,
        expires: new Date(Date.now() + maxAge),
        secure: process.env.NODE_ENV === "production",
      });
      return accessToken
    } catch (err) {
      throw new Error(err);
    }
  }

  async clearCookie(@Res() res: Response) {
    try {
      res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      });

      res.cookie("accessToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  decodeCookie(@Req() req: Request): string {
    const { refreshToken } = req.signedCookies;
    if (!refreshToken) throw new Error("No token found");

    const user = decode(refreshToken) as Payload;
    return user.email

  }
}
