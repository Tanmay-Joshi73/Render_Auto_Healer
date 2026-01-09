import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SrvRecord } from 'dns';
import { stripTypeScriptTypes } from 'module';
import { DatabaseService } from 'src/database/database.service';
import { RenderClient } from '../render/render.client';
import { register } from 'src/types/register';
import { BadRequestException } from '@nestjs/common'; 
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
interface Result{
    Status:boolean,
    Message:string
    Auth?:string
}

@Injectable()
export class AuthService {
constructor(private readonly Client:RenderClient,
            private readonly DB:DatabaseService 
){}

    // here token is refereed as Render api key
   async Register(token:string,username:string,password:string):Promise<Result>{
    // 1️⃣ Verify Render API key
    let services;
    try {
       
        // first check weather current provided render api key is valid or not by returning all the services of render.com of that user
      services = await this.Client.verifyService(token);
    } catch (err) {
      throw new BadRequestException('Invalid Render API key');
    }

    if (!services || services.length === 0) {
      throw new BadRequestException('Render API key has no services');
    }
        //Hash the password here
    const hashedPassword = await bcrypt.hash(password, 10);
    const authApiKey = `auth_${randomUUID()}`;
    const supa = await this.DB['pool'].connect();

    try{

        const user=await supa.query(
            `
            INSERT INTO USERS(Name,Password,apiKey)
            VALUES($1,$2,$3,$4)
            `,
            [username,hashedPassword,authApiKey,token]
        );
        await supa.query('COMMIT')

         return {
        Status: true,
        Message: 'User registered successfully',
        Auth:authApiKey
      };
      
    }
    catch(err:any){
            await supa.query('ROLLBACK')

      if (err.code === '23505') {
        // unique violation
        throw new BadRequestException(
          'User already exists or API key already registered',
        );
      }
 throw new BadRequestException('Registration failed');


   }

}

async Login(username: string, password: string) {
  if (!username || !password) {
    throw new UnauthorizedException('Missing credentials');
  }

  // 1️⃣ Fetch user
  const users = await this.DB.query(
    `
    SELECT id, password, api_key
    FROM users
    WHERE name = $1
    `,
    [username],
  );

  if (users.length === 0) {
    throw new UnauthorizedException('Invalid username or password');
  }

  const user = users[0];
  // 2️⃣ Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid username or password');
  }

  // 3️⃣ Return API key
  return {
    Status: true,
    Message: 'Login successful',
    apiKey: user.api_key,
  };
}
}