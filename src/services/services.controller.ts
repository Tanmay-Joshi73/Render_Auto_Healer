import { Controller } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Get,Post } from '@nestjs/common';
import { Req } from '@nestjs/common';
@Controller('services')
export class ServicesController {
  constructor(private readonly Main: ServicesService) {}
   @Get('available')
  async getAvailableServices(@Req() req: any) {
    // const renderApiKey = req.user.renderApiKey ||'rnd_BaJS28kbYltJDXlc7wrWXFs1gZ0Y'; // from auth middleware
    const renderApiKey='rnd_BaJS28kbYltJDXlc7wrWXFs1gZ0Y'
    return this.Main.listAvailableServices(renderApiKey);
  }
}
