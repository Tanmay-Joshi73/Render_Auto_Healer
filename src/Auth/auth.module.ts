import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RenderModule } from 'src/render/render.module';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports:[RenderModule,DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  
})
export class AuthModule {}
