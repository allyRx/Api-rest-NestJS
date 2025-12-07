import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffees } from './Entities/coffees.entity';
import { FlavorsEntity } from './Entities/flavors.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/iam/authentication/jwt.config';
import { ConfigModule } from '@nestjs/config';


@Module({imports:[
    TypeOrmModule.forFeature([Coffees ,FlavorsEntity , Event])] ,
    controllers: [CoffeesController],
    providers: [CoffeesService],
    exports: [CoffeesService]
    },
    
    
    )
export class CoffeesModule {}
