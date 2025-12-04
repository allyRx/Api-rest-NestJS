import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('coffees')
export class Coffees{
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    Name:string;
    
    @Column()
    Brand:string;
   
    @Column('json', {nullable: true})
    flavors: string[]
}