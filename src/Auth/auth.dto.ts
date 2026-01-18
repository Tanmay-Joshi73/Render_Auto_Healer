import {IsString,isNumber,IsEmail,IsNotEmpty} from 'class-validator';
export class registerdto{
    @IsNotEmpty()
    @IsString()
     token:string;
     @IsNotEmpty()
    @IsString()
     username:string;
     @IsNotEmpty()
     @IsString()
     password:string
    //  @IsEmail()
    //  email:string
}