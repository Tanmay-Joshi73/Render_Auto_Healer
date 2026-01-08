import { Injectable,BadRequestException} from '@nestjs/common';
import { setDefaultAutoSelectFamilyAttemptTimeout } from 'net';
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
  async redeployService(renderApiKey: string, ServiceName: string) {
  if (!renderApiKey) {
    throw new BadRequestException('API key is not provided');
  }
  if (!ServiceName) {
    throw new BadRequestException('Service Name is required');
  }

  //This will give the whole details of the services that can agian use to find the service id and then re-deploy it.
  const serviceDetails=await this.getServiceByName(renderApiKey,ServiceName)
  const serviceId=serviceDetails.id
  const result=await this.client.redeployService(renderApiKey,serviceId)
  return result;

  // return "hey work is done bro"
 
  
  // if (!result) {
  //   throw new BadRequestException('Failed to redeploy service');
  // }

  // return {
  //   message: 'Service redeployment triggered successfully',
  //   serviceId,
  // };
}
async createUptimeService(RenderApiKey:string,ServiceName:string){
if(!ServiceName){
 throw new BadRequestException('Service Name is required');
}


// This will return the service id by checking the service name of the services
const serviceId=await this.getServiceByName(RenderApiKey,ServiceName); //Store in DB
const TokenId=122212  ///This will be create by any type of crypto 
// console.log(serviceId)
//Example-https://render.com/services/monitor/1222221
const URL=`https://render.com/services/monitor/${TokenId}`

}


//This will check the request or web event from the UptimeRobot
async Monitor(tokenid:string):Promise<any>{
  //Here tokenid is stored in the DB which releted to the specified Deployment
  const serviceName='Deployment' /// this will fetch from the DB when the Db accsess is provided
  const renderApiKey='rnd_BaJS28kbYltJDXlc7wrWXFs1gZ0Y'
  const serviceDetails=await this.getServiceByName(renderApiKey,serviceName)
  const Details={
    serviceId:serviceDetails.id,
    repo:serviceDetails.repo,
    name:serviceName || serviceDetails.name,
    url:serviceDetails.serviceDetails.url
  }
  const redeployService=await this.redeployService(renderApiKey,serviceName)
  console.log(redeployService)
  const response={
    status:true,
    message:redeployService
  }
  return response;

}

  
  }
