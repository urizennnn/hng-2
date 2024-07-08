import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { OrgService } from './org.service';
import { JwtAuth } from 'src/middleware/jwt';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/guards/authGuard';
import { AddUserDto, CreateOrgDto } from './org.dto';

@Controller()
export class OrgController {
  constructor(
    private readonly orgService: OrgService,
    private readonly jwt: JwtAuth
  ) { }

  private async getUser(req: Request) {
    return this.jwt.decodeCookie(req);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getOrgs(@Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.getUser(req);
      const organisations = await this.orgService.getOrgs(user);
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Organizations fetched",
        data: organisations
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: "Bad Request",
        message: "Failed to fetch organizations",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get("/:orgId")
  async getOrgById(@Req() _: Request, @Res() res: Response, @Param('orgId') orgId: string) {
    try {
      const org = await this.orgService.getOrgById(orgId);
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Organization fetched",
        data: org
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: "Bad Request",
        message: "Failed to fetch organization",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async createOrg(@Req() req: Request, @Res() res: Response, @Body() details: CreateOrgDto) {
    try {
      const user = await this.getUser(req);
      const org = await this.orgService.createOrg(details, user);
      return res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Organization created successfully",
        data: org
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: "Bad Request",
        message: "Client Error",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
  }

  @UseGuards(AuthGuard)
  @Post("/:orgId/users")
  async addUserToOrg(@Req() _: Request, @Res() res: Response, @Param('orgId') orgId: string, @Body() body: AddUserDto) {
    console.log(body.userId);
    try {
      await this.orgService.addUserToOrg(orgId, body.userId);
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "User added to organization successfully"
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: "Bad Request",
        message: "Failed to add user to organization",
        statusCode: HttpStatus.BAD_REQUEST
      });
    }
  }
}

