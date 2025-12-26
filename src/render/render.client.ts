import axios from 'axios';
import { Injectable } from '@nestjs/common';
@Injectable()
export class RenderClient {
  async verifyService(token: string) {
    try {
      const res = await axios.get(
        `https://api.render.com/v1/services/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch {
      return null;
    }
    
  }
}
