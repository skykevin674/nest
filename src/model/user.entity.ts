import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false, unique: true, name: 'username' })
  username: string;

  @Exclude()
  @Column()
  salt: string;

  @Exclude()
  @Column({ length: 255, name: 'password_digest' })
  passwordDigest: string;
}
