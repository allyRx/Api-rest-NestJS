import { Body, Controller , Delete, Get, Param, Patch, Post, Query, Res, UsePipes, ValidationPipe} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDtoTs } from './dto/update-coffee.dto.ts';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
    
    //Call coffeeservice and add permission for read
    constructor(private readonly coffeeService: CoffeesService){}
    @UsePipes(ValidationPipe)
    @Get()
    getAllCoffees(@Query() paginationQuery: PaginationQueryDto){
    
      return this.coffeeService.findAll(paginationQuery)
    }

    @Get(":id")
    findOne(@Param('id') id:string){
        return this.coffeeService.findOne(id)
    }

    @Post()
    AddCoffess(@Body() createCoffeDto: CreateCoffeeDto){
        return this.coffeeService.create(createCoffeDto)
    }

    @Patch(':id')
    UpdateCoffee(@Param('id') id:string, @Body() updateCoffeeDto: UpdateCoffeeDtoTs){
        return this.coffeeService.update(id,updateCoffeeDto)
    }

    @Delete(':id')
    DeleteCoffee(@Param('id') id:string){
        return this.coffeeService.remove(id)
    }
}
