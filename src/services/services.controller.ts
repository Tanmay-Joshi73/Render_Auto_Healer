import { Controller } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Get,Post } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { get } from 'axios';
import { Param } from '@nestjs/common';
import { AuthGuard } from 'src/Auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { userInfo } from 'os';
@UseGuards(AuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly Main: ServicesService) {}
   @Get('available')
  async getAvailableServices(@Req() req: any) {
    return this.Main.listAvailableServices(req.user.apikey);
  }
  @Get('GetService')
  async GetOneService(
    @Req()req:any,
    @Body()Data:{serviceName:string}):Promise<any>{

    const {serviceName} ={...Data}
    return this.Main.getServiceByName(req.user.apikey,serviceName)
}


@Get('/Unhealthy')
async UnhealthyService( @Req()req:any):Promise<any>{
const result= await this.Main.listUnhealthyServices(req.user.apikey)
return result
}
@Get('/Overview')
async Getoverview(@Req()req:any):Promise<any>{
  const result=await this.Main.getServiceOverview(req.user.apikey)
  return result
}
@Post('/Redeploy')
async Redploy(@Body() Data:{ServiceName:string},@Req()req:any):Promise<any>{
  const {ServiceName}={...Data}
  const result=await this.Main.redeployService(req.user.apikey,ServiceName)
  return result;
}
@Post("/CreateMonitorLink")
async CreateLink(@Body() Data:{ServiceName:string},@Req()req:any):Promise<any>{

  const {ServiceName}={...Data}
  const result=await this.Main.createUptimeService(req.user.apikey,ServiceName,req.user.id)
  return result
}
@Post('/Monitor/:token')
async monitorService(@Param() requestData:{token:string}):Promise<any>{
const Token=requestData.token;
const reuslt=await this.Main.Monitor(Token)
return reuslt;

}
@Get('/monitor/all')
  async getAllMonitors(@Req() req: any) {
    // req.user injected by AuthGuard
    return this.Main.getAllWebhookUrls(req.user.id);
  }
}


