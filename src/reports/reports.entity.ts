import {Entity, Column, PrimaryGeneratedColumn,AfterInsert,AfterUpdate,AfterRemove} from 'typeorm'

@Entity()
export class Reports{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price:number;



}