import { Body, Controller } from '@nestjs/common';
import { RegisterService } from './register.service';
import { Post,Get,Delete } from '@nestjs/common';
import { registerdto } from './register.dto';
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('/set')
  async Register(@Body()Data:registerdto):Promise<any>{
    const {token,username,password} ={...Data}
    return this.registerService.Register(token,username,password);
  }
}
