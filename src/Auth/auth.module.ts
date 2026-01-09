import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RenderModule } from 'src/render/render.module';
import { DatabaseModule } from 'src/database/database.module';
import { AuthGuard } from './auth.guard';
@Module({
  imports:[RenderModule,DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  exports:[AuthGuard]
  
})
export class AuthModule {}
