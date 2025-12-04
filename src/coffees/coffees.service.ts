import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from './Entities/coffees.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDtoTs } from './dto/update-coffee.dto.ts';


@Injectable()
export class CoffeesService {
   
   
    constructor(
        @InjectRepository(Coffees)
        private readonly coffeesRepository: Repository<Coffees>
    ){}

    findAll(){
        return this.coffeesRepository.find({
            relations:['flavors']
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
        const coffee = this.coffeesRepository.create(createCoffeeDto);
        
        return this.coffeesRepository.save(coffee); 
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDtoTs){
        const ifExist = await this.coffeesRepository.preload({
            id: +id,
            ...updateCoffeeDto
        })
        
        if(!ifExist){
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        
        return this.coffeesRepository.save(ifExist);
    }

    async remove(id: string){
        const coffee = await this.findOne(id);
        if(!coffee){
            throw new NotFoundException(`Coffee #${id} not found`);
        }
       return this.coffeesRepository.delete(+id);
    }

}
