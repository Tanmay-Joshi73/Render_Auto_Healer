import { Module } from '@nestjs/common';
import { RenderService } from './render.service';
import { RenderController } from './render.controller';
import { RenderClient } from './render.client';
@Module({
  controllers: [RenderController],
  providers: [RenderService,RenderClient],
  exports:[RenderClient]
})
export class RenderModule {}
