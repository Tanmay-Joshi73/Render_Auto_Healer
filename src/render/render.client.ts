import axios from 'axios';
import { Injectable } from '@nestjs/common';
@Injectable()
export class RenderClient {
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

    return res.data
      .map((item: any) => item.service)
      .filter(
        (service: any) =>
          service.type === 'web_service' &&
          service.suspended === 'not_suspended',
      )
      .map((service: any) => ({
        renderServiceId: service.id,
        name: service.name,
        type: service.type,
        dashboardUrl: service.dashboardUrl,
        status: 'active',
      }));
  } 
  catch {
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

    if (!service) {
      return null;
    }

    return {
      renderServiceId: service.id,
      name: service.name,
      type: service.type,
      dashboardUrl: service.dashboardUrl,
    };
  } catch {
    return null;
  }
}

}
