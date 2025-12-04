import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffees } from './Entities/coffees.entity';

@Module({imports:[TypeOrmModule.forFeature([Coffees])] ,controllers: [CoffeesController], providers: [CoffeesService]})
export class CoffeesModule {}
