import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class RenderClient {

  ///here token is refereed as the RenderApiKey
   async verifyService(token: string) {
  try {
    const res = await axios.get(
      'https://api.render.com/v1/services',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Return ALL services with FULL data
    return res.data.map((item: any) => item.service);

  } catch (error) {
    return null;
  }
}


  

//This function will return the only 1 service that matched the name
async getWebServiceByName(
  token: string,
  serviceName: string,
) {
  try {
    const res = await axios.get(
      'https://api.render.com/v1/services',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const service = res.data
      .map((item: any) => item.service)
      .find(
        (service: any) =>
          service.name.toLowerCase() === serviceName.toLowerCase() &&
          service.type === 'web_service' &&
          service.suspended === 'not_suspended' || 'suspended',
          
      );
      console.log(service)
    return service || null; // 🔥 FULL object
  } catch {
    return null;
  }
}



///This function will call the render service and deploy it again 
async redeployService(token: string, serviceId: string) {
    if (!token) {
      throw new BadRequestException('API key is not provided');
    }

    if (!serviceId) {
      throw new BadRequestException('Service ID is required');
    }

    try {
      const response = await axios.post(
        `https://api.render.com/v1/services/${serviceId}/deploys`,
        {}, // body is empty for redeploy
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      throw new BadRequestException(
        error?.response?.data || 'Failed to redeploy service',
      );
    }

}


// core function which will start the service again which is suspended or stopped 
async resumeService(token: string, serviceId: string) {
    const res = await axios.post(
      `https://api.render.com/v1/services${serviceId}/resume`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('before calling the Resume serviec funcion')
    console.log(res)
    return res.data;
  }

}

