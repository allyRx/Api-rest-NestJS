import { Body, Controller, HttpCode, HttpStatus, Post  } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ){}

    
    @Post('sign-up')
    async signUp(@Body() SignUpDto: SignUpDto){
        return this.authenticationService.signUp(SignUpDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() signIn: SignInDto){
        return this.authenticationService.signIn(signIn);
    }
}
