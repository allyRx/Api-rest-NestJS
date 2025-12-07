import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './authentication/constants';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret ,
      signOptions: {expiresIn: '500s'}
    })
  ],
  providers: [{
    provide: HashingService,
    useClass: BcryptService,
  }, AuthenticationService],
  controllers: [AuthenticationController]
})
export class IamModule {}
