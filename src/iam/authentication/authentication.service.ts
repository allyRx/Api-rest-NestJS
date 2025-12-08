import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './jwt.config';
import type { ConfigType } from '@nestjs/config';
import { ActiveUserData } from './interfaces/active-user-data.interface';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly hashingService: HashingService,
        private jwtService: JwtService,
              
        @Inject(jwtConfig.KEY)
        private readonly configurationJwt: ConfigType<typeof jwtConfig>
    ){}


    async signUp(SignUpDto: SignUpDto){
        try {
            const user = new User();
            user.email = SignUpDto.email;
            user.password = await this.hashingService.hash(SignUpDto.password);
            await this.userRepository.save(user);
        } catch (error) {
            const pgUniqueViolationErrorCode = '23505';
            if (error.code === pgUniqueViolationErrorCode) {
                throw new Error('Email already in use');
            }
            throw error;
        }
    }

    async signIn(signIn: SignInDto){
       
        const user = await this.userRepository.findOne({where: {email: signIn.email}});
        if(!user){
            throw new Error('Invalid credentials');
        }

        const passwordValid = await this.hashingService.compare(
            signIn.password,
            user.password,
        );

        if(!passwordValid){
            throw new UnauthorizedException();
        }

        const [access_token , refreshToken] = await Promise.all([
            this.SignToken<Partial<ActiveUserData>>(
                user.id,
                this.configurationJwt.accessTokenTtl,
                {email:user.email}

        ),
        this.SignToken(user.id , this.configurationJwt.accessTokenTtl)
    ]);

        return {
              access_token,
              refreshToken
        }
        
    }


    //Function for signin token 
    private async SignToken<T>(userId: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync({
           sub: userId,
           ...payload 
        }, {
            audience: this.configurationJwt.audience,
            issuer: this.configurationJwt.issuer,
            secret: this.configurationJwt.secret,
            expiresIn: this.configurationJwt.accessTokenTtl
        });
    }
}
