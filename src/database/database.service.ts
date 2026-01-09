import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  onModuleInit() {
    
    this.pool = new Pool({
      connectionString: process.env.Origin_Url,
      ssl: {
        rejectUnauthorized: false, // required for Supabase
      },
      
    });
  }

  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(text, params);
    
    return result.rows;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
