import { Injectable } from '@nestjs/common';
import { SrvRecord } from 'dns';
import { stripTypeScriptTypes } from 'module';
import { DatabaseService } from 'src/database/database.service';
import { RenderClient } from '../render/render.client';
import { register } from 'src/types/register';
import { BadRequestException } from '@nestjs/common'; 
import * as bcrypt from 'bcrypt';

interface Result{
    Status:boolean,
    Message:string
}

@Injectable()
export class RegisterService {
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

    const supa = await this.DB['pool'].connect();
    
    try{

        const user=await supa.query(
            `
            INSERT INTO USERS(Name,Password,apiKey)
            VALUES($1,$2,$3)
            `,
            [username,hashedPassword,token]
        );
        await supa.query('COMMIT')

         return {
        Status: true,
        Message: 'User registered successfully',
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
}