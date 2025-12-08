import { Body, Controller, HttpCode, HttpStatus, Inject, Post  } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../decorators/isPublicRoutes';

@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        
    ){}


    @Post('sign-up')
    @Public()
    async signUp(@Body() SignUpDto: SignUpDto){
        return this.authenticationService.signUp(SignUpDto);
    }

    
    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() signIn: SignInDto){
        return this.authenticationService.signIn(signIn);
    }
}
