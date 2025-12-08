import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../jwt.config';
import { Request } from 'express';
import { REQUESTUSERKEY } from '../iam.constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/iam/decorators/isPublicRoutes';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
     private reflector: Reflector,
                  
    @Inject(jwtConfig.KEY)
    private readonly configurationJwt: ConfigType<typeof jwtConfig>
  ){}


  async canActivate(context: ExecutionContext,):  Promise<boolean>{
    
     const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    
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
