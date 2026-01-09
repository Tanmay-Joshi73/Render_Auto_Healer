import {IsString,isNumber,IsEmail} from 'class-validator';
export class registerdto{
    @IsString()
     token:string;
    @IsString()
     username:string;
     @IsString()
     password:string
    //  @IsEmail()
    //  email:string
}