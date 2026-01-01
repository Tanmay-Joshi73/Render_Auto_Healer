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

    
    return services.filter(
      (service: any) => service.type === 'web_service',
    );
  }

    //This will return the Specified service name
  async getServiceByName(renderApiKey: string, serviceName: string) {
  if (!renderApiKey) {
    throw new BadRequestException('API key is not provided');
  }
  if (!serviceName) {
    throw new BadRequestException('Service name is required');
  }

  const services = await this.client.verifyService(renderApiKey);

  const service = services.find(
    (s: any) => s.name === serviceName && s.type === 'web_service',
  );

  if (!service) {
    throw new BadRequestException('Service with this name not found');
  }

  return service;
}



    // This will return the unehalty service or which are suspened by any reason
async listUnhealthyServices(renderApiKey: string) {
  if (!renderApiKey) {
    throw new BadRequestException('API key is not provided');
  }

  const services = await this.client.verifyService(renderApiKey);
  console.log(services)
  return services.filter(
    (service: any) =>
      service.type === 'web_service' &&
      ['failed', 'crashed'].includes(service.status),
  );
}


  //This will Redeploy the service 
//   async redeployService(renderApiKey: string, serviceId: string) {
//   if (!renderApiKey) {
//     throw new BadRequestException('API key is not provided');
//   }
//   if (!serviceId) {
//     throw new BadRequestException('Service ID is required');
//   }

//   const result = await this.client.redeployService(renderApiKey, serviceId);

//   if (!result) {
//     throw new BadRequestException('Failed to redeploy service');
//   }

//   return {
//     message: 'Service redeployment triggered successfully',
//     serviceId,
//   };
// }



  
  }
