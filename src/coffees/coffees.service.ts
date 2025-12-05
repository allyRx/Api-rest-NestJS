import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from './Entities/coffees.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDtoTs } from './dto/update-coffee.dto.ts';
import { FlavorsEntity } from './Entities/flavors.entity';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event';
import { COFFEE_BRAND } from './coffee.constants';


@Injectable()
export class CoffeesService {
   
   
    constructor(
        @InjectRepository(Coffees)
        private readonly coffeesRepository: Repository<Coffees>,

        @InjectRepository(FlavorsEntity)
        private readonly flavorsRepository: Repository<FlavorsEntity>,

        private readonly dataSource: DataSource,
    ){}

    findAll(paginationQuery: PaginationQueryDto){
        const {limit , offset} = paginationQuery;
        return this.coffeesRepository.find({
            relations:['flavors'] ,
            skip: offset,
            take: limit
        });
    }

    async findOne(id:string){
      const coffeExist = await this.coffeesRepository.findOne({where: {id: +id} , relations:['flavors']});

      if(!coffeExist){
        throw new NotFoundException(`This product is not fouund ${id}`)
      }
      return coffeExist
    }

    async create(createCoffeeDto: CreateCoffeeDto){
       
        //verify flavors
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        )

        const coffee = this.coffeesRepository.create({...createCoffeeDto , flavors});
        
        return this.coffeesRepository.save(coffee); 
    }


    async update(id: string, updateCoffeeDto: UpdateCoffeeDtoTs){


        const flavors = updateCoffeeDto.flavors && (await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        ))
        
        const coffee = await this.coffeesRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors: flavors
        })

        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        
        return this.coffeesRepository.save(coffee);
    }

    async remove(id: string){
        const coffee = await this.findOne(id);
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`);
        }
       return this.coffeesRepository.delete(+id);
    }


    //function to verify flavors
    private async preloadFlavorByName(name: string): Promise<FlavorsEntity>{
        let existingFlavor = await this.flavorsRepository.findOne({ where: { name } });
        if (existingFlavor){
            return existingFlavor
        }
        return this.flavorsRepository.create({name})
    }

    async recommendCoffee(coffee: Coffees){
        return this.dataSource.transaction(async (manager) =>{
            coffee.recommendations++;

            const recommendedEvent = new Event();
            recommendedEvent.name = 'recommended_coffee';
            recommendedEvent.type = 'coffee';
            recommendedEvent.payload = {coffeeId: coffee.id};

            await manager.getRepository(Coffees).save(coffee);
            await manager.getRepository(Event).save(recommendedEvent);


            return {succes: true};
        })
    }

}
