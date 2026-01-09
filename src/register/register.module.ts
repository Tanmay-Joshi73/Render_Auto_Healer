import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { RenderModule } from 'src/render/render.module';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports:[RenderModule,DatabaseModule],
  controllers: [RegisterController],
  providers: [RegisterService],
  
})
export class RegisterModule {}
