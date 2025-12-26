import { Injectable } from '@nestjs/common';
import { SrvRecord } from 'dns';
import { stripTypeScriptTypes } from 'module';

import { RenderClient } from '../render/render.client'; 
interface Result{
    Status:boolean,
    Message:string
}

@Injectable()
export class RegisterService {
constructor(private readonly Client:RenderClient){}
   async Register(token,username,password):Promise<Result>{
        //First verify the weather the Render api key is correct or not 
        try{
            const Data=await this.Client.verifyService(token)
            if(!Data) return {Status:false,Message:"token is not valid"}
            console.log(Data)


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
