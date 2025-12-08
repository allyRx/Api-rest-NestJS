import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../jwt.config';
import { Request } from 'express';
import { REQUESTUSERKEY } from '../iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
                  
    @Inject(jwtConfig.KEY)
    private readonly configurationJwt: ConfigType<typeof jwtConfig>
  ){}


  async canActivate(context: ExecutionContext,):  Promise<boolean>{
    
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
     
    if (!token) {
     
      throw new UnauthorizedException();
    }
    try {
    
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configurationJwt.secret
        }
      );

      request[REQUESTUSERKEY] = payload;
    
      return true;
  
  }catch{
      throw new UnauthorizedException();
  }
}



 private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
   
    return token 
  }

}
