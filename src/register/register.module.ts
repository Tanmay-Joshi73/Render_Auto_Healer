import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { RenderModule } from 'src/render/render.module';
@Module({
  imports:[RenderModule],
  controllers: [RegisterController],
  providers: [RegisterService],
  
})
export class RegisterModule {}
