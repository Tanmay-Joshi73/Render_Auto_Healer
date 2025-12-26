import { Injectable,BadRequestException} from '@nestjs/common';
import { RenderClient } from 'src/render/render.client';
@Injectable()
export class ServicesService {
    
constructor(private readonly client:RenderClient){}

     // 1️⃣ List available Render services for the user
  async listAvailableServices(renderApiKey: string) {
    if(!renderApiKey) throw new BadRequestException("Api key is not provided")
    const services = await this.client.verifyService(renderApiKey); //This will return the Full Arrry of Curosr
    if (!services) {
      throw new BadRequestException('Invalid Render API key');
    }
    console.log(services)
    
    return services.filter(
      (service: any) => service.type === 'web_service',
    );
  }

  
  }
