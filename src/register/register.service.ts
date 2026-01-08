import { Injectable } from '@nestjs/common';
import { SrvRecord } from 'dns';
import { stripTypeScriptTypes } from 'module';
import { DatabaseService } from 'src/database/database.service';
import { RenderClient } from '../render/render.client';
import { register } from 'src/types/register';
import { BadRequestException } from '@nestjs/common'; 
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
        //First verify the weather the Render api key is correct or not 
        try{
              if (!token || !username || !password) {
      throw new BadRequestException('Missing required fields');
    }
            const Data=await this.Client.verifyService(token)
            if(!Data) return {Status:false,Message:"token is not valid"}
            
             const Supa = await this.DB['pool'].connect();           
            await Supa.query('BEGIN')
            const userResult=await Supa.query(
                  `
        INSERT INTO users (name, password, api_key)
        VALUES ($1, $2, $3)
        RETURNING id
        `,
        [username,password,token]
            )

            //2 Save all the Data in DB for the further use case


            //3  Create the Unique Id
            

    }
    catch(err){
        console.log(err)
        return {
            Status:false,
            Message:err
                }
    }
return {
    Status:true,
    Message:"success"
}
    

   }

 
}
