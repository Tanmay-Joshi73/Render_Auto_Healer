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
          service.suspended === 'not_suspended',
      );

    return service || null; // 🔥 FULL object
  } catch {
    return null;
  }
}



///This function will call the render servicea and deploy it again 
async redeployService(renderApiKey: string, serviceId: string) {
    if (!renderApiKey) {
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
            Authorization: `Bearer ${renderApiKey}`,
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

}

