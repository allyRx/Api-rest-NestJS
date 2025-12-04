import { IsNotEmpty, IsString } from "class-validator";

export class CreateCoffeeDto {
   
    @IsString()
    @IsNotEmpty()
   Name:string;
   
   @IsNotEmpty()
   @IsString()
   Brand:string;
   
   @IsNotEmpty()
   @IsString({each: true})
   flavors: string[]
}
 