
/**
 * Extract the token for getting a data like this : 
 * {
  sub: 3,
  email: 'email@email.fr',
  iat: 1765213731,
  exp: 1765217331,
  aud: 'localhost:3000',
  iss: 'localhost:3000'
}

 */

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUESTUSERKEY } from "../authentication/iam.constants";
import { ActiveUserData } from "../authentication/interfaces/active-user-data.interface";

export const ActiveUser = createParamDecorator(
    (field: keyof ActiveUserData | undefined, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        const user: ActiveUserData | undefined = request[REQUESTUSERKEY];
       
        return field ? user?.[field] : user;
    }
) 