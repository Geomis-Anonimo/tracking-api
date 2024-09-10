import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'username', type: 'varchar', length: 60, unique: true })
  username: string;

  @Column({name:'password', type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn({name: 'created_at', type: 'date'})
  createdAt: Date;
}
