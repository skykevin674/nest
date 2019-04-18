import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false, unique: true, name: 'username' })
  username: string;

  @Column()
  salt: string;

  @Column({ length: 255, name: 'password_digest' })
  passwordDigest: string;
}
