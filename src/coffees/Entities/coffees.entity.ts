import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { FlavorsEntity } from "./flavors.entity";

@Entity('coffees')
export class Coffees{
   
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    Name:string;
    
    @Column()
    Brand:string;

    @Column({default: 0})
    recommendations: number;
   
   
    @ManyToMany(type=>FlavorsEntity, flavors => flavors.coffees , {cascade:true})
    flavors: FlavorsEntity[];
}