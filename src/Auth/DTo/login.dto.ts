import { IsString ,IsNotEmpty} from "class-validator"
export class login{
    @IsNotEmpty()
    @IsString()
    username:string
    @IsNotEmpty()
    @IsString()
    password:string
}