import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { RenderModule } from 'src/render/render.module';
@Module({
  imports:[RenderModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
