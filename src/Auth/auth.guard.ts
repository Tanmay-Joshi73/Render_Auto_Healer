import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { inspect } from 'util';
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly DB:DatabaseService){}
    async canActivate(context: ExecutionContext):  | Promise<boolean>  {
        console.log("✅ AuthGuard HIT:", context.getClass().name, context.getHandler().name);
    
        const request = context.switchToHttp().getRequest()
        const authHeader = request.headers['authorization'];
        if (!authHeader) {
            throw new UnauthorizedException('Missing Authorization header');
        }

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid auth format');
        }
        const user=await this.DB.query(
            `SELECT * FROM USERS 
             WHERE auth_key=$1`,
             [token]
        )
     
        if(user.length==0){throw new UnauthorizedException('Invalid Api Key')}
       
        request.user=user[0]
        return true;
        
    }
}
