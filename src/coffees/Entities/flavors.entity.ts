import { Column, Entity, ManyToMany, PrimaryGeneratedColumn ,JoinTable} from "typeorm";
import { Coffees } from "./coffees.entity";


@Entity("flavors")
export class FlavorsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

     @JoinTable()
    @ManyToMany(type=>Coffees, coffees => coffees.flavors)
    coffees: Coffees[];
}
