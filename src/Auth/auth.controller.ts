import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post,Get,Delete } from '@nestjs/common';
import { registerdto } from './auth.dto';
import { login } from './DTo/login.dto';
@Controller('register')
export class AuthController {
  constructor(private readonly registerService: AuthService) {}

  @Post('/set')
  async Register(@Body()Data:registerdto):Promise<any>{
    const {token,username,password} ={...Data}
    return this.registerService.Register(token,username,password);
  }
  

  @Post('/get')
  async Login(@Body()Data:login):Promise<any>{
    const {username,password} ={...Data}
    return this.registerService.Login(username,password);
  }
}
