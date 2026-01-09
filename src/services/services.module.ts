import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RenderModule } from 'src/render/render.module';
@Module({
  imports:[RenderModule,DatabaseModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
