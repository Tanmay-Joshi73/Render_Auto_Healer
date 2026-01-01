import { Injectable,BadRequestException} from '@nestjs/common';
import { RenderClient } from 'src/render/render.client';
@Injectable()
export class ServicesService {
    
constructor(private readonly client:RenderClient){}

     // 1️⃣ List available Render services for the user
 async listAvailableServices(renderApiKey: string) {
  if (!renderApiKey) {
    throw new BadRequestException('API key is not provided');
  }

  const services = await this.client.verifyService(renderApiKey);
  console.log(services)
  if (!services) {
    throw new BadRequestException('Invalid Render API key');
  }

  // UI-safe mapping (optional)
  return services.map((service: any) => ({
    renderServiceId: service.id,
    name: service.name,
    type: service.type,
    status: service.status,
    dashboardUrl: service.dashboardUrl,
    updatedAt: service.updatedAt,
  }));
}

    //This will return the Specified service name
async getServiceByName(renderApiKey: string, serviceName: string) {
  if (!renderApiKey) {
    throw new BadRequestException('API key is not provided');
  }
  if (!serviceName) {
    throw new BadRequestException('Service name is required');
  }

  const service = await this.client.getWebServiceByName(
    renderApiKey,
    serviceName,
  );

  if (!service) {
    throw new BadRequestException('Service with this name not found');
  }

  return service; // FULL object
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

  //This will group all the services by states
async getServiceOverview(renderApiKey: string) {
  if (!renderApiKey) {
    throw new BadRequestException('API key is not provided');
  }

  const services = await this.client.verifyService(renderApiKey);

  if (!services) {
    throw new BadRequestException('Invalid Render API key');
  }

  return {
    total: services.length,
    active: services.filter(s => s.suspended === 'not_suspended'),
    suspended: services.filter(s => s.suspended === 'suspended'),
    unhealthy: services.filter(s =>
      ['failed', 'crashed'].includes(s.status),
    ),
  };
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
