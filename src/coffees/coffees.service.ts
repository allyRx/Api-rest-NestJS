import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffees } from './Entities/coffees.entity';

@Injectable()
export class CoffeesService {
   
    private coffees: Coffees[]= [
{
    id: 1,
    Name: "Arabica Classic",
    Brand: "JavaGold",
    flavors: ["Chocolate", "Nutty", "Caramel"]
  },
  {
    id: 2,
    Name: "Morning Boost",
    Brand: "BeanMaster",
    flavors: ["Citrus", "Floral"]
  },
  {
    id: 3,
    Name: "Dark Roast Premium",
    Brand: "RoastKing",
    flavors: ["Smoky", "Bitter", "Earthy"]
  },
  {
    id: 4,
    Name: "Vanilla Dream",
    Brand: "CoffeeCloud",
    flavors: ["Vanilla", "Sweet", "Creamy"]
  },
  {
    id: 5,
    Name: "Caramel Fusion",
    Brand: "UrbanBeans",
    flavors: ["Caramel", "Buttery"]
  },
  {
    id: 15,
    Name: "Forest Aroma",
    Brand: "GreenBrew",
    flavors: ["Earthy", "Woody", "Herbal"]
  }
    ];


    findAll(){
        return this.coffees;
    }

    findOne(id:string){
      let  coffeExist = this.coffees.find(item=>item.id == +id);

      if(!coffeExist){
        throw new NotFoundException(`This product is not fouund ${id}`)
      }
      return coffeExist
    }

    create(createCoffeeDto: any){
         this.coffees.push(createCoffeeDto)
         return createCoffeeDto;
    }

    update(id: string, UpdateCoffeeDto: any){
        let existyCoffee = this.findOne(id)
        
    }

    remove(id: string){
        
    }

}
