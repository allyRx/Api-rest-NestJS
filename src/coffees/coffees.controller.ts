import { Body, Controller , Delete, Get, Param, Patch, Post, Query, Res} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDtoTs } from './dto/update-coffee.dto.ts';

@Controller('coffees')
export class CoffeesController {
    
    //Call coffeeservice and add permission for read
    constructor(private readonly coffeeService: CoffeesService){}
    
    @Get()
    getAllCoffees(@Res() response:any , @Query() paginationQuery:any){
   // const {limit , offset} = paginationQuery;
      return this.coffeeService.findAll()
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
