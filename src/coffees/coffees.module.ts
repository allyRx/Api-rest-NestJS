import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffees } from './Entities/coffees.entity';
import { FlavorsEntity } from './Entities/flavors.entity';


@Module({imports:[TypeOrmModule.forFeature([Coffees ,FlavorsEntity , Event])] ,
    controllers: [CoffeesController],
    providers: [CoffeesService],
    exports: [CoffeesService]
    },
    
    
    )
export class CoffeesModule {}
